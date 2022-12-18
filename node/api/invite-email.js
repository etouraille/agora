const getDriver = require('./../neo/driver');
const { sendInvite } = require('./../notification/notification')
const { sendMessage } = require('./../mercure/mercure')
const {sendInviteEmail} = require("../notification/notification");
const {inviteEmail : sendInviteSendinblue} = require('../email/inviteEmail');
const inviteEmail = ( req, res ) => {

    const { id , emails } = req.body;

    if( Array.isArray(emails) && emails.length > 0 ) {
        emails.forEach((email) => {
            const driver = getDriver();
            const session = driver.session();
            const query = 'MATCH (user: User ) WHERE user.login = $email ' +
                'RETURN user';
            let result = session.run( query , {email});
            result.then(data => {
                if (data.records[0]) {
                    // EMAIL EXISTS send notif
                    sendInviteEmail(id, email, res.email, res._user);
                    // send email
                }
                sendInviteSendinblue(id, email, res.email);

                res.json({success: true});

            }, error => {
                res.json(500, {reason : error });
            }).finally(() => {
                session.close();
                driver.close();
            })
        })
    } else {
        res.json({success: false});
    }



}


module.exports = {
    inviteEmail,
}
