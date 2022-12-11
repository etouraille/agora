const getDriver = require('./../neo/driver');

const { voteIsComplete, voteResult , saveComplete } = require('./../document/voteComplete');
const { voteSuccess,voteFail } = require('./../document/voteSuccess');
const { sendMessageToSubscribers } = require('./../mercure/mercure');


const getLinkedDocuments = (id) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "" +
        "MATCH (d:Document) WHERE d.id = $id " +
        "MATCH (d)-[s:HAS_CHILDREN*1..]->(c:Document) " +
        "WHERE reduce(length=0, hasChildren in s | length + CASE hasChildren.voteComplete IS NULL OR hasChildren.voteComplete = false WHEN true THEN 1 ELSE 0 END ) = size(s) " +
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
//TODO don't think it is still necessary since the voters are not removed any more
const processSubscribe = (subscribedId , user ) => {
    getLinkedDocuments(subscribedId).then( ids => {
        // on regarde tout les vote concerné par ces ids
        // si le vote n'est pas terminé ou rajoute des votant
        ids.forEach( id => {
            voteIsComplete(id).then( voteComplete => {
                if( ! voteComplete ) {
                    sendMessageToSubscribers(id, { id, sender : user , subject : 'addVoter'});
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
                console.log( 'vote complete', voteComplete);
                if( ! voteComplete ) {
                    const driver = getDriver();
                    const session = driver.session();

                    // TODO remove voter only if it has not voted
                    //sendMessageToSubscribers(id , {id, sender: user , subject : 'removeVoter'});
                    // quand le vote est
                    voteResult(id).then( vote => {
                        console.log( vote.complete, vote.fail, vote.success, 'vooooottteeee ==========');
                        if( vote.complete && vote.fail ) {
                            saveComplete(id , vote ).then( () => {
                                voteFail(id).then( () => {
                                    sendMessageToSubscribers(id, { id, sender : user , subject : 'voteComplete', vote });
                                })
                            })

                        } else if ( vote.complete && vote.success ) {
                            voteSuccess(id).then( data => {
                                if( data.updated ) {
                                    sendMessageToSubscribers(data.parentId , {
                                        id : data.parentId ,
                                        sender : user ,
                                        subject : 'reloadDocument'});
                                }
                                saveComplete(id , vote ).then(() => {
                                    sendMessageToSubscribers(id, { id, sender: user , subject : 'voteComplete', vote });
                                })
                            })
                        }

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
