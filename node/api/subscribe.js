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
    const query = " " +
        "MATCH (d:Document)-[r:SUBSCRIBED_BY]->(u:User) WHERE u.login = $me  " +
        "OPTIONAL MATCH (d)-[q:SUBSCRIBED_BY]->(someUserD:User) " +
        "OPTIONAL MATCH (d)-[s:HAS_CHILDREN*1..]->(c:Document) " +
        "WHERE reduce(length=0, hasChildren in s | length + CASE NOT EXISTS (hasChildren.voteComplete) WHEN true THEN 1 ELSE 0 END ) = size(s) " +
        "OPTIONAL MATCH (c)-[t:HAS_PARENT*1..]->(p:Document)-[:SUBSCRIBED_BY]->(someUserC:User) " +
        "WHERE reduce(length=0, n in t | length + CASE NOT EXISTS (n.voteComplete) WHEN true THEN 1 ELSE 0 END ) = size(t) " +
        "RETURN d , c , someUserD , someUserC";
    let result = session.run( query , {me : res.username });
    result.then( data => {
        let result = [];
        //TODO traitement de la requête pas complet si on est à plus de 1 de profondeur pour HAS_CHILDREN
        data.records.forEach( elem => {
            let id = elem.get(0).properties.id;
            let title = elem.get(0).properties.title;
            let id2 = elem.get(1) ? elem.get(1).properties.id : null;
            let user = elem.get(2) ? elem.get(2).properties.login : null;
            let user2 = elem.get(3) ? elem.get(3).properties.login : null;
            let index = null;
            let index2 = null;
            console.log( user ); console.log( title );
            index = result.findIndex( elem => elem.id === id )
            if( id && -1 === index ) {
                result.push( { id : id , users : []});
            }
            index = result.findIndex( elem => elem.id === id )
            if( index >= 0 && user  ) {
                result[index].users.push( user );
            }
            index2 = result.findIndex( elem => elem.id === id2 )
            if( id2 && -1 === index2) {
                result.push( { id : id2 , users : []} );
            }
            index2 = result.findIndex( elem => elem.id === id2 )
            if( index2 >= 0 && user2 ) {
                result[index2].users.push( user2);
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

module.exports = {
    subscribeDoc,
    unsubscribeDoc,
    getSubscribedDoc,
}