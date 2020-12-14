const getDriver = require('./../neo/driver');

const documents = ( req, res ) => {
    const driver = getDriver();
    const session = driver.session();

    const email = res.username;

    const query = 'MATCH (d:Document ) ' +
        'WHERE NOT (d)-[:HAS_PARENT]->(:Document) ' +
        'AND NOT (:Document)-[:HAS_ARCHIVE]->(d) ' +
        'RETURN d';
    const result = session.run(query )
    result.then( data => {
        const ret = [];
        data.records.map( (doc, index ) => {
            ret.push(doc.get(0).properties);
        })
        res.json( ret );
        res.end();
    }, error => {
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