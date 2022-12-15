const elastic = require( './../elastic/search')

const searchUsers = ( req, res ) => {

    const { data } = req.body;
    let matches = data.split(' ').filter( elem =>  elem );
    let nestedMatch = matches.map( data => {
        return { nested : { path : 'friends', query : { multi_match : { query:  data , fields : ['name', 'email']}}}};
    })
    let must = [];
    let notNestedMatch = matches.map( data => {
        return { multi_match : { query:  data , fields : ['name', 'email']}}
    })
    if( nestedMatch.length > 0 ) {
        must = nestedMatch;
    }
    must = must.concat(notNestedMatch);

    must = notNestedMatch;

    console.log(must);


    if( must.length > 0 ) {
        elastic.search({
            index: 'user',
            body: {
                query: {
                    bool: {
                        should: must
                        //must : someothermatch,
                    }
                }
            }
        }).then(result => {
            return res.json(result.body.hits.hits.map(elem => elem._source)).end();
        }, error => {
            console.log(error.meta.body.error);
            return res.status(500).json(error).end();
        })
    } else {
        return res.json([]).end();
    }
}

module.exports = {
    searchUsers,
}
