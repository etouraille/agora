const getDriver = require('./../neo/driver');
const { sendMessage, sendMessageToAll } = require('../mercure/mercure');
const { processSubscribe ,processUnsubscribe , getLinkedDocuments } = require( '../document/subscribe');
const {subscribe} = require("../subscribe/subscribe");
// inscription a un document
const subscribeDoc = ( req, res ) => {

    const { id } = req.body;
    const driver = getDriver();

    let _query = "MATCH (d:Document) WHERE d.id = $id AND (d.private = false OR d.private IS NULL ) return d ";
    let _session = driver.session();
    _session.run(_query, {id}).then(data => {
        if(data.records.length === 0) {
            return res.status(301).json({reason: 'Unauthorized'})
        } else {
            return subscribe(id, res.userId)
                .then(ids => res.json(ids).end())
                .catch(error => res.status(500).json(error));

        }
    }).catch(error => {
        console.log(error);
        return res.satus(500).json({error});
    }).finally(() => {
        _session.close();
        driver.close();
    })


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
        "WHERE d.id = $id AND u.id = $me " +
        "MERGE (d)-[:OLD_SUBSCRIBED_BY { subscribedAt: r.subscribedAt}]->(u)-[:OLD_HAS_SUBSCRIBE_TO { subscribedAt: r.subscribedAt}]->(d) " +
        "DELETE r , s ";
    let result = session.run(query, {id : id , me : res.userId });


    result.then(data => {

        processUnsubscribe(id, res.userId);

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
    sendMessageToAll({ subject : 'docUnsubscribe', id , user : res.userId});
}
//recupère tout les documents auquel j'ai soucrit et leurs enfants ..
const getSubscribedDoc = (req , res ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = " " +
        "MATCH (d:Document)-[r:SUBSCRIBED_BY]->(u:User) WHERE u.id = $me  " +
        "OPTIONAL MATCH (d)-[s:HAS_CHILDREN*1..]->(c:Document) " +
        //"WHERE reduce(length=0, hasChildren in s | length + CASE NOT EXISTS (hasChildren.voteComplete) OR hasChildren.voteComplete = false WHEN true THEN 1 ELSE 0 END ) = size(s) " +
        "RETURN d , c ";
    let result = session.run( query , {me : res.userId });
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
            let user = elem.get(1) ? elem.get(1).properties.id : null;
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
