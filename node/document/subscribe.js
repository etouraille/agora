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


module.exports = {
    getLinkedDocuments,
    processSubscribe,
}
