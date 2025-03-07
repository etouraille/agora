const getDriver = require('./../neo/driver');

const { sendMessageToSubscribers } = require('./../mercure/mercure');

const { v4 : uuid } = require('uuid');

const amend = ( req, res ) => {



    const {id, selection, index, length } = req.body;

    const driver = getDriver();
    const session = driver.session();

    const query = 'MATCH (document:Document) WHERE document.id = $id RETURN document';
    let result = session.run(query, {id: id});
    result.then(data => {
        let singleRecord = data.records[0];
        if (!singleRecord) {
            res.json(500, {reason: 'No record for id : ' + id}).end();
            session.close();
            driver.close();
            return;
        } else {

            let query = 'MATCH (document:Document), (u:User) WHERE document.id = $idParent AND u.id = $me ' +
                ' MERGE (child : Document {  body : $selection , id : $id, createdAt : timestamp() })' +
                '-[r:HAS_PARENT { index : $index , length : $length }]' +
                '->(document)-[s:HAS_CHILDREN { index : $index , length : $length }]' +
                '->(child)' +
                ' MERGE (child)-[t:FOR_EDIT_BY { invited : $me , round : 0}]->(u)' +
                ' RETURN child.id';

            let childId = uuid();

            let result = session.run(query, {
                idParent : id ,
                selection : JSON.stringify(selection) ,
                id : childId,
                index : index ,
                length : length,
                me : res.userId,
            })
            result.then(data => {
                let singleResult = data.records[0];
                sendMessageToSubscribers(childId , {id : childId , user: res.userId , subject : 'hasSubscribe'});
                if(! singleResult ) {
                    return res.json(500, {reason : 'Nothing persist'}).end();
                } else {

                    sendMessageToSubscribers(id , { id , user: res.userId, subject : 'reloadDocument'});
                    return res.json({ id : singleResult.get(0) });
                }
            }, error => {
                console.log( error);
                return res.json(500, {reason : error });
            }).finally(() => {
                session.close();
                driver.close();
            })

        }
    }, error => {
        return res.json(500, {reason : error }).end();
    }).finally(() => {

    });
}
module.exports = {
    amend,
}


