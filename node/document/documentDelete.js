const getDriver = require('./../neo/driver');

const documentDelete = ( id ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document) WHERE d.id = $id " +
        "OPTIONAL MATCH (d)-[pr:HAS_PARENT]->(p:Document)-[cr:HAS_CHILDREN]->(d) " +
        "OPTIONAL MATCH (d)-[ar:HAS_ARCHIVE]->(a:Document) " +
        "OPTIONAL MATCH (:User)-[vr:VOTE_FOR]->(d) " +
        "OPTIONAL MATCH (d)-[re:FOR_EDIT_BY]->(:User) " +
        "OPTIONAL MATCH (d)-[cbr:CREATED_B]->(:User) " +
        "OPTIONAL MATCH (:User)-[cr:CREATE]->(d) " +
        "OPTIONAL MATCH (d)-[sbr:SUBSCRIBED_BY]->(:User) " +
        "OPTIONAL MATCH (:User)-[sr:HAS_SUBSCRIBE_TO]->(d) " +
        "DELETE pr, ar, vr, re, cbr, cr, sbr, sr , a, d ";

    let result = session.run( query, {id});
    return new Promise((resolve ,reject ) => {
        result.then( data => {
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