const getDriver = require('./../neo/driver');
const {findParent} = require("../document/findParent");
const SibApiV3Sdk = require('sib-api-v3-sdk');
const config = require('../config');
const {sendEmail} = require("./email");





const inviteEmail = ( id , email, pseudo, user  ) => {

    findParent(id).then((pData) => {
        let parentId = pData.id;
        const driver = getDriver();
        const session = driver.session();
        const query = 'MATCH (d: Document) WHERE d.id = $id ' +
            'RETURN d';
        let result = session.run( query , {id});
        return result.then(data => {
            if (data.records[0]) {
                console.log( data.records[0].get(0).properties);
                const title = data.records[0].get(0)?.properties?.title;

                let subject = "Participe à l'élaboration démocratique d'un document sur queel.fr";
                let template = "<h1>Bonjour,</h1> \n" +
                    "\n" +
                    "<p>Vous avez été invité par {{ params.pseudo }} à contribuer à l'élaboration démocratique du texte : {{ params.title}}</p>\n" +
                    "<p>Vous pouver voter et amender le texte sur <a href=\"{{ params.link }}\">queel.fr</a></p>\n" +
                    "\n" +
                    "<h3>Saisissez votre email et un mot de passe, </h3>\n" +
                    "<H3>abonnez vous au document et commencez.</h3> \n" +
                    "\n" +
                    "<h1>Bonne Contribution !</h1>";
                let params =  {pseudo: user.name ,title, link: config.front + '/document/' + id };

                return sendEmail(email,email, subject, template, params)


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
