const jwt = require('jsonwebtoken')
const getDriver = require('./neo/driver');
const config  = require('./config');

const jwtKey = config.jwtKey
const jwtExpirySeconds = config.jwtExpirySeconds;

const subscribe = (req , res ) => {

    const { email, password } = req.body;
    const driver = getDriver();
    const session = driver.session();
    try {

        const resu = session.run('MATCH (u:User) WHERE u.login = $email RETURN u', {email})

        resu.then(data => {

            if (!data.records[0]) {

                const result = session.run('CREATE (u:User { login : $login, password : $password }) RETURN u ',
                    {login: email, password: password}
                );

                result.then((result) => {

                    session.close();
                    driver.close();
                    const token = jwt.sign({username: email}, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: parseInt(jwtExpirySeconds)
                    })
                    // set the cookie as the token string, with a similar max age as the token
                    // here, the max age is in milliseconds, so we multiply by 1000
                    res.setHeader('token', token);

                    res.json(200, {email: email, password: password, token});
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
    const result = session.run('MATCH(u:User) WHERE u.login = $email RETURN u.password', { email : username });
    result.then(value => {
        let recordedPassword = value.records[0].get(0);
        if( recordedPassword !== password ) {
          res.json(401, { token : null}).end();
          return;
        } else {
            const token = jwt.sign({ username }, jwtKey, {
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
                res.username = payload.username;
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
            const newToken = jwt.sign({ username: payload.username }, jwtKey, {
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
