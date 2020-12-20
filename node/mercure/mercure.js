
const jwt = require('jsonwebtoken');
const request = require('request');

const endpoint = 'flibus.team';
const publisherJwtKey = 'changeIt';

const voteMercure = ( against, id , user ) => {

    const datas = {
        topic: 'http://agora.org/votes/' + id,
        data: JSON.stringify({
            against,
            id,
            user
        })
    };
    const bearer = jwt.sign(
        { mercure: { publish: [ datas.topic ] } },
        publisherJwtKey,
        {
            expiresIn: 60, // Bearer expiring in one minute
            noTimestamp: true // Do not add "issued at" information to avoid error "Token used before issued"
        }
    );

    return new Promise( (resolve, reject ) => {
        request.post(
            {
                url: `https://${endpoint}/.well-known/mercure`,
                auth: {bearer},
                form: datas
            },
            (err, res) => {
                err ? reject( err ) : resolve(res);
            }
        );
    })

}

const sendMessage = ( id ,message ) => {

    console.log( 'id du message', id );

    const datas = {
        topic: 'http://agora.org/document/' + id,
        data: JSON.stringify( message )
    };
    const bearer = jwt.sign(
        { mercure: { publish: [ datas.topic ] } },
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
            err ? console.log( err) : null;
        }
    );


}


module.exports = {
    voteMercure,
    sendMessage,
}