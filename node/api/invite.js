const getDriver = require('./../neo/driver');
const { sendInvite } = require('./../notification/notification')
const { sendMessage } = require('./../mercure/mercure')
const {sendMessageToAll} = require("../mercure/mercure");
const {onReadyForVoteComplete} = require("../document/elasticProcess");
const {sendNotificationReadyForVote, removeInviteNotificationOnReadyForVote} = require("../notification/notification");
const {isReadyForVote} = require("./vote");
const {findParent} = require("../document/findParent");

const invite = ( req, res ) => {

    const { id , userId } = req.body;

    const driver = getDriver();

    let query = "MATCH (d:Document)-[r:FOR_EDIT_BY]->(:User ) WHERE d.id = $id " +
        "RETURN min(r.round) ";

    const _session = driver.session();
    _session.run(query, {id}).then(data => {
        let minRound = typeof data.records[0].get(0).low === 'number'? data.records[0].get(0).low : parseInt(data.records[0].get(0));

        const session = driver.session();
        query = 'MATCH (user: User ) WHERE user.id = $userId ' +
            'MATCH ( document : Document ) WHERE document.id = $id ' +
            'MERGE (document)-[r:FOR_EDIT_BY { invited : $me , round: $minRound}]->(user)';

        let result = session.run( query , {id : id , userId, me : res.userId , minRound});
        return result.then(data => {
            sendInvite(id, userId, res.email , res._user);
            sendMessage(id, userId , { to : userId , user : res.userId , subject : 'reloadDocumentList'}, true );
            return res.json({id : id , userId , round: minRound }).end();
        }, error => {
            res.json(500, {reason : error });
        })
    }).finally(() => {
        _session.close();
        driver.close();
    })


}

const uninvite = ( req, res ) => {

    const { id , userId } = req.body;
    const me = res.userId;

    const driver = getDriver();
    const session = driver.session();
    const query = 'MATCH ( document : Document )-[r:FOR_EDIT_BY]->(user:User) ' +
        ' WHERE user.id = $userId ' +
        ' AND document.id = $id ' +
       // ' AND r.invited = $me ' +
        'DELETE r ';

    // TODO : check if user is owner of the document to enable supression also.



    let result = session.run( query , { id , userId , me });
    result.then( data => {
        //if document is accepted do the index stuff.
        //document can be accepted because some other left could be accepted yet.
        isReadyForVote(id).then( ( rfv ) => {
            if( rfv.ready ) {
                findParent(id).then(pData => {
                    let parentId = pData.id;
                    if (parentId) sendMessageToAll({id: parentId, sender: me, subject: 'reloadDocument'}, true);
                    //TODO rajouter un abonnement quand on est sur le document et le supprimer quand on en part
                    //TODO ainsi on pourrra cibler uniquement sur ceux qui sont présnts sur le doc
                    onReadyForVoteComplete(id);
                    sendNotificationReadyForVote(id, me);
                    removeInviteNotificationOnReadyForVote(id, rfv.users, me);
                })
            }
        })
        sendMessage(id, email , { to : userId , user : res.userId , subject : 'reloadDocumentList'}, true );
        return res.json(data).end();
    }, error => {
        return res.json(500, { reason : error }).end();
    }).finally(() => {
        session.close();
        driver.close();
    })

}

const getInvitedUsers = (req , res ) => {
     const id = req.params.id;

     const driver = getDriver();
     const session = driver.session();
     const query = '' +
         ' MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User)' +
         ' WHERE d.id = $id ' +
         ' OPTIONAL MATCH (d)-[cb:CREATE_BY]->(me:User) ' +
         ' WHERE me.id = $me' +
         ' RETURN u, r , cb';
     let result = session.run( query , { id : id , me : res.userId });
     result.then( (data ) => {
         let json = [];
         data.records.map( ( elem ) => {
             let ret = {};
             ret.login = elem.get(0).properties.login;
             ret.id = elem.get(0).properties.id;
             ret.name = elem.get(0).properties.name;
            if( elem.get(2)) {
                 ret.meIsCreator = true;
             }
             json.push( ret );
         })
         res.json(json).end();
     }, error => {
         res.json(500, {reason : error }).end();
     }).finally(() => {
         session.close();
         driver.close();
     })
}

module.exports = {
    invite,
    getInvitedUsers,
    uninvite,
}
