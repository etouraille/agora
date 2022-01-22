const { readyForVote } = require('./../vote/readyForVote');
const { voteResult } = require( './../document/voteComplete');

const canVote = ( req, res, next ) => {
    const { id }  = req.body;
    const user = res.username;
    readyForVote(id, user ).then(rfv => {
        voteResult( id ).then( vote => {
            if( rfv.hasSubscribed && rfv.isReadyForVote && !vote.final && rfv.subscribedIsBefore ) {
                next();
            } else {
                res.status( 403).json({rfv , vote }).end();
            }
        }, error => {
            res.status(500).json({reason: error}).end();
        })
    }, error => {
        res.status(500).json({reason: error}).end();
    })
}

module.exports = {
    canVote,
}
