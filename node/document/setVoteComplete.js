const getDriver = require('./../neo/driver');

const voteResult = (documentId ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH(u:User)-[hs:HAS_SUBSCRIBE_TO|HAS_CHILDREN*1..2]->(d:Document) " +
        "WHERE 'HAS_SUBSCRIBE_TO' in [rel in r | type(rel)] " +
        "WHERE d.id =  $id " +
        "OPTIONAL MATCH (u)-[vf:VOTE_FOR]->(d) " +
        "RETURN u, vf ";
    let result = session.run( query , { id : documentId });
    return new Promise((resolve, reject) => {
        result.then(data => {
            let ret = [];
            data.records.forEach( elem  => {
                let vote = { against : null };
                if( elem.get(1)) {
                    vote.against = elem.get(1).properties.against;
                }
                ret.push( vote );
            })
            let participants = ret.length;
            let forIt = ret.reduce( ( a, elem ) => elem.against === false ? a + 1 : a );
            let againstIt = ret.reduce( ( a, elem ) => elem.against === true ? a + 1 : a );
            let abstention = ret.reduce( ( a, elem ) => elem.against === null ? a + 1 : a );
            let fail = againstIt > ( participants / 2 ) && againstIt > forIt;
            let success = forIt >= ( participants / 2 ) && forIt >= againstIt;
            let complete = fail || success;
            resolve({
                participants,
                forIt,
                againstIt,
                abstention,
                fail,
                success ,
                complete })
        }, error => {
            reject( error );
        })
    })
}

const saveComplete = ( documentId , vote ) => {

    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document) WHERE d.id = $id " +
        "MATCH (:User)-[r:VOTE_FOR]->(d)" +
        "SET r.complete = localdatetime() " +
        "SET r.forIt = $forIt " +
        "SET r.againstIt = $againstIt " +
        "SET r.abstention = $abstention " +
        "SET r.participants =  $participants " +
        "SET r.fail = $fail " +
        "SET r.success = $success "
    let result = session.run(query, { ...vote , id : documentId })
    return new Promise((resolve, reject ) => {
        result.then( data => {
            resolve( vote );
        }, error => {
            reject( error );
        })
    })
}

const setVoteComplete = ( documentId ) => {
    return new Promise( ( resolve , reject ) => {
        voteResult(documentId).then( vote => {
            if( vote.complete ) {
                saveComplete(documentId, vote ).then( data => {
                    resolve( vote )
                }, error => {
                    reject( error );
                })
            } else {
                resolve( vote );
            }
        }, error => {
            reject( error );
        })
    })
}

module.exports = {
    voteResult,
    setVoteComplete,
    saveComplete,
};