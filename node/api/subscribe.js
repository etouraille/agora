const getDriver = require('./../neo/driver');

// inscription a un document
const subscribeDoc = ( req, res ) => {

    const { id } = req.body;
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document), (u:User) WHERE d.id = $id AND u.login = $me " +
        "MERGE (d)-[r:SUBSCRIBED_BY]->(u)-[s:HAS_SUBSCRIBE_TO]->(d) ";
    let result = session.run(query, {id : id , me : res.username });

    result.then(data => {
        return res.json(data).end();
    }, error => {
        return res.json(500, {reason : error }).end();
    }).finally(() => {
        session.close();
        driver.close();
    });
}
// desinscription a un document
const unsubscribeDoc = ( req, res ) => {

    const { id } = req.body;
    const driver = getDriver();
    const session = driver.session();
    const query = "" +
        "MATCH (d:Document)-[r:SUBSCRIBED_BY]->(u:User)-[s:HAS_SUBSCRIBE_TO]->(d:Document) " +
        "WHERE d.id = $id AND u.login = $me " +
        "DELETE r , s ";
    let result = session.run(query, {id : id , me : res.username });

    result.then(data => {
        return res.json(data).end();
    }, error => {
        return res.json(500, {reason : error }).end();
    }).finally(() => {
        session.close();
        driver.close();
    });
}
//recupère tout les documents auquel j'ai soucrit
const getSubscribedDoc = (req , res ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = " MATCH (d:Document)-[r:SUBSCRIBED_BY]->(u:User) " +
        "OPTIONAL MATCH (d)-[s:HAS_CHILDREN]->(c:Document)" +
        "WHERE u.login = $me " +
        "RETURN d , c ";
    let result = session.run( query , {me : res.username });
    result.then( data => {
        let result = [];
        data.records.forEach( elem => {
            let id = elem.get(0).properties.id;
            let id2 = elem.get(1) ? elem.get(1).properties.id : null;
            if( id && -1 === result.indexOf( id )) {
                result.push( id );
            }
            if( id2 && -1 === result.indexOf( id2)) {
                result.push( id2 );
            }
        })
        return res.json(result ).end();
    }, error => {
        return res.json(500, {reason : error }).end();
    }).finally(() => {
        session.close();
        driver.close();
    })
}

module.exports = {
    subscribeDoc,
    unsubscribeDoc,
    getSubscribedDoc,
}