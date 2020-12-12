const getDriver = require('./../neo/driver');

const readyForVote = (req , res ) => {
    const driver = getDriver();
    const session = driver.session();
    const { id } = req.body;
    const me = res.username;

    const query = 'MATCH (d:Document)-[r:FOR_EDIT_BY]->( u:User) WHERE d.id = $id AND u.login = $me ' +
        'SET r.readyForVote = true RETURN r ';
    let result = session.run( query , {id : id , me : me  });
    result.then( data => {
        res.json({ user : me }).end();
    }, error => {
        res.json(500, {reason : error });
    }).finally(() => {
            session.close();
            driver.close();
    })
}
//fournit la liste des utilisteur autorisés en modification
// et le fait qu'ils aient validé ou non le documents.
const getReadyForVote = ( req , res ) => {
    const id = req.params.id;
    const driver = getDriver();
    const session = driver.session();
    const query = 'MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) WHERE d.id = $id' +
        ' RETURN r, u ';
    const result = session.run( query , { id : id });
    result.then( data => {
        let ret = [];
        if( data.records.length > 0 ) {
            data.records.forEach( (elem , index) => {
                ret.push({
                    user : elem.get(1).properties.login,
                    readyForVote : elem.get(0).properties.readyForVote,
                    invitedBy : elem.get(0).properties.invited
                })
            })
        }
        return res.json( ret ).end();
    }, error => {
        return res.json( 500, {reason : error }).end();
    }).finally(() => {
        session.close();
        driver.close();
    })
}

const againstIt = ( req , res ) => {

    const {id } = req.body;
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (u:User) , (d:Document) WHERE u.id = $me AND d.id = $id " +
        "MERGE (u)-[r:VOTE_FOR { against : true}]->(d) ";
    let result = session.run( query , { id: id  , me : res.username });
    result.then( data => {
        return res.json( data ).end();
    }, error => {
        return res.json(500, {reason : error });
    }).finally(() => {
        session.close();
        driver.close();
    })
}

const getVoters = ( req, res ) => {
    const id = req.params.id;
    const driver = getDriver();
    const session = driver.session();

    const query = "MATCH (d:Document)-[r:SUBSCRIBED_BY]->(u:User) " +
        "WHERE d.id = $id " +
        "OPTIONAL MATCH (u)-[v:VOTE_FOR]->(d) " +
        "RETURN u,v ";

    const result = session.run( query , {id : id })
    result.then( data => {
        let votes = [];
        data.records.forEach( elem => {
            let vote = {};
            vote.user = elem.get(0).properties.login;
            if( elem.get(1)) {
                vote.against = elem.get(1).properties.against;
            } else {
                vote.against = null;
            }
            votes.push( votes );
        })
        return res.json( votes ).end();
    }, error => {
        return res.json(500, {reason : error }).end();
    }).finally( () => {
        session.close();
        driver.close();
    })
}

const forIt = (req, res ) => {
    const {id } = req.body;
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (u:User) , (d:Document) WHERE u.id = $me AND d.id = $id " +
        "MERGE (u)-[r:VOTE_FOR { against : false }]->(d) ";
    let result = session.run( query , { id: id  , me : res.username });
    result.then( data => {
        return res.json( data ).end();
    }, error => {
        return res.json(500, {reason : error });
    }).finally(() => {
        session.close();
        driver.close();
    })
}

module.exports = {
    readyForVote,
    getReadyForVote,
    againstIt,
    forIt,
    getVoters,
}