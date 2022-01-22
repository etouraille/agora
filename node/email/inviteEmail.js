const getDriver = require('./../neo/driver');
const {findParent} = require("../document/findParent");
const SibApiV3Sdk = require('sib-api-v3-sdk');
const config = require('../config');





const inviteEmail = ( id , email, pseudo ) => {

    findParent(id).then((pData) => {
        let parentId = pData.id;
        const driver = getDriver();
        const session = driver.session();
        const query = 'MATCH (d: Document) WHERE d.id = $id ' +
            'RETURN d';
        let result = session.run( query , {id});
        result.then(data => {
            if (data.records[0]) {
                console.log( data.records[0].get(0).properties);
                const title = data.records[0].get(0)?.properties?.title;
                let defaultClient = SibApiV3Sdk.ApiClient.instance;

                let apiKey = defaultClient.authentications['api-key'];
                apiKey.apiKey = config.sendinblueApiKey;

                let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

                let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

                sendSmtpEmail.subject = "Participe à l'élaboration démocratique d'un document sur queel.fr";
                sendSmtpEmail.htmlContent = "<h1>Bonjour,</h1> \n" +
                    "\n" +
                    "<p>Vous avez été invité par {{ params.pseudo }} à contribuer à l'élaboration démocratique du texte : {{ params.title}}</p>\n" +
                    "<p>Vous pouver voter et amender le texte sur <a href=\"{{ params.link }}\">queel.fr</a></p>\n" +
                    "\n" +
                    "<h3>Saisissez votre email et un mot de passe, </h3>\n" +
                    "<H3>abonnez vous au document et commencez.</h3> \n" +
                    "\n" +
                    "<h1>Bonne Contribution !</h1>";
                sendSmtpEmail.sender = {"name":"Queel.fr","email":"contact@queel.fr"};
                sendSmtpEmail.to = [{"email":email ,"name": email}];
                //sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
                //sendSmtpEmail.bcc = [{"email":"John Doe","name":"example@example.com"}];
                //sendSmtpEmail.replyTo = {"email":"replyto@domain.com","name":"John Doe"};
                //sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
                sendSmtpEmail.params = {pseudo ,title, link: config.front + '/document/' + id };

                apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
                    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                }, function(error) {
                    console.error(error);
                });
            }
        }, error => {
            console.log(error);
        }).finally(() => {
            session.close();
            driver.close();
        })
    })


}

module.exports = {
    inviteEmail,
}
