const getDriver = require('./../neo/driver');

const documentGet = ( id ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document) WHERE d.id = $id RETURN d ";
    let result = session.run( query , {id });
    return new Promise( ( resolve , reject ) => {
        result.then( data => {
            resolve(data.records[0].get(0).properties );
        }, error => {
            reject( error );
        })
    })
}

module.exports = {
    documentGet,
}
