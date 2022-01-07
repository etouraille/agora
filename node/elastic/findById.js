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
            console.log(  'its', result.body.hits);
            resolve( result.body.hits && result.body.hits.hits[0] ? result.body.hits.hits[0]._id : null );
        })
    })
}

module.exports =  {
    findById
};
