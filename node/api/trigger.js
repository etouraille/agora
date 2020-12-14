const { voteResultFromVoteFor } = require('./../document/voteResultFromVoteFor');
const { voteSuccess } = require('./../document/voteSuccess')
const trigger = (req, res ) => {
    voteResultFromVoteFor(req.params.id ).then( result => {
        console.log( result );
        if( result.majority ) {
            voteSuccess(result.id, result.parentId, result.parentBody, result.documentBody, result.index, result.length)
                .then(data => {
                    console.log( 'success' , data );
                    return res.json({success: true}).end();
                }, error => {
                    console.log( 'error', error );
                    return res.json(500, {reason: error});
                })

        } else {
            return res.json(result).end();
        }
    }, error => {
        return res.json(500, {reason: error });
    })

}

module.exports = {
    trigger,
}