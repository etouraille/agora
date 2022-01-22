const getDriver = require('./../neo/driver');
const { findParent } = require( './../document/findParent');
const {voteComplete, voteFailure} = require("./voteComplete");

const readyForVote = ( id , user ) => {

    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) " +
        "WHERE d.id = $id " +
        "RETURN r, u , d";
    const result = session.run(query, {id});
    return new Promise( (resolve, reject ) => {
        result.then( data => {
            let createdAt = data.records[0].get(2).properties.createdAt.low;
            let ret = [];
            data.records.forEach( elem => {
                let res = {};
                res.readyForVote = elem.get(0).properties.readyForVote;
                res.user = elem.get(1).properties.login;
                res.round = elem.get(0).properties.round;
                ret.push( res );
            });
            findParent(id).then(  pData  => {
                let parentId = pData.id
                let query = "MATCH (d:Document)-[s:SUBSCRIBED_BY]->(u:User)" +
                    " WHERE d.id = $parentId AND u.login = $user RETURN d, s ";
                let result = session.run( query , {user , parentId });
                result.then( data => {
                    let hasSubscribed = false;
                    let subscribedAt;
                    if( data.records[0 ]) {
                        hasSubscribed = true;
                        subscribedAt = data.records[0].get(1).properties.subscribedAt.low;

                    }
                    let maxRound = ret.map(elem => elem.round).max();
                    let minRound = ret.map( elem => elem.round ).min();
                    let _for = ret.map( elem => elem.readyForVote).reduce((a, b) => (b === true ? a+ 1: a), 0);
                    let _against  = ret.map( elem => elem.readyForVote).reduce((a, b) => (b === false ? a+ 1 :  a), 0);
                    let isReadyForVote = minRound === maxRound && voteComplete(_for, _against, ret.length, 'consensus');
                    let isOwner = ret.find(elem => elem.user === user ) ? true : false;
                    let canBeEdited = ((minRound === maxRound && minRound === 0) || (minRound === maxRound && voteFailure(_for, _against, ret.length, 'consensus'))) && !voteComplete(_for, _against, ret.length, 'consensus');
                    resolve({ hasSubscribed, isReadyForVote , isOwner, canBeEdited, subscribedIsBefore : subscribedAt <= createdAt });
                }, error => {
                    console.log( error);
                    reject( error )
                }).finally(() => {
                    session.close();
                    driver.close();
                })
            }, error => {
                console.log( error );
                reject( error );
                session.close();
                driver.close();
            })

        }, error => {
            console.log( error );
            reject( error );
            session.close();
            driver.close();
        })
    })
}

const getEditors = ( id ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "" +
        "MATCH (d:Document)-[:FOR_EDIT_BY]->(u:User ) " +
        "WHERE d.id =  $id " +
        "RETURN u ";

    const result = session.run( query , {id });
    return new Promise( ( resolve, reject ) => {
        result.then( data => {
            let users = [];
            data.records.forEach( elem => {
                users.push( elem.get(0).properties.login );
            })
            resolve( users );
        }, error => {
            reject( error );
        })
    })
}

module.exports = {
    readyForVote,
    getEditors,
}
