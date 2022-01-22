const getDriver = require('./../neo/driver');
const { voteSuccess, voteFail  } = require('./../document/voteSuccess');
const { saveComplete , voteResult } = require('../document/voteComplete')
const { sendMessage, sendMessageToSubscribers , sendMessageToEditors , sendMessageToAll }  = require('../mercure/mercure');
const { onVoteFailOrSuccess,onReadyForVoteComplete} = require('./../document/elasticProcess')
const { sendNotificationReadyForVote,
    sendNotificationVoteSuccess,
    sendNotificationVoteFail,
    removeInviteNotificationOnReadyForVote ,
    removeReadyForVoteNotificationOnVote,
    removeAllReadyForVoteNotificationOnVoteSuccessOrFail } = require('./../notification/notification')
const {voteComplete, voteFailure} = require("../vote/voteComplete");
const {sendNotificationNewRound, sendNotificationRoundVoteFail} = require("../notification/notification");
const {addRound} = require("./round");
const {findParent} = require("../document/findParent");
const isReadyForVote = (id) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH(d:Document)-[r:FOR_EDIT_BY]->(u:User) " +
        "WHERE d.id = $id " +
        "RETURN r , u ";
    let result = session.run( query , {id});
    return new Promise( (resolve, reject ) => {
        result.then(data => {
            let ret = [];
            let users = [];
            data.records.forEach( elem => {
                ret.push({vote: elem.get(0).properties.readyForVote, round: elem.get(0).properties.round });
                users.push(elem.get(1).properties.login )
            })
            let _for = ret.reduce((a, b) => ( b.vote === true ? a + 1: a ), 0);
            let _against = ret.reduce((a, b) => ( b.vote === false ? a + 1: a ), 0);
            let _min = ret.map(elem => elem.round).min();
            let _max = ret.map(elem => elem.round).max();
            let res = (_min === _max) && voteComplete(_for, _against, ret.length, 'consensus');
            let voteFail = (_min === _max) && voteFailure(_for, _against, ret.length, 'consensus');
            resolve( { ready : res, users, voteFail });
        }, error => {
            reject( error );
        })
    })
}

const readyForVote = (req , res ) => {
    const driver = getDriver();
    const session = driver.session();
    const { id , readyForVote } = req.body;
    const me = res.username;


    const query = '' +
        'MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) WHERE d.id = $id AND u.login = $me ' +
        'OPTIONAL MATCH (d)-[:HAS_PARENT]->(p:Document) ' +
        'SET r.readyForVote = $readyForVote ' +
        'RETURN r, p ';
    let result = session.run( query , {id : id , me : me  , readyForVote});
    result.then( data => {
        sendMessageToEditors(id ,{ id, user : me ,  subject : 'setReadyForVote', vote: readyForVote});
        let parentId = data.records[0].get(1) ? data.records[0].get(1).properties.id : null;
        let round = typeof data.records[0].get(0).properties.round.low === 'number' ?  data.records[0].get(0).properties.round.low :  data.records[0].get(0).properties.round;
        isReadyForVote(id).then( async ( rfv ) => {
            if( rfv.ready ) {
                if ( parentId ) sendMessageToAll({ id : parentId, sender  : me , subject : 'reloadDocument'}, true );
                //TODO rajouter un abonnement quand on est sur le document et le supprimer quand on en part
                //TODO ainsi on pourrra cibler uniquement sur ceux qui sont présnts sur le doc
                onReadyForVoteComplete(id);
                sendNotificationReadyForVote(id, me );
                removeInviteNotificationOnReadyForVote(id, rfv.users, me );
            } else if(rfv.voteFail )  {
                sendNotificationRoundVoteFail(id, me);
            }
        })
        res.json({ user : me , round }).end();
    }, error => {
        console.log( error );
        res.json(500, {reason : error });
    }).finally(() => {
            session.close();
            driver.close();
    })
}
//fournit la liste des utilisteur autorisés en modification
// et le fait qu'ils aient validé ou non le documents.
const getReadyForVote = async ( req , res ) => {
    const id = req.params.id;
    const driver = getDriver();
    const session = driver.session();
    const query = 'MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) WHERE d.id = $id ' +
        'RETURN r, u, d ';

    const { id : parentId } = await findParent(id);
    const result = session.run( query , { id : id });
    result.then( data => {
        let ret = [];
        if( data.records.length > 0 ) {
            return Promise.all(data.records.map( (elem , index) => {
                let email = elem.get(1).properties.login
                let createdAt = elem.get(2).properties.createdAt.low;
                const _query = "MATCH (d:Document)-[r:SUBSCRIBED_BY]->(u:User) WHERE d.id = $parentId AND u.login = $email RETURN r";
                const _sess = driver.session();
                return _sess.run(_query, {parentId, email }).then((data) => {
                    let subscribedAt = null;
                    if (data.records[0]) {
                       subscribedAt = data.records[0].get(0).properties.subscribedAt.low;
                    }
                    return {
                        user : email,
                        readyForVote : elem.get(0).properties.readyForVote,
                        invitedBy : elem.get(0).properties.invited,
                        round: typeof elem.get(0).properties.round.low === 'number' ? elem.get(0).properties.round.low : elem.get(0).properties.round,
                        subscribedIsBefore: subscribedAt ? subscribedAt <= createdAt: false
                    }
                }).finally(() => {
                    _sess.close();
                })

            }))
        } else {
            return [];
        }

    }, error => {
        return res.json( 500, {reason : error }).end();
    }).then((data) => {
        return res.json( data ).end();
    }).finally(() => {
        session.close();
        driver.close();
    })
}

const againstIt = ( req , res ) => {

    const {id } = req.body;
    const driver = getDriver();
    const session = driver.session();
    let user = res.username;
    const query = "MATCH (u:User) , (d:Document) WHERE u.login = $me AND d.id = $id " +
        "MERGE (u)-[r:VOTE_FOR { against : true}]->(d) RETURN r ";
    let result = session.run( query , { id: id  , me : user });
    result.then( data => {

        sendMessageToSubscribers(id , {id, user , subject : 'voteAgainst'});

        voteResult(id).then( vote => {
            if (vote.complete && vote.fail) {
                // on sauvegarde le resultat du vote dans les différents VOTE_FOR.
                saveComplete(id, vote).then(data => {
                    // on sauvegarde la relation voteComplete = false dans les différents HAS_CHILDREN|HAS_PARENT
                    voteFail(id).then(data => {
                        res.json({vote: vote, reload: true}).end();
                        sendMessageToSubscribers(id, {id , user , subject : 'voteComplete'});
                        onVoteFailOrSuccess(id).then(() => {
                            sendNotificationVoteFail(id, user ).then(() => {
                                removeAllReadyForVoteNotificationOnVoteSuccessOrFail(id);
                            })
                        }, error => {
                            console.log ( error);
                        })
                        return;
                    }, error => {
                        return res.json(500, {reason: error}).end();
                    })
                }, error => {
                    return res.json(500, {reason: error}).end();
                })
            } else {
                return res.json({vote: vote, reload: false});
            }

        }, error => {
            return res.json(500, {reason : error }).end();
        })
        removeReadyForVoteNotificationOnVote(id, user);
    }, error => {
        return res.json(500, {reason : error });
    }).finally(() => {
        session.close();
        driver.close();
    })
}


const forIt = (req, res ) => {
    const { id } = req.body;
    const driver = getDriver();
    const session = driver.session();
    let user = res.username;
    const query = "MATCH (u:User) , (d:Document) WHERE u.login = $me AND d.id = $id " +
        "MERGE (u)-[r:VOTE_FOR { against : false }]->(d) RETURN r";
    let result = session.run( query , { id: id  , me : user });
    result.then( data => {
        sendMessageToSubscribers( id , {id, user , subject : 'voteFor'});
        voteResult(id).then( vote => {
            if( vote.success ) {
                voteSuccess(id).then( data => {
                    if( data.updated) {
                        sendMessageToSubscribers(data.parentId , {
                            id : data.parentId ,
                            user,
                            subject : 'reloadDocument'});
                    }
                    saveComplete(id, vote).then( vote => {
                        res.json({ majority : true , reload : data.updated , parentId : data.parentId }).end();
                        sendMessageToSubscribers( id , { id ,  user , subject : 'voteComplete'});
                        onVoteFailOrSuccess(id).then(() => {
                            sendNotificationVoteSuccess(id , user ).then(() => {
                                removeAllReadyForVoteNotificationOnVoteSuccessOrFail(id);
                            })
                        })
                        return
                    }, error => {
                        return res.json(500, {reason : error });
                    })

                }, error => {
                    return res.json(500, {reason : error });
                })
            } else {
                return res.json({ majority : false, reload : false });
            }
        }, error => {
            console.log(error);
            return res.json(500, {reason : error });
        })
        removeReadyForVoteNotificationOnVote(id, user);

    }, error => {
        return res.json(500, {reason : error });
    }).finally(() => {
        session.close();
        driver.close();
    })
}

const getVoters = ( req, res ) => {
    const id = req.params.id;
    const driver = getDriver();
    const session = driver.session();

    const query = "" +
        "MATCH (d:Document)" +
        "WHERE d.id = $id " +
        "MATCH (d)-[r:SUBSCRIBED_BY|HAS_PARENT*1..]->(u:User) " +
        "WHERE 'SUBSCRIBED_BY' in [rel in r | type(rel)]" +
        "OPTIONAL MATCH (u)-[v:VOTE_FOR]->(d) " +
        "RETURN u,v ";

    //console.log( id );
    //console.log( query );

    const result = session.run( query , {id : id })
    result.then( data => {
        let votes = [];
        data.records.forEach( elem => {
            let vote = {};
            let user = elem.get(0)?elem.get(0).properties.login:null;
            if( user) {
                vote.user = user;
                if( elem.get(1)) {
                    vote.against = elem.get(1).properties.against;
                    let r = elem.get(1).properties;
                    if( r.complete ) {
                        let final = {
                            date: r.complete,
                            forIt: r.forIt,
                            againstIt : r.againstIt,
                            participants : r.participants,
                            abstention : r.abstention,
                            success : r.success,
                            fail : r.fail,
                        }
                        vote.final = final;
                    }
                } else {
                    vote.against = null;
                }
                votes.push( vote );
            }
        })
        return res.json( votes ).end();
    }, error => {
        console.log( error );
        return res.json(500, {reason : error }).end();
    }).finally( () => {
        session.close();
        driver.close();
    })
}

const deleteVote = ( req, res ) => {
    const id = req.params.id;
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (:User)-[r:VOTE_FOR]->( d:Document ) " +
        "WHERE d.id = $id " +
        "OPTIONAL MATCH (d)-[r1:HAS_PARENT]->(p:Document)-[r2:HAS_CHILDREN]->(d) " +
        "REMOVE r1.voteComplete " +
        "REMOVE r2.voteComplete " +
        "DELETE r ";
    let result = session.run( query , { id });
    result.then( data => {
        return res.json({ok : true }).end();
    },error => {
        return res.status(500).json( {reason  : error }).end();
    }).finally( () => {
        session.close();
        driver.close();
    })
}



module.exports = {
    readyForVote,
    getReadyForVote,
    againstIt,
    forIt,
    getVoters,
    deleteVote,
    isReadyForVote,
}
