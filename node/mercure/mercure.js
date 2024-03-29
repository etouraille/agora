const { findParent } = require( './../document/findParent');
const jwt = require('jsonwebtoken');
const request = require('request');
const config = require('./../config');
const { getSubscribers } = require('./../document/subscribers')
const { getEditors } = require('./../vote/readyForVote');
const endpoint = config.mercureEndpoint;
const publisherJwtKey = config.mercureToken;

const sendMessage = ( id , user , message , isSubscribe = false ) => {

    console.log('send message =====');

    findParent(id).then( pData => {
        let parentId = pData.id;
        const datas = {
            topic: isSubscribe ? 'http://agora.org/subscribe/' + user : 'http://agora.org/document/' + parentId + '/' + user ,
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

        console.log('endpoint ========================================', endpoint, datas );

        request.post(
            {
                url: `${endpoint}/.well-known/mercure`,
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

const sendMessageToSubscribers = ( id ,message ) => {

    findParent(id).then( pData => {
        let parentId = pData.id;
        getSubscribers(id).then( users => {
            users.forEach( user => {

                message.to = user;

                const datas = {
                    topic: 'http://agora.org/document/' + parentId + '/' + user,
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

                console.log('endpoint ========================================', endpoint);

                request.post(
                    {
                        url: `${endpoint}/.well-known/mercure`,
                        auth: {bearer},
                        form: datas
                    },
                    (err, res) => {
                        err ? console.log(err) : null;
                    }
                );
            })
        })
    }, error => {
        console.log( error );
    })

}

const sendMessageToEditors = ( id ,message ) => {

    getEditors(id).then( users => {
        users.forEach( user => {

            message.to = user;

            console.log( message );

            console.log( 'editors ====', user );

            const datas = {
                topic: 'http://agora.org/subscribe/' + user,
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

            console.log('endpoint ========================================', endpoint);

            request.post(
                {
                    url: `${endpoint}/.well-known/mercure`,
                    auth: {bearer},
                    form: datas
                },
                (err, res) => {
                    err ? console.log(err) : null;
                }
            );
        })
    })


}

const sendMessageToAll = ( message ) => {

        const datas = {
            topic: 'http://agora.org/all',
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

        console.log('endpoint ========================================', endpoint);

        request.post(
                {
                    url: `${endpoint}/.well-known/mercure`,
                    auth: {bearer},
                    form: datas
                },
                (err, res) => {
                    err ? console.log(err) : null;
                }
            );


}


module.exports = {
    sendMessage,
    sendMessageToSubscribers,
    sendMessageToEditors,
    sendMessageToAll,
}
