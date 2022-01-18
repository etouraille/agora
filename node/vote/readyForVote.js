const getDriver = require('./../neo/driver');
const { findParent } = require( './../document/findParent');

const readyForVote = ( id , user ) => {

    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document)-[r:FOR_EDIT_BY]->(u:User) " +
        "WHERE d.id = $id " +
        "RETURN r, u ";
    const result = session.run(query, {id});
    return new Promise( (resolve, reject ) => {
        result.then( data => {
            let ret = [];
            data.records.forEach( elem => {
                let res = {};
                res.readyForVote = elem.get(0).properties.readyForVote;
                res.user = elem.get(1).properties.login;
                ret.push( res );
            });
            findParent( id ).then(  parentId => {
                let query = "MATCH (d:Document)-[:SUBSCRIBED_BY]->(u:User)" +
                    " WHERE d.id = $parentId AND u.login = $user RETURN d ";
                let result = session.run( query , {user , parentId });
                result.then( data => {
                    let hasSubscribed = false;
                    if( data.records[0 ]) {
                        hasSubscribed = true;
                    }
                    let isReadyForVote = ret.length === ret.reduce((a, elem ) => (elem.readyForVote === true ? a + 1: a ), 0)
                    let isOwner = ret.find(elem => elem.user === user ) ? true : false;
                    resolve({ hasSubscribed, isReadyForVote , isOwner });
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
