const getDriver = require('./../neo/driver');

const documents = ( req, res ) => {
    const driver = getDriver();
    const session = driver.session();

    const email = res.username;

    const query = '' +
        'MATCH (d:Document )-[:SUBSCRIBED_BY]->(m:User)' +
        'WHERE NOT (d)-[:HAS_PARENT]->(:Document) AND m.login = $email ' +
        'AND NOT (:Document)-[:HAS_ARCHIVE]->(d) ' +
        'MATCH (d)-[r:SUBSCRIBED_BY]->(u:User)' +
        'RETURN d, u ';

    const result = session.run(query, {email})
    result.then( data => {
        const ret = [];
        data.records.map( (doc, i ) => {
            let id = doc.get(0).properties.id;
            let user = doc.get( 1).properties.login;
            let index = ret.findIndex( elem => elem.id === id );
            if( index < 0 ) {
                ret.push({id : id , document : doc.get(0).properties , users : [user ]});
            } else {
                ret[index].users.push( user );
            }
        })
        res.json( ret );
        res.end();
    }, error => {
        console.log( error);
        res.json( 500, {reason : error });
        res.end();
    }).finally(() => {
        session.close();
        driver.close();
    })
}

module.exports = {
    documents,
};