const getDriver = require('./../neo/driver');
const { voteResultFromDocument } = require('./../document/voteResultFromDocument');
const { voteSuccess, voteFail  } = require('./../document/voteSuccess');
const { saveComplete , voteResult } = require('../document/voteComplete')
const { sendMessage } = require('../mercure/mercure');

const readyForVote = (req , res ) => {
    const driver = getDriver();
    const session = driver.session();
    const { id } = req.body;
    const me = res.username;


    const query = 'MATCH (d:Document)-[r:FOR_EDIT_BY]->( u:User) WHERE d.id = $id AND u.login = $me ' +
        'SET r.readyForVote = true RETURN r ';
    let result = session.run( query , {id : id , me : me  });
    result.then( data => {
        res.json({ user : me }).end();
    }, error => {
        res.json(500, {reason : error });
    }).finally(() => {
            session.close();
            driver.close();
    })
}
//fournit la liste des utilisteur autorisés en modification
// et le fait qu'ils aient validé ou non le documents.
const getReadyForVote = ( req , res ) => {
    const id = req.params.id;
    const driver = getDriver();
    const session = driver.session();
    const query = 'MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) WHERE d.id = $id' +
        ' RETURN r, u ';
    const result = session.run( query , { id : id });
    result.then( data => {
        let ret = [];
        if( data.records.length > 0 ) {
            data.records.forEach( (elem , index) => {
                ret.push({
                    user : elem.get(1).properties.login,
                    readyForVote : elem.get(0).properties.readyForVote,
                    invitedBy : elem.get(0).properties.invited
                })
            })
        }
        return res.json( ret ).end();
    }, error => {
        return res.json( 500, {reason : error }).end();
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

        sendMessage(id , {id, user, subject : 'voteAgainst'}).then( () => {

        }, error => {
            console.log( error );
        })

        voteResult(id).then( vote => {
            console.log( vote );
            if (vote.complete && vote.fail) {
                // on sauvegarde le resultat du vote dans les différents VOTE_FOR.
                saveComplete(id, vote).then(data => {
                    // on sauvegarde la relation voteComplete = false dans les différents HAS_CHILDREN|HAS_PARENT
                    voteFail(id).then(data => {
                        sendMessage(id, {id , user , subject : 'voteComplete'}).then( () => {

                        }, error => {
                            console.log( error );
                        })
                        return res.json({vote: vote, reload: true});
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
    sendMessage( id , {id, user , subject : 'voteFor'}).then( () => {

    }, error => {
        console.log( error );
    })
    result.then( data => {
        voteResult(id).then( vote => {
            if( vote.success ) {
                voteSuccess(id).then( data => {
                    if( data.updated) {
                        sendMessage(data.parentId , {
                            id : data.parentId ,
                            user,
                            subject : 'reloadDocument'}).then( () => {

                        }, error => {
                            console.log ( error );
                        })
                    }
                    saveComplete(id, vote).then( vote => {
                        sendMessage( id , { id , user , subject : 'voteComplete'}).then( data => {

                        }, error => {
                            console.log( error );
                        })
                        return res.json({ majority : true , reload : data.updated });
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
        "MATCH (d)-[r:SUBSCRIBED_BY|HAS_PARENT*1..2]->(u:User) " +
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
    const query = "MATCH (:User)-[r:VOTE_FOR]->( d:Document )" +
        " WHERE d.id = $id " +
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
}