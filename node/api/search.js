const getDriver = require('./../neo/driver');
const elastic = require( './../elastic/search')

const search = ( req, res ) => {

    const { data } = req.body;
    let matches = data.split(' ').filter( elem =>  elem );
    let somematches = matches.map( data => {
        return { match : {"quotations.value":  data }};
    })
    let must = [];
    let someothermatch = matches.map( data => {
        return { match : { title : data }}
    })
    if( someothermatch.length > 0 ) {
        must.push({
            nested: {
                path: "quotations",
                query: {
                    bool: {
                        must: somematches,
                    }
                }
            }
        })
    }
    must = must.concat(someothermatch);


    if( must.length > 0 ) {
        elastic.search({
            index: 'document',
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
            return res.status(500).json(error).end();
        })
    } else {
        return res.json([]).end();
    }
}

module.exports = {
    search,
}
