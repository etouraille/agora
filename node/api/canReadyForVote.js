const getDriver = require('./../neo/driver');

const canReadyForVote = (req , res , next) => {
    const driver = getDriver();
    const session = driver.session();
    const { id, readyForVote } = req.body;
    const me = res.username;

    // Je peux voter quand le round viens d'être incrémente ie qu'on a passé les readyForVote à null round > 0 et a la meme valeur pour tout le monde.
    const query = '' +
        'MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) WHERE d.id = $id ' +
        'RETURN d, r, u ';
    let result = session.run( query , {id});
    result.then( data => {
        let rs = data.records.map(elem => elem.get(1).properties);
        let max = rs.map( elem => elem.round).max();
        let min = rs.map(elem => elem.round).min();
        let countReadyForVote = rs.map(elem => elem?.readyForVote).reduce((a,b) => (b === false || b === true), 0);
        if (max === min && max > 0 && countReadyForVote < rs.length ) {
           next();
        } else {
            return res.status(405).json({reason: 'Not allowed to vote'});
        }
    }, error => {
        console.log( error );
        return res.json(500, {reason : error });
    }).finally(() => {
        session.close();
        driver.close();
    })
}


module.exports = {
    canReadyForVote,
}
