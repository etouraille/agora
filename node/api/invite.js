const getDriver = require('./../neo/driver');
const { sendInvite } = require('./../notification/notification')

const invite = ( req, res ) => {

    const { id , email } = req.body;

    const driver = getDriver();
    const session = driver.session();
    const query = 'MATCH (user: User ) WHERE user.login = $email ' +
        'MATCH ( document : Document ) WHERE document.id = $id ' +
        'MERGE (document)-[r:FOR_EDIT_BY { invited : $me , readyForVote : false }]->(user)';

    let result = session.run( query , {id : id , email : email, me : res.username });
    result.then(data => {
        sendInvite(id, email, res.username );
        res.json({id : id , email : email }).end();
    }, error => {
        res.json(500, {reason : error });
    }).finally(() => {
        session.close();
        driver.close();
    })

}

const uninvite = ( req, res ) => {

    const { id , email } = req.body;

    const driver = getDriver();
    const session = driver.session();
    const query = 'MATCH ( document : Document )-[r:FOR_EDIT_BY]->(user:User) ' +
        ' WHERE user.login = $email ' +
        ' AND document.id = $id ' +
       // ' AND r.invited = $me ' +
        'DELETE r ';

    // TODO : check if user is owner of the document to enable supression also.


    let result = session.run( query , { id , email , me : res.username});
    result.then( data => {
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
         ' WHERE me.login = $me' +
         ' RETURN u, r , cb';
     let result = session.run( query , { id : id , me : res.username });
     result.then( (data ) => {
         let json = [];
         data.records.map( ( elem ) => {
             let ret = {};
             ret.login = elem.get(0).properties.login;
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