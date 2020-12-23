const { contents , buildDoc} = require('./../document/contents');
const elastic = require('./../elastic/search');
const elasticRoute = ( req, res ) => {

    let id = req.params.id;

    elastic.indices.refresh({index: 'document' }).then( () => {
        elastic.search({
            index : 'document',
            body: {
                query: {
                    nested: {
                        path: "quotations",
                        query: {
                            bool: {
                                must: [
                                    { match: {"quotations.value": id}},
                                    {match: {"quotations.value": id }}
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
    })

}

module.exports = {
    elasticRoute,
}