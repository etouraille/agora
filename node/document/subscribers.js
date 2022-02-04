const getDriver = require( './../neo/driver');

const getSubscribers = ( id ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "" +
        "MATCH (d:Document)-[r:HAS_PARENT|SUBSCRIBED_BY*1..]->(u:User) " +
        "WHERE 'SUBSCRIBED_BY' in [rel in r | type(rel)] " +
        "AND d.id = $id " +
        "RETURN u ";

    let result = session.run( query , { id });
    return new Promise( (resolve, reject   ) => {
        result.then( data => {
            let ret = []
            data.records.forEach( elem => {
                ret.push( elem.get(0).properties.id );
            })
            resolve( ret );
        }, error => {
            reject( error );
        })

    })
}

module.exports = {
    getSubscribers,
}
