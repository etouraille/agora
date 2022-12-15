const getDriver = require('./../neo/driver');
const {v4 : uuid } = require('uuid');
const {sendEmail} = require("../email/email");
const config = require("../config");
const resetPassword = (req, res) => {
    const driver = getDriver();
    const session = driver.session();

    const { email } = req.body;

    let query = "MATCH (u:User) WHERE u.login = $email RETURN u ";

    const result = session.run( query , { email });

    result.then( data => {
        if(!data.records[0]) {
            return res.json({success: false, error: "the email doesn't exists"}, 404);
        } else {
            let token = uuid();
            let _user = data.records[0].get(0).properties;
            query = "MATCH (u:User) WHERE u.login = $email SET u.token = $token  RETURN u ";
            const _result = session.run( query, {email, token});


            return _result.then(() => {
                const template = '<h1>Bonjour {{ params.name }}</h1>' +
                    '<p>Vous avez demandé la réinitialisation de votre email</p>' +
                    '<p>Merci de clicker sur le lien suivant <a href="{{ params.url }}/new-password?token={{ params.token }}">{{ params.url }}/new-password?token={{ params.token }}</a></p>';

                return sendEmail(
                    email,
                    _user.name,
                    'Réinitialisation de votre mot de passe sur queel.fr',
                    template,
                    {name: _user.name, url: config.front, token}).then(() => {
                    res.json({success: true});
                })
            })



        }
    }).catch(error => {
        console.log(error);
        return res.json({success: false, error}, 500);
    }).finally(() => {
        session.close();
        driver.close();
    })
}

const newPassword = ( req, res ) => {
    const { password, token } = req.body;

    const driver = getDriver();
    const session = driver.session();

    if(token) {

        const query = "MATCH( u:User ) WHERE u.token = $token RETURN u ";
        const result = session.run ( query, { token});
        result.then( data => {
            if(data.records[0]) {

                const query2 = "MATCH(u:User) WHERE u.token = $token SET u.password = $password SET u.token = '' RETURN u ";
                return session.run( query2, {token, password}).then(() => {
                    res.json({ success: true});
                });

            } else {

                return res.json({success: false, error: "No matching user"}, 404);
            }
        }).catch(error => {
            console.log(error);
            return res.json({error}, 500);
        }).finally(() => {
            session.close();
            driver.close();
        })

    } else {
        return res.json({success: false, error: "Token undefined"}, 400);
    }
}

module.exports = {
    resetPassword,
    newPassword,
}