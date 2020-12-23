const { contents , buildDoc} = require('./../document/contents');
const elastic = require('./../elastic/search');
const test = ( req, res ) => {
    let id = 'ab476d1b-0d97-412c-b6dd-ea53085b5a72';
    contents( id ).then( data => {
        res.json( data).end();
    })

}

module.exports = {
    test,
}