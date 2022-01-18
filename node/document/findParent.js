const getDriver = require( './../neo/driver');

const findParent = ( id ) => {

    const driver = getDriver();
    const session = driver.session();
    const query =
        "MATCH (d:Document) WHERE d.id = $id " +
        "OPTIONAL MATCH(d)-[r:HAS_PARENT*]->(p:Document) " +
        "RETURN d, p , size(r) as n " +
        "ORDER BY n DESC ";

    let result = session.run( query , {id});
    return new Promise( (resolve, reject ) => {
        result.then(data => {

            let d = data.records[0]?data.records[0].get(0).properties:null;
            if( ! d  ) {
                reject('No document For id : ' + id );
            } else {
                let p = data.records[0].get(1) ? data.records[0].get(1).properties : null;
                let n = data.records[0].get(2) ? data.records[0].get(2).low : 0;
                if (n === 0) {
                    resolve(d.id);
                } else {
                    resolve(p.id)
                }
            }
        }, error => {
            reject(error);
        })
    })
}

const findFirstParent = (id) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document)-[r:HAS_PARENT]->( p:Document )" +
        " WHERE d.id = $id " +
        "RETURN p ";
    const result = session.run( query , {id});
    return new Promise( (resolve, reject ) => {
        result.then( data => {
            let parentId = null;
            if(data.records[0]) {
                parentId = data.records[0].get(0).properties.id;
            }
            resolve( parentId );
        }, error => {
            reject( error );
        })
    })
}

module.exports = {
    findParent,
    findFirstParent,
}
