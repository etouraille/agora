const getDriver = require('./../neo/driver');
const {sendMessage , sendMessageToSubscribers } = require('./../mercure/mercure');
const {v4 : uuid } = require('uuid');
const { getSubscribers } = require('./../document/subscribers');
const { findFirstParent }= require('./../document/findParent');
const {getEditors} = require("../vote/readyForVote");
const query = "MATCH (u:User) , (d:Document) WHERE u.login = $user " +
    "AND d.id = $id " +
    "OPTIONAL MATCH (d)-[:HAS_PARENT*1..]->(p:Document) WHERE NOT (p)-[:HAS_PARENT]->(:Document) " +
    "MERGE (u)-[:HAS_NOTIFICATION]" +
    "->(n: Notification { body : $body , clear : false , type : $type, id : $uuid})-[:NOTIFY_ON]->(d)" +

    "RETURN n , d, p ";


const sendInvite = ( id, user, me ) => {
    const body = 'Vous avez été invité par ' + me + ' a compléter {doc}';
    const driver = getDriver();
    const session = driver.session();
    const result = session.run( query , {
        id ,
        user ,
        body ,
        uuid : uuid(),
        type : 'invite'});
    result.then( data => {
        if( data.records[0] ) {
            let notification = data.records[0].get(0).properties;
            let title = data.records[0].get(2) ? data.records[0].get(2).properties.title : data.records[0].get(1).properties.title;
            sendMessage(id , user,{ id , user , sender : me , subject : 'notification', notification , title },true );
        } else {
            console.log( 'no notif created');
        }
    }, error => {
        console.log( error );
    })
}

const sendInviteEmail = ( id, user, me ) => {
    const body = 'Vous avez été invité par ' + me + ' à participer à {doc}';
    const driver = getDriver();
    const session = driver.session();
    const result = session.run( query , {
        id ,
        user ,
        body ,
        uuid : uuid(),
        type : 'invite-email'});
    result.then( data => {
        if( data.records[0] ) {
            let notification = data.records[0].get(0).properties;
            let title = data.records[0].get(2) ? data.records[0].get(2).properties.title : data.records[0].get(1).properties.title;
            sendMessage(id , user,{ id , user , sender : me , subject : 'notification', notification , title },true );
        } else {
            console.log( 'no notif created');
        }
    }, error => {
        console.log( error );
    })
}


const sendNotificationReadyForVote = ( id, me ) => {
    getSubscribers(id).then( users => {
        users.forEach( user  => {
          const driver = getDriver();
          const session = driver.session();
          const body = 'Vous êtes invité a voter pour {doc} ';
          const result = session.run( query , {
              id,
              user,
              body ,
              uuid : uuid(),
              type : 'rfv'
          });
          result.then( data => {
              if( data.records[0] ) {
                  let notification = data.records[0].get(0).properties;
                  let title = data.records[0].get(2) ? data.records[0].get(2).properties.title : data.records[0].get(1).properties.title;
                  console.log( 'message send ');
                  sendMessage(id , user,{
                      id ,
                      user : user,
                      sender : me,
                      subject : 'notification',
                      notification,
                      title : title,
                  });
              } else {
                  console.log( 'no notif created');
              }
          })

        })
    },error => {
        console.log( error);
    })
}


// quand j'incrémente le round j'envoie une notif : {user} A FAIT UN APPELLE AU VOTE POUR L'AMENDEMENT {DOC}, VOUS POUVEZ VOTER
// quand je vote et que le vote est en echec : notif, le vote est un échec vous pouvez de nouveau MODFIFER [L'AMENDEMENT](DOC)



const sendNotificationNewRound = ( id, me  ) => {
    getEditors(id).then( users => {
        users.forEach( user  => {
            const driver = getDriver();
            const session = driver.session();
            const body =  me + ' a fait un appel au vote pour l\'amendement {doc}, vous pourvez voter';
            const result = session.run( query , {
                id,
                user,
                body ,
                uuid : uuid(),
                type : 'newRound'
            });
            result.then( data => {
                if( data.records[0] ) {
                    let notification = data.records[0].get(0).properties;
                    let title = data.records[0].get(2) ? data.records[0].get(2).properties.title : data.records[0].get(1).properties.title;
                    console.log( 'message send ');
                    sendMessage(id , user,{
                        id ,
                        user : user,
                        sender : me,
                        subject : 'notification',
                        notification,
                        title : title,
                    });
                } else {
                    console.log( 'no notif created');
                }
            })

        })
    },error => {
        console.log( error);
    })
}
const sendNotificationRoundVoteFail = ( id, me ) => {
    getEditors(id).then( users => {
        users.forEach( user  => {
            const driver = getDriver();
            const session = driver.session();
            const body = 'le vote est un échec vous pouvez de nouveau modifier l\'amendement {doc}';
            const result = session.run( query , {
                id,
                user,
                body ,
                uuid : uuid(),
                type : 'roundVoteFail'
            });
            result.then( data => {
                if( data.records[0] ) {
                    let notification = data.records[0].get(0).properties;
                    let title = data.records[0].get(2) ? data.records[0].get(2).properties.title : data.records[0].get(1).properties.title;
                    console.log( 'message send ');
                    sendMessage(id , user,{
                        id ,
                        user : user,
                        sender : me,
                        subject : 'notification',
                        notification,
                        title : title,
                    });
                } else {
                    console.log( 'no notif created');
                }
            })

        })
    },error => {
        console.log( error);
    })
}


const sendNotificationVoteFail = ( id, me ) => {
    return new Promise((resolve, reject ) => {
        getSubscribers(id).then( users => {
            users.forEach( (user, index )  => {
                const driver = getDriver();
                const session = driver.session();
                const body = "les participant on voté contre , vous pouver amender {doc}";
                const result = session.run( query , {
                    id,
                    user,
                    body ,
                    uuid : uuid(),
                    type : 'voteFail'
                });
                result.then( data => {
                    if( data.records[0] ) {
                        let notification = data.records[0].get(0).properties;
                        let title = data.records[0].get(2) ? data.records[0].get(2).properties.title : data.records[0].get(1).properties.title;

                        sendMessage(id , user, {
                            id ,
                            user : user,
                            sender : me,
                            subject : 'notification',
                            notification ,
                            title,
                        });

                    } else {
                        console.log( 'no notif created');
                    }
                    if( users.length === index + 1 ) {
                        resolve( true );
                    }
                }, error => {
                    reject( error );
                }).finally(() => {
                    session.close();
                    driver.close();
                })
            })
        },error => {
            reject( error );
        })
    })
}
const sendNotificationVoteSuccess = ( id, me ) => {
    return new Promise((resolve, reject ) => {
        getSubscribers(id).then( users => {
            findFirstParent(id).then( parentId => {
                users.forEach( (user, index )  => {
                    const driver = getDriver();
                    const session = driver.session();
                    let newId;
                    let body;
                    if( ! parentId ) {
                        body = "Le vote est terminé pour {doc}, tout les participants sont d'accord"
                        newId = id;
                    } else {
                        newId = parentId;
                        body = "les participant on voté pour, vous pouver amender {doc}";

                    }
                    const result = session.run( query , {
                        id : newId,
                        user,
                        body ,
                        uuid : uuid(),
                        type : 'voteSuccess'
                    });
                    result.then( data => {
                        if( data.records[0] ) {
                            let notification = data.records[0].get(0).properties;
                            let title = data.records[0].get(2) ? data.records[0].get(2).properties.title : data.records[0].get(1).properties.title;
                            sendMessage(id , user,{
                                id : newId ,
                                user : user,
                                sender : me,
                                subject : 'notification',
                                notification,
                                title,
                            });
                        } else {
                            console.log( 'no notif created');
                        }
                        if( users.length === index + 1 ) {
                            resolve( true );
                        }
                    }, error => {
                        reject( error );
                    }).finally(() => {
                        session.close();
                        driver.close();
                    })

                })
            })
        },error => {
            reject( error );
        })
    })
}

const removeInviteNotificationOnReadyForVote = ( id , users, me  ) => {

    users.forEach( user => {
        const driver = getDriver();
        const session = driver.session();
        const query = "" +
            "MATCH (u:User)-[:HAS_NOTIFICATION]->(n:Notification)-[:NOTIFY_ON]->(d:Document) " +
            "WHERE u.login = $user AND d.id = $id AND n.type = $type " +
            "SET n.clear = true " +
            "RETURN n ";
        const result = session.run( query , { user, id , type :'invite'});
        result.then( data => {
            data.records.forEach( elem => {
                const notification = elem.get(0).properties;
                sendMessage(id, user, { id , sender : me , user, notification , subject : 'removeNotification'});
            })
        }, error => {
            console.log( 'error');
        }).finally(() => {
            session.close();
            driver.close();
        })
    })

}

removeReadyForVoteNotificationOnVote = ( id , user ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (u:User)-[:HAS_NOTIFICATION]->(n:Notification)-[:NOTIFY_ON]->(d:Document) " +
        "WHERE u.login = $user AND d.id = $id AND n.type = 'rfv' " +
        "SET n.clear = true " +
        "RETURN n ";
    const result = session.run( query , { id , user });
    result.then( data => {
        data.records.forEach( elem => {
            const notification = elem.get( 0).properties;
            sendMessageToSubscribers( id,  { id,  user, notification, subject : 'removeNotification' });
        })
    }, error => {
        console.log( error );
    }).finally(() => {
        session.close();
        driver.close();
    })
}

removeAllReadyForVoteNotificationOnVoteSuccessOrFail = ( id ) => {
    const driver = getDriver();
    const session = driver.session();

    const query = "MATCH (u:User)-[:HAS_NOTIFICATION]->(n:Notification)-[:NOTIFY_ON]->(d:Document) " +
        "WHERE d.id = $id AND n.type = 'rfv' " +
        "SET n.clear = true " +
        "RETURN n , u ";
    const result = session.run( query , { id });
    result.then( data => {
        data.records.forEach( elem => {
            const notification = elem.get( 0).properties;
            const user = elem.get(1).properties.login;
            sendMessage( id,  user, { id,  user, notification, subject : 'removeNotification' });
        })
    }, error => {
        console.log( error );
    }).finally(() => {
        session.close();
        driver.close();
    })

}

module.exports = {
    sendInvite,
    sendInviteEmail,
    sendNotificationReadyForVote,
    sendNotificationVoteFail,
    sendNotificationVoteSuccess,
    sendNotificationNewRound,
    sendNotificationRoundVoteFail,
    removeInviteNotificationOnReadyForVote,
    removeReadyForVoteNotificationOnVote,
    removeAllReadyForVoteNotificationOnVoteSuccessOrFail
}
