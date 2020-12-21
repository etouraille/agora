const getDriver = require('./../neo/driver');

const { voteIsComplete, voteResult , saveComplete } = require('./../document/voteComplete');
const { voteSuccess,voteFail } = require('./../document/voteSuccess');
const { sendMessage } = require('./../mercure/mercure');

const getLinkedDocuments = (id) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "" +
        "MATCH (d:Document) WHERE d.id = $id " +
        "MATCH (d)-[s:HAS_CHILDREN*1..]->(c:Document) " +
        "WHERE reduce(length=0, hasChildren in s | length + CASE NOT EXISTS (hasChildren.voteComplete) OR hasChildren.voteComplete = false WHEN true THEN 1 ELSE 0 END ) = size(s) " +
        "RETURN c "
    let result = session.run( query , {id});
    return new Promise( ( resolve , reject ) => {
        let ret = [id];
        result.then(data => {
            data.records.forEach( elem => {
                ret.push(elem.get(0).properties.id )
            });
            resolve( ret );
        }, error => {
            reject( error )
        }).finally(() => {
            session.close();
            driver.close();
        })
    })
}

const processSubscribe = (subscribedId , user ) => {
    getLinkedDocuments(subscribedId).then( ids => {
        // on regarde tout les vote concerné par ces ids
        // si le vote n'est pas terminé ou rajoute des votant
        ids.forEach( id => {
            voteIsComplete(id).then( voteComplete => {
                if( ! voteComplete ) {
                    sendMessage(id, { id, user , subject : 'addVoter'});
                }
            })
        });
    })
}

const processUnsubscribe = ( subscribedId , user ) => {
    getLinkedDocuments(subscribedId).then( ids => {
        // pour tout les ids
        // si le vote est terminé : on ne fait rien
        ids.forEach( id => {
            voteIsComplete(id).then( voteComplete => {
                if( ! voteComplete ) {
                    const driver = getDriver();
                    const session = driver.session();
                    // TODO check if it is pertinant : on efface le vote
                    // de la personne qui se désinscrit si le vote n'est pas complete
                    let query = "MATCH(u:User)-[r:VOTE_FOR]->(d:Document) " +
                        "WHERE d.id = $id AND u.login = $user " +
                        "DELETE r";
                    let result = session.run( query , {id, user})
                    result.then( () => {
                        sendMessage(id , {id, user , subject : 'removeVoter'});
                        voteResult(id).then( vote => {
                            if( vote.complete && vote.fail ) {
                                saveComplete(id , vote ).then( () => {
                                    voteFail(id).then( () => {
                                        sendMessage(id, { id, user , subject : 'voteComplete', vote });
                                    })
                                })

                            }else if ( vote.complete && vote.success ) {
                                voteSuccess(id).then( data => {
                                    if( data.updated ) {
                                        sendMessage(data.parentId , {
                                            id : data.parentId ,
                                            user ,
                                            subject : 'reloadDocument'});
                                    }
                                    saveComplete(id , vote ).then(() => {
                                        sendMessage(id, { id, user , subject : 'voteComplete', vote });
                                    })
                                })
                            }

                        })
                    })
                }
            })
        })
        // si le vote n'est pas terminé
        // on recalcul le vote
        // s'il est terminé on envoie un message de final
        // s'il n'est pas terminé on supprime me votant
    })
}

module.exports = {
    getLinkedDocuments,
    processSubscribe,
    processUnsubscribe,
}