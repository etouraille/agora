const getDriver = require('./../neo/driver');

const documents = ( req, res ) => {
    const driver = getDriver();
    const session = driver.session();

    const email = res.username;

    try {
        const query = 'MATCH (document:Document ) ' +
            'RETURN document';
        const result = session.run(query )
        result.then( data => {
            const singleResult = data.records[0];
            const ret = [];
            data.records.map( (doc, index ) => {
                ret.push(doc.get(0).properties);
            })


            res.json( ret );
            res.end();
            session.close();
            driver.close();
        }, error => {
            res.json( 500, {reason : error });
            res.end();
            session.close();
            driver.close();
        })
    } finally {

    }
}

module.exports = {
    documents,
};