const getDriver = require('./../neo/driver');

const voteResult = (documentId ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "" +
        "MATCH(u:User)-[hs:OLD_HAS_SUBSCRIBE_TO|HAS_SUBSCRIBE_TO|HAS_CHILDREN*1..]->(d:Document) " +
        "WHERE ('HAS_SUBSCRIBE_TO' in [rel in hs | type(rel)] " +
        "OR 'OLD_HAS_SUBSCRIBE_TO' in [rel in hs | type(rel)] )" +
        "AND d.id =  $id " +
        "WITH CASE 'OLD_HAS_SUBSCRIBE_TO' in [rel in hs | type(rel)]  WHEN true THEN true ELSE false END as isOld, u, hs, d " +
        "OPTIONAL MATCH (u)-[vf:VOTE_FOR]->(d) " +
        "OPTIONAL MATCH (d)-[:HAS_PARENT]->(p:Document) " +
        "RETURN u, vf , hs, d, isOld , p ";

    // on prende en compte tout les vote
    let result = session.run( query , { id : documentId });
    return new Promise((resolve, reject) => {
        result.then(data => {
            let ret = [];
            let final = false;
            let hasParent;
            data.records.forEach( elem  => {
                hasParent = elem.get(5) ? true : false;
                let subscribedAt = elem.get(2).shift().properties.subscribedAt;
                console.log(elem.get(3).properties.id);
                let createdAt = elem.get(3).properties.createdAt;
                let isOld = elem.get(4);
                if ( subscribedAt.lessThanOrEqual(createdAt)) {
                    let vote = {against: null};
                    if (elem.get(1)) {
                        vote.against = elem.get(1).properties.against;
                        if (elem.get(1).properties.complete) {
                            final = {
                                participants: elem.get(1).properties.participants,
                                forIt: elem.get(1).properties.forIt,
                                againstIt: elem.get(1).properties.againstIt,
                                abstention: elem.get(1).properties.abstention,
                                fail: elem.get(1).properties.fail,
                                success: elem.get(1).properties.success,
                                complete: elem.get(1).properties.complete,
                            }
                        }
                    }
                    if(!isOld || (isOld && typeof vote.against === 'boolean')) ret.push(vote);
                }
            })
            let participants = ret.length;
            let forIt = ret.reduce( ( a, elem ) => (elem.against === false ? a + 1 : a ), 0);
            let againstIt = ret.reduce( ( a, elem ) => (elem.against === true ? a + 1 : a ), 0);
            let abstention = ret.reduce( ( a, elem ) => (elem.against === null ? a + 1 : a ), 0);
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
                complete,
                final,
                hasParent,
            })
        }, error => {
            reject( error );
        }).finally( () => {
            session.close();
            driver.close();
        })
    })
}

const saveComplete = ( documentId , vote ) => {

    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document) WHERE d.id = $id " +
        "MATCH (:User)-[r:VOTE_FOR]->(d)" +
        "SET r.complete = datetime() " +
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
        }).finally(() => {
            session.close();
            driver.close();
        })
    })
}

const setVoteComplete = (documentId ) => {
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

const voteIsComplete = (id) => {
    let driver = getDriver();
    let session = driver.session();
    let query = "" +
        "MATCH (:User)-[r:VOTE_FOR]->(d:Document) " +
        "WHERE d.id = $id AND r.complete IS NOT NULL " +
        "RETURN r ";
    let result = session.run( query , {id });
    return new Promise( (resolve , reject ) => {
        result.then( data => {
            if( data.records.length > 0) {
                resolve( true );
            } else {
                resolve( false );
            }
        }, error => {
            reject( error );
        }).finally(() => {
            session.close();
            driver.close();
        })
    })
}

module.exports = {
    voteResult,
    setVoteComplete,
    saveComplete,
    voteIsComplete,
};
