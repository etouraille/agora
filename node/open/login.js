const getDriver = require('../neo/driver');
const config  = require('../config');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(config.googleKey);
const { v4 : uuid } = require('uuid');
const {addNewUser, updateUser} = require("../elastic/addElastic");
const jwt = require("jsonwebtoken");
const jwtKey = config.jwtKey
const jwtExpirySeconds = config.jwtExpirySeconds;
const axios = require('axios');


const googleAuth = async (token) => {

    console.log( token );

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.googleKey,
    })
    const payload = ticket.getPayload();
    console.log('payload', payload);
    const { sub, email, name, picture } = payload;
    return { userId: sub, email, name, picture};
}

const login = (type) => {

    return async (req, res) => {

        const body = req.body;
        const token = body.tokenId;
        //console.log( body );

        try {
            let {email, name, picture} = type === 'gmail' ? await googleAuth(token) : await getFacebookUserData(token);
            const driver = getDriver();
            const session = driver.session();
            let query = "MATCH (u:User) WHERE u.login = $email RETURN u ";
            session.run(query, {email}).then((data => {
                if (data.records[0]) {
                    // update user
                    query = "MATCH (u:User) WHERE u.login = $email SET u.picture = $picture , u.isGoogle = true, u.name = $name RETURN u";
                    let _session = driver.session();
                    return _session.run(query, {email, picture, name}).then((data) => {
                        // update user in elastic
                        let id = data.records[0].get(0).properties.id;
                        updateUser(id, {email, picture, name, id}).catch(() => {
                            console.log('probleme update elatic user')
                        })
                        return id;
                    }).finally(() => _session.close());
                } else {
                    // add user.
                    query = "CREATE (u:User { id : $id, name : $name, picture: $picture , email: $email, isGoogle : true}) ";
                    let _session = driver.session();
                    let id = uuid();
                    return _session.run(query, {id, name, picture, email}).then(() => {
                        addNewUser({id, name, picture, email}).catch(() => console.log('probleme elastic add user'));
                        return id;
                    }).finally(() => {
                        _session.close();
                    })
                }
            })).then(id => {
                const token = jwt.sign({email, name, id, isGoogle: type==='google', isFacebook: type==='facebook'}, jwtKey, {
                    algorithm: 'HS256',
                    expiresIn: parseInt(jwtExpirySeconds)
                })
                // set the cookie as the token string, with a similar max age as the token
                // here, the max age is in milliseconds, so we multiply by 1000
                res.setHeader('token', token);

                res.json(200, {email: email, token, name});
            }).catch(err => {
                console.log(err);
                return res.status(500).json({reason: err});

            }).finally(() => {
                session.close();
                driver.close();
            })
        } catch (e) {
            console.log(e);
            return res.status(403).json({reason: 'Unauthorized, google token is not valid'})
        }
    }
}



async function getFacebookUserData(access_token) {
    const { data } = await axios({
        url: 'https://graph.facebook.com/me',
        method: 'get',
        params: {
            fields: ['id', 'email', 'first_name', 'last_name', 'picture'].join(','),
            access_token: access_token,
        },
    });
    if (!data.email) throw new Error('Not a valid token');
    data.name = data.first_name + ' ' + data.last_name;
    data.picture = data.picture.data.url;
    return data;
};

exports.loginGmail = login('gmail');
exports.loginFacebook = login('facebook');
