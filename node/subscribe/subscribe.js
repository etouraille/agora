const getDriver = require('./../neo/driver');
const {processSubscribe, getLinkedDocuments} = require("../document/subscribe");
const {sendMessageToAll} = require("../mercure/mercure");

const subscribe = (id, userId) => {

    return new Promise((resolve, reject) => {


        const driver = getDriver();
        const session = driver.session();
        const query = "MATCH (d:Document), (u:User) WHERE d.id = $id AND u.id = $me " +
            "WITH d, u , timestamp() as _ts " +
            "OPTIONAL MATCH (d)-[os:OLD_SUBSCRIBED_BY]->(u), (u)-[ohs:OLD_HAS_SUBSCRIBE_TO]->(d ) " +
            "WITH CASE os.subscribedAt IS NOT NULL WHEN true THEN os.subscribedAt ELSE timestamp() END as _ts , d, u , os, ohs " +
            "MERGE (d)-[r:SUBSCRIBED_BY { subscribedAt : _ts }]->(u)-[s:HAS_SUBSCRIBE_TO { subscribedAt : _ts }]->(d) " +
            "DELETE os, ohs ";
        let result = session.run(query, {id : id , me : userId });
        processSubscribe(id, userId);
        sendMessageToAll({ subject : 'docSubscribe', id , user : userId });
        // TODO not sure it's necessary since the message are sent to the parent.

        /*
        getLinkedDocuments(id).then( ids => {
            ids.splice(ids.indexOf(id), 1 );
            ids.forEach( childId => {
                sendMessageToAll({ subject : 'docSubscribe', id: childId , user : res.username });
            })
        })
         */

        return result.then(data => {

            getLinkedDocuments( id ).then( ids => {
                resolve(ids)
            }, error => {
                reject(error);
            })


        }, error => {
            console.log( 'errrooooooooooooooooooooorrrr ', error);
            reject(error)
        }).finally(() => {
            session.close();
            driver.close();
        });

    })

}
module.exports = {
    subscribe,
}