const { voteResult } = require( './../document/voteComplete');
const { readyForVote } = require('./../vote/readyForVote');
const getDriver = require( './../neo/driver');

const isInRange = (needle , haystack ) => {
    if(needle.index < haystack.index ) {
        return (needle.index + needle.length) > haystack.index;
    } else if( needle.index >= haystack.index ) {
        return needle.index < ( haystack.index + haystack.length );
    }
}
const canAmend = ( req , res , next ) => {
    const { id, index , length } = req.body;
    let can = false;
    let needle = { index, length };
    readyForVote(id, res.username ).then( rfv => {
        voteResult(id).then( vote => {
            let myVote = vote.final ? vote.final : vote;
            can = rfv.hasSubscribed && rfv.isReadyForVote && myVote && myVote.fail;
            const driver = getDriver();
            const session = driver.session();
            if( can ) {
                const query = "" +
                    "MATCH(d:Document)-[r:HAS_CHILDREN]->(c:Document) " +
                    "WHERE d.id = $id AND ( r.voteComplete = false OR NOT EXISTS(r.voteComplete ) ) " +
                    "RETURN r ";
                const result = session.run(query, {id});
                result.then(data => {
                    let ret = [];
                    data.records.forEach(elem => {
                        let range = {};
                        range.index = elem.get(0).properties.index;
                        range.length = elem.get(0).properties.length;
                        ret.push(range);
                    })
                    let itIsInRange = false;
                    ret.forEach( range => {
                        if( isInRange(needle, range) ) {
                            itIsInRange = true;
                        }
                    })
                    if( itIsInRange ) {
                        res.status(403).json( {reason : 'is in range'}).end();
                    } else {
                        next();
                    }
                }, error => {
                    console.log( error );
                    res.status(500).json({reason : error }).end();
                }).finally(() => {
                    session.close();
                    driver.close();
                })
            } else {
                res.status(403).json({ myVote , rfv });
            }
        }, error => {
            console.log( error);
            res.status(500).json( {reason : error }).end();
        })
    }, error => {
        console.log( error );
        res.status(500).json( {reason : error }).end();
    })
}

module.exports = {
    canAmend,
}
