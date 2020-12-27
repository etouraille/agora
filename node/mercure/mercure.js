const { findParent } = require( './../document/findParent');
const jwt = require('jsonwebtoken');
const request = require('request');
const config = require('./../config');

const endpoint = config.mercureEndpoint;
const publisherJwtKey = config.mercureToken;

const sendMessage = ( id ,message , isSubscribe = false ) => {

    findParent(id).then( parentId => {

        const datas = {
            topic: isSubscribe ? 'http://agora.org/subscribe' : 'http://agora.org/document/' + parentId,
            data: JSON.stringify(message)
        };
        const bearer = jwt.sign(
            {mercure: {publish: [datas.topic]}},
            publisherJwtKey,
            {
                expiresIn: 60, // Bearer expiring in one minute
                noTimestamp: true // Do not add "issued at" information to avoid error "Token used before issued"
            }
        );


        request.post(
            {
                url: `https://${endpoint}/.well-known/mercure`,
                auth: {bearer},
                form: datas
            },
            (err, res) => {
                err ? console.log(err) : null;
            }
        );
    }, error => {
        console.log( error );
    })

}


module.exports = {
    sendMessage,
}