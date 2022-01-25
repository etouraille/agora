const getDriver = require('./../neo/driver');
const { sendMessage, sendMessageToAll } = require('../mercure/mercure');
const { processSubscribe ,processUnsubscribe , getLinkedDocuments } = require( '../document/subscribe');
// inscription a un document
const subscribeDoc = ( req, res ) => {

    const { id } = req.body;
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document), (u:User) WHERE d.id = $id AND u.login = $me " +
        "WITH d, u , timestamp() as _ts " +
        "OPTIONAL MATCH (d)-[os:OLD_SUBSCRIBED_BY]->(u), (u)-[ohs:OLD_HAS_SUBSCRIBE_TO]->(d ) " +
        "WITH CASE EXISTS(os.subscribedAt) WHEN true THEN os.subscribedAt ELSE timestamp() END as _ts , d, u , os, ohs " +
        "MERGE (d)-[r:SUBSCRIBED_BY { subscribedAt : _ts }]->(u)-[s:HAS_SUBSCRIBE_TO { subscribedAt : _ts }]->(d) " +
        "DELETE os, ohs ";
    let result = session.run(query, {id : id , me : res.username });

    processSubscribe(id, res.username);

    sendMessageToAll({ subject : 'docSubscribe', id , user : res.username });
    // TODO not sure it's necessary since the message are sent to the parent.
    /*
    getLinkedDocuments(id).then( ids => {
        ids.splice(ids.indexOf(id), 1 );
        ids.forEach( childId => {
            sendMessageToAll({ subject : 'docSubscribe', id: childId , user : res.username });
        })
    })
     */

    result.then(data => {

        getLinkedDocuments( id ).then( ids => {
            return res.json(ids).end();
        }, error => {
            return res.status(500).json({reason : error }).end();
        })


    }, error => {
        console.log( 'errrooooooooooooooooooooorrrr ', error);
        return res.json(500, {reason : error }).end();
    }).finally(() => {
        session.close();
        driver.close();
    });
}
// desinscription a un document
const unsubscribeDoc = ( req, res ) => {

    //TODO : When unsubscribe a doc, if some part are justed amended and there is only one subscriber
    // the amended doc deseappear: because the vote vote is completed as fail ... because there is only one voter that has not vote
    // so hence it is old it is not added.

    const { id } = req.body;
    const driver = getDriver();
    const session = driver.session();
    const query = "" +
        "MATCH (d:Document)-[r:SUBSCRIBED_BY]->(u:User)-[s:HAS_SUBSCRIBE_TO]->(d:Document) " +
        "WHERE d.id = $id AND u.login = $me " +
        "MERGE (d)-[:OLD_SUBSCRIBED_BY { subscribedAt: r.subscribedAt}]->(u)-[:OLD_HAS_SUBSCRIBE_TO { subscribedAt: r.subscribedAt}]->(d) " +
        "DELETE r , s ";
    let result = session.run(query, {id : id , me : res.username });


    result.then(data => {

        processUnsubscribe(id, res.username);

        getLinkedDocuments(id).then( ids => {
            return res.json(ids).end();
        }, error => {
            console.log( error);
            return res.status( 500).json( {reason : error }).end();
        })


    }, error => {
        console.log(error);
        return res.json(500, {reason : error }).end();
    }).finally(() => {
        session.close();
        driver.close();
    });
    sendMessageToAll({ subject : 'docUnsubscribe', id , user : res.username});
}
//recupère tout les documents auquel j'ai soucrit et leurs enfants ..
const getSubscribedDoc = (req , res ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = " " +
        "MATCH (d:Document)-[r:SUBSCRIBED_BY]->(u:User) WHERE u.login = $me  " +
        "OPTIONAL MATCH (d)-[s:HAS_CHILDREN*1..]->(c:Document) " +
        //"WHERE reduce(length=0, hasChildren in s | length + CASE NOT EXISTS (hasChildren.voteComplete) OR hasChildren.voteComplete = false WHEN true THEN 1 ELSE 0 END ) = size(s) " +
        "RETURN d , c ";
    let result = session.run( query , {me : res.username });
    result.then( data => {
        let result = [];
        data.records.forEach( elem => {
            let id = elem.get(0).properties.id;
            let id2 = elem.get(1) ? elem.get(1).properties.id : null;
            let title = elem.get(0).properties.title;
            let index = result.indexOf( id )
            if( id && -1 === index ) {
                result.push( id );
            }
            let index2 = result.indexOf( id2 )
            if( id2 && -1 === index2) {
                result.push( id2 );
            }
        })
        return res.json(result ).end();
    }, error => {
        console.log( error );
        return res.json(500, {reason : error }).end();
    }).finally(() => {
        session.close();
        driver.close();
    })
}

const getSubscribedForDocument = ( req, res ) => {
    let id = req.params.id;
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document)" +
        "WHERE d.id = $id " +
        "OPTIONAL MATCH (d)-[:SUBSCRIBED_BY]->(u:User) " +
        "RETURN d, u ";

    let result = session.run( query , {id});
    result.then( data => {
        let ret = { id };
        data.records.forEach( elem => {
            let doc = elem.get(0).properties;
            let user = elem.get(1) ? elem.get(1).properties.login : null;
            if( ! ret.document  ) {
                ret.document = doc;
                ret.users = [];
            }
            if( user ) {
                ret.users.push( user );
            }
        })
        return res.json( ret ).end();
    }, error => {
        console.log( error );
        return res.status(500).json( { reason : error }).end();
    })
}

module.exports = {
    subscribeDoc,
    unsubscribeDoc,
    getSubscribedDoc,
    getSubscribedForDocument
}
