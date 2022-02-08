const getDriver = require('./../neo/driver');
const { deleteElastic } = require('./../elastic/deleteElastic');

const documentDelete = ( id ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document) WHERE d.id = $id " +
        "OPTIONAL MATCH (d)-[pr:HAS_PARENT]->(p:Document)-[cr:HAS_CHILDREN]->(d) " +
        "OPTIONAL MATCH (d)-[hc:HAS_CHILDREN]->(c)-[hp:HAS_PARENT]->(d) "  +
        "OPTIONAL MATCH (d)-[ar:HAS_ARCHIVE]->(a:Document) " +
        "OPTIONAL MATCH (d)-[ar2:HAS_ARCHIVE]->(a2:Archive) " +
        "OPTIONAL MATCH (:User)-[vr:VOTE_FOR]->(d) " +
        "OPTIONAL MATCH (d)-[re:FOR_EDIT_BY]->(:User) " +
        "OPTIONAL MATCH (d)-[cbr:CREATE_BY]->(:User) " +
        "OPTIONAL MATCH (:User)-[cre:CREATE]->(d) " +
        "OPTIONAL MATCH (d)-[sbr:SUBSCRIBED_BY]->(:User) " +
        "OPTIONAL MATCH (:User)-[sr:HAS_SUBSCRIBE_TO]->(d) " +
        "OPTIONAL MATCH (d)-[osbr:OLD_SUBSCRIBED_BY]->(:User) " +
        "OPTIONAL MATCH (:User)-[osr:OLD_HAS_SUBSCRIBE_TO]->(d) " +
        "OPTIONAL MATCH (:User)-[has_notif:HAS_NOTIFICATION]->(notification:Notification)-[notify_on:NOTIFY_ON]->(d)" +
        "OPTIONAL MATCH (:Notification)-[no:NOTIFY_ON]->(d) " +
        "OPTIONAL MATCH (d)-[ha:HAS_ATTACHMENT]->(Attachment) " +
        "DELETE has_notif " +
        "DELETE  notify_on " +
        "DELETE  notification " +
        "DELETE pr " +
        "DELETE cr " +
        "DELETE  hc " +
        "DELETE hp " +
        "DELETE ar " +
        "DELETE  ar2 " +
        "DELETE vr " +
        "DELETE  re " +
        "DELETE  cbr " +
        "DELETE  cre " +
        "DELETE  sbr " +
        "DELETE sr " +
        "DELETE  a " +
        "DELETE  a2 " +
        "DELETE osbr " +
        "DELETE  osr " +
        "DELETE no " +
        "DELETE ha " +
        "DELETE  d " +
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
