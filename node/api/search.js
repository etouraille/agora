const getDriver = require('./../neo/driver');
const elastic = require( './../elastic/search')

const search = ( req, res ) => {

    const { data } = req.body;
    console.log( data );

    elastic.search({
        index : 'document',
        body: {
            query: {
                nested: {
                    path: "quotations",
                    query: {
                        bool: {
                            must: [
                                { match: {"quotations.value": data}},
                                //{match: {"quotations.value": "these"}}
                            ]
                        }
                    }
                }
            }
        }
    }).then( result => {
        return res.json( result.body.hits.hits ).end();
    },error => {
        return res.status(500).json( error ).end();
    })


    /*
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH(d:Document )" +
        "WHERE d.body =~ '(?im).*" + data + ".*' " +
        "AND NOT (:Document)-[:HAS_ARCHIVE]->(d) " +
        "OPTIONAL MATCH  (d)-[r:HAS_PARENT*1..]->(p:Document) " +
        "OPTIONAL MATCH (p)-[:HAS_PARENT]->(gp:Document)" +
        "RETURN d, p , gp , size(r) as N " +
        "ORDER BY N DESC ";
    let result = session.run( query );
    result.then(data => {
        let ret = [];
        data.records.forEach( ( elem ) => {
            let doc = elem.get(0).properties;
            let parent = elem.get(1)? elem.get(1).properties : null;
            let grandParent = elem.get(2)? elem.get(2).properties : null;
            let id;
            if(! grandParent && !parent ) {
                id = doc.id;
            } else if ( parent && !grandParent && parent.id !== doc.id ) {
                id = parent.id;

            } else {
                id = null;
            }
            if( id ) {
                let index = ret.findIndex(elem => elem.id === id);
                if (index === -1) {
                    ret.push({id: id, title: parent ? parent.title : doc.title});
                }
            }
        });
        return res.json(ret).end();
    }, error => {
        return res.status(500).json({reason: error }).end();
    }).finally(() => {
        session.close();
        driver.close();
    })
     */
}

module.exports = {
    search,
}