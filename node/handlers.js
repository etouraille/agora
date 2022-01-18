const jwt = require('jsonwebtoken')
const getDriver = require('./neo/driver');
const config  = require('./config');
const { v4 : uuid } = require('uuid')
const {addNewUser} = require("./elastic/addElastic");
const jwtKey = config.jwtKey
const jwtExpirySeconds = config.jwtExpirySeconds;

const subscribe = async (req , res ) => {

    const { email, password , name } = req.body;
    const driver = getDriver();
    const session = driver.session();
    try {

        const resu = session.run('MATCH (u:User) WHERE u.login = $email RETURN u', {email})

        resu.then(data => {

            if (!data.records[0]) {

                const _user = {email, password, name, id: uuid()};


                const result = session.run('CREATE (u:User { login : $email, password : $password , name: $name , id : $id }) RETURN u ',
                    _user
                );

                result.then((result) => {

                    session.close();
                    driver.close();

                    try {
                        addNewUser(_user, null);
                    } catch(e) {
                        return res.status(500).json({ error: 'Elastic error adding user'});
                    }

                    const token = jwt.sign({email, name, id: _user.id}, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: parseInt(jwtExpirySeconds)
                    })
                    // set the cookie as the token string, with a similar max age as the token
                    // here, the max age is in milliseconds, so we multiply by 1000
                    res.setHeader('token', token);

                    res.json(200, {email: email, password: password, token, name});
                    res.end();
                }, (reason) => {
                    session.close();
                    driver.close();
                    res.json(500, {reason: reason});
                    res.end();
                })
            } else {
                res.status(409).json({reason: 'User already exists', exists: true});
                session.close();
                driver.close();
            }

        })

    } finally {

    }

}

const signIn = (req, res) => {
    // Get credentials from JSON body
    const { username, password } = req.body

    const driver = getDriver();
    const session = driver.session();
    const result = session.run('MATCH(u:User) WHERE u.login = $email RETURN u ', { email : username });
    result.then(value => {
        let _user = {};
        let recordedPassword = value.records[0].get(0).properties.password;
        let id = value.records[0].get(0).properties.id;
        let picture = value.records[0].get(0).properties?.picture;
        let name = value.records[0].get(0).properties?.name;

        if (id) _user['id'] = id;
        if (picture) _user['picture'] = picture;
        if (name) _user['name'] = name;
        if (username) _user['email'] = username;

        if( recordedPassword !== password ) {
          res.json(401, { token : null}).end();
          return;
        } else {
            const token = jwt.sign( _user, jwtKey, {
                algorithm: 'HS256',
                expiresIn: parseInt(jwtExpirySeconds)
            })
            // set the cookie as the token string, with a similar max age as the token
            // here, the max age is in milliseconds, so we multiply by 1000
            res.setHeader('token', token );
            res.json({token : token, user : username  });
            res.end()
            return;
        }
    }, reason => {
        res.json(500, {reson : reason }).end();
        return;
    });
}
const eachCheckToken = (req , res, next ) => {

    if( req.method !== 'OPTIONS' && req.originalUrl.match(/api/)) {
        let auth = req.header('Authorization');
        const regexp = /Bearer (.*)$/;
        if(auth && auth.match(regexp) && auth.match( regexp)[1]) {
            let token = auth.match( regexp)[1];
            try {
                payload = jwt.verify( token, jwtKey);
                res.username = payload.email;
                res.userId = payload.id;
            } catch( e ) {
                if( e instanceof jwt.JsonWebTokenError) {
                    return res.status(401).end();
                }
            }
            function toDateTime(secs) {
                var t = new Date(1970, 0, 1); // Epoch
                t.setSeconds(secs);
                return console.log( t );
            }
            const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
            if (payload.exp - nowUnixSeconds < 0) {
                return res.status(400).end()
            }

            // Now, create a new token for the current user, with a renewed expiration time
            const newToken = jwt.sign({ email: payload.email, id: payload.id, name: payload.name, picture: payload.picture }, jwtKey, {
                algorithm: 'HS256',
                expiresIn: parseInt(jwtExpirySeconds)
            })


            // Set the new token as the users `token` cookie
            res.setHeader('token', newToken);
            next()
        } else {
            return res.status(401).json( { unauthorised : true });
        }
    } else {
        next();
    }

}


module.exports = {
    signIn,
    subscribe,
    eachCheckToken,
}
