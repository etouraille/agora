const getDriver = require('./../neo/driver');
const {sendMessage } = require('./../mercure/mercure');
const {v4 : uuid } = require('uuid');
const { getSubscribers } = require('./../document/subscribe')
const { findFirstParent }= require('./../document/findParent')
const query = "MATCH (u:User) , (d:Document) WHERE u.login = $user " +
    "AND d.id = $id " +
    "MERGE (u)-[:HAS_NOTIFICATION]" +
    "->(n: Notification { body : $body , clear : false , type : $type, id : $uuid})-[:NOTIFY_ON]->(d)" +
    "RETURN n ";


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
            sendMessage(id , { id , user : user , subject : 'notification', notification },true );
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
                  console.log( 'message send ');
                  sendMessage(id , {
                      id ,
                      user : user,
                      subject : 'notification',
                      notification });
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
    getSubscribers(id).then( users => {
        users.forEach( user  => {
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
                    sendMessage(id , {
                        id ,
                        user : user,
                        subject : 'notification',
                        notification });
                } else {
                    console.log( 'no notif created');
                }
            })

        })
    },error => {
        console.log( error);
    })
}
const sendNotificationVoteSuccess = ( id, me ) => {
    getSubscribers(id).then( users => {
        findFirstParent(id).then( parentId => {
            users.forEach( user  => {
                const driver = getDriver();
                const session = driver.session();
                if( ! parentId ) {
                    const body = "Le vote est terminé pour {doc}, tout les participants sont d'accord"
                    let newId = id;
                } else {
                    let newId = parentId;
                    const body = "les participant on voté pour, vous pouver amender {doc}";

                }
                const result = session.run( query , {
                    newId,
                    user,
                    body ,
                    uuid : uuid(),
                    type : 'voteSuccess'
                });
                result.then( data => {
                    if( data.records[0] ) {
                        let notification = data.records[0].get(0).properties;
                        sendMessage(id , {
                            newId ,
                            user : user,
                            subject : 'notification',
                            notification });
                    } else {
                        console.log( 'no notif created');
                    }
                })

            })
        })
    },error => {
        console.log( error);
    })
}


module.exports = {
    sendInvite,
    sendNotificationReadyForVote,
    sendNotificationVoteFail,
    sendNotificationVoteSuccess,
}