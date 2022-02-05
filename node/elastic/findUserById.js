const elastic = require( './search');

const findUserById = ( id ) => {

    return new Promise( (resolve , reject ) => {
        elastic.search({
            index: 'user',
            body: {
                query: {
                    match: { id: id  }
                }
            }
        }).then(result => {
            resolve( result.body.hits && result.body.hits.hits[0] ? result.body.hits.hits[0]._id : null );
        }).catch(err => {
            reject(err);
            console.log( 'elastic error : ' ,err);
        })
    })
}

module.exports =  {
    findUserById
};
