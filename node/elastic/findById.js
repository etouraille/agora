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
        }, (err, result) => {
            console.log(  result.body.hits.hits[0]);
            resolve( result.body.hits.hits[0]._id );
        })
    })
}

module.exports =  {
    findById
};