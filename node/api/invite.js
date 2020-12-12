const getDriver = require('./../neo/driver');


const invite = ( req, res ) => {

    const { id , email } = req.body;

    const driver = getDriver();
    const session = driver.session();
    const query = 'MATCH (user: User ) WHERE user.login = $email ' +
        'MATCH ( document : Document ) WHERE document.id = $id ' +
        'MERGE (document)-[r:FOR_EDIT_BY { invited : $me , readyForVote : false }]->(user)';

    let result = session.run( query , {id : id , email : email, me : res.username });
    result.then(data => {
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
        ' AND r.invited = $me ' +
        'DELETE r ';

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
     const query = 'MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User)' +
         ' WHERE d.id = $id RETURN u, r ';
     let result = session.run( query , { id : id });
     result.then( (data ) => {
         let json = [];
         data.records.map( ( elem ) => {
             if( elem.get(0)) {
                 json.push( elem.get(0).properties);
             }
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