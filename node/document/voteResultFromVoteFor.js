const getDriver = require('./../neo/driver');

const voteResultFromVoteFor = ( id ) => {
    console.log( id );
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (u:User)-[v:VOTE_FOR]->(d:Document) " +
        "WHERE ID(v) = $id " +
        "MATCH (d)-[r:SUBSCRIBED_BY|HAS_PARENT*1..2]->(s:User) " +
        "WHERE 'SUBSCRIBED_BY' in [rel in r | type(rel)] " +
        "OPTIONAL MATCH (s)-[v1:VOTE_FOR]->(d) " +
        "OPTIONAL MATCH (d)-[pr:HAS_PARENT]->(p) " +
        "RETURN s, v1 , d , p , pr ";

    let result = session.run( query , { id : parseInt(id) });
    return new Promise( (resolve , reject ) => {
        result.then(data => {
            let ret = [];
            let documentId = null;
            let parentId  = null;
            let parentBody = null;
            let documentBody = null;
            let index = null;
            let length = null;
            data.records.forEach( elem => {
                let vote = {against : null};
                if(elem.get(0)) {
                    vote.user = elem.get(0).properties.login;
                }
                if( elem.get(1)) {
                    vote.against = elem.get(1).properties.against;
                }
                if( elem.get(2) ) {
                    documentId = elem.get(2).properties.id;
                    documentBody = elem.get(2).properties.body
                }
                if( elem.get(3) ) {
                    parentId = elem.get(3).properties.id;
                    parentBody = elem.get(3).properties.body
                }
                if( elem.get(4)) {
                    index = elem.get(4).properties.index;
                    length = elem.get(4).properties.length
                }


                ret.push( vote );
            })
            let againstIt = ret.reduce((a , elem) => elem.against === true ? a + 1 : a , 0);
            let forIt = ret.reduce((a , elem) => elem.against === false ? a + 1 : a , 0);
            let abstention = ret.reduce((a , elem) => elem.against === null ? a + 1 : a , 0);
            let participants = ret.length;
            let majority = forIt >= ( participants / 2 );
            resolve({
                againstIt,
                forIt ,
                abstention,
                participants,
                majority ,
                id : documentId ,
                parentId ,
                documentBody,
                parentBody,
                index,
                length
            });
        }, error => {
            reject( error );
        }).finally( () => {
            session.close();
            driver.close();
            // TODO : check console log
            console.log( 'close');
        })
    })
}

module.exports = {
    voteResultFromVoteFor,
}