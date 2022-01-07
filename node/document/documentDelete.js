const getDriver = require('./../neo/driver');
const { deleteElastic } = require('./../elastic/deleteElastic');

const documentDelete = ( id ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document) WHERE d.id = $id " +
        "OPTIONAL MATCH (d)-[pr:HAS_PARENT]->(p:Document)-[cr:HAS_CHILDREN]->(d) " +
        "OPTIONAL MATCH (d)-[hc:HAS_CHILDREN]->(c)-[hp:HAS_PARENT]->(d) "  +
        "OPTIONAL MATCH (d)-[ar:HAS_ARCHIVE]->(a:Document) " +
        "OPTIONAL MATCH (:User)-[vr:VOTE_FOR]->(d) " +
        "OPTIONAL MATCH (d)-[re:FOR_EDIT_BY]->(:User) " +
        "OPTIONAL MATCH (d)-[cbr:CREATE_BY]->(:User) " +
        "OPTIONAL MATCH (:User)-[cre:CREATE]->(d) " +
        "OPTIONAL MATCH (d)-[sbr:SUBSCRIBED_BY]->(:User) " +
        "OPTIONAL MATCH (:User)-[sr:HAS_SUBSCRIBE_TO]->(d) " +
        "OPTIONAL MATCH (:User)-[has_notif:HAS_NOTIFICATION]->(notification:Notification)-[notify_on:NOTIFY_ON]->(d)" +
        "DELETE has_notif , notify_on, notification, pr, cr, hc, hp, ar, vr, re, cbr, cre, sbr, sr , a, d " +
        "RETURN c ";

    let result = session.run( query, {id});
    return new Promise((resolve ,reject ) => {
        result.then( data => {
            deleteElastic(id);
            data.records.forEach( elem => {
                if( elem.get(0 )) {
                    let childrenId = elem.get(0).properties.id;
                    documentDelete(childrenId).then(p => {

                    }, er => {
                        reject(er);
                    })
                }
            })
            resolve(true );
        }, error => {
            console.log(error);
            reject( error );
        })
    })
}

module.exports = {
    documentDelete,
}