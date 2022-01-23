const elastic = require( './search');

const findById = ( id ) => {

    return new Promise( (resolve , reject ) => {
        elastic.search({
            index: 'document',
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
    findById
};
