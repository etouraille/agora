const getDriver = require('./../neo/driver');
const { sendInvite } = require('./../notification/notification')
const { sendMessage } = require('./../mercure/mercure')
const {sendInviteEmail} = require("../notification/notification");
const {inviteEmail : sendInviteSendinblue} = require('../email/inviteEmail');
const {subscribeDoc} = require("./subscribe");
const {v4 : uuid } = require('uuid');
const {subscribe} = require("../subscribe/subscribe");

const inviteEmail = ( req, res ) => {

    const { id, users } = req.body;

    if( Array.isArray(users) && users.length > 0 ) {
        users.forEach((user) => {
            const driver = getDriver();
            const session = driver.session();
            const idOrEmail = user.value;
            const isUser = user.isUser;
            if (!isUser) {
                const query = 'MATCH (user: User ) WHERE user.login = $email ' +
                    'RETURN user';
                let result = session.run(query, {email:idOrEmail});
                result.then(data => {
                    if (data.records[0]) {
                        // EMAIL EXISTS send notif
                        sendInviteEmail(id, idOrEmail, res.email, res._user);
                        // send email
                        sendInviteSendinblue(id, idOrEmail, res.email, res._user);
                        let user = data.records[0].get(0).properties.id;
                        subscribe(id, user).then();

                    } else {
                        let token = uuid();
                        let _query = "CREATE(u:InvitedUser { login: $email, token: $token, documentId: $id}) ";
                        let _session = driver.session();
                        sendInviteSendinblue(id, idOrEmail, res.email, res._user, token);
                        return _session.run(_query, {email: idOrEmail, token, id }).then().catch(error => console.log(error))
                            .finally(() => _session.close());

                    }

                    res.json({success: true});

                }, error => {
                    res.json(500, {reason: error});
                }).finally(() => {
                    session.close();
                    driver.close();
                })
            } else {
                sendInviteEmail(id, idOrEmail, res.email, res._user);
                const query = "MATCH (user:User) WHERE user.id = $id  return user ";
                let result = session.run(query, {id: idOrEmail}).then(data => {
                    let email = data.records[0].get(0).properties.login;
                    sendInviteSendinblue(id, email, res.email, res._user);
                    subscribe(id, idOrEmail).then();
                    res.json({ success: true});
                })
            }
        })
    } else {
        res.json({success: false});
    }



}


module.exports = {
    inviteEmail,
}
