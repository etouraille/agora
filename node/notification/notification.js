const getDriver = require('./../neo/driver');
const {sendMessage } = require('./../mercure/mercure');
const {v4 : uuid } = require('uuid');


const sendInvite = ( id, user, me ) => {
    const body = 'Vous avez été invité par ' + me + ' a compléter {doc}';
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (u:User) , (d:Document) WHERE u.login = $user " +
        "AND d.id = $id " +
        "MERGE (u)-[:HAS_NOTIFICATION]" +
        "->(n: Notification { body : $body , clear : false , type : 'invite', id : $uuid})-[:NOTIFY_ON]->(d)" +
        "RETURN n ";
    const result = session.run( query , { id , user , body , uuid : uuid()});
    result.then( data => {
        if( data.records[0] ) {
            let notification = data.records[0].get(0).properties;
            sendMessage(id , { id , user : me , subject : 'notification', notification },true );
        } else {
            console.log( 'no notif created');
        }
    }, error => {
        console.log( error );
    })
}
module.exports = {
    sendInvite,
}