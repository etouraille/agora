const getDriver = require('./../neo/driver');

const voteResultFromDocument = ( id ) => {
    console.log( id );
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document)-[r:SUBSCRIBED_BY|HAS_PARENT*1..2]->(s:User) " +
        "WHERE 'SUBSCRIBED_BY' in [rel in r | type(rel)] " +
        "AND d.id = $id " +
        "OPTIONAL MATCH (s)-[v1:VOTE_FOR]->(d) " +
        "OPTIONAL MATCH (d)-[pr:HAS_PARENT]->(p) " +
        "RETURN s, v1 , d , p , pr ";

    let result = session.run( query , { id : id });
    return new Promise( (resolve , reject ) => {
        result.then(data => {
            let ret = [];
            let documentId = null;
            let parentId  = null;
            let parentBody = null;
            let documentBody = null;
            let index = null;
            let length = null;
            let voteComplete = false;
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
                    if(elem.get(4).properties.voteComplete) {
                        voteComplete = true;
                    }
                }


                ret.push( vote );
            })
            let againstIt = ret.reduce((a , elem) => elem.against === true ? a + 1 : a , 0);
            let forIt = ret.reduce((a , elem) => elem.against === false ? a + 1 : a , 0);
            let abstention = ret.reduce((a , elem) => elem.against === null ? a + 1 : a , 0);
            let participants = ret.length;
            let majority = forIt >= ( participants / 2 );
            let fail = againstIt > ( participants / 2 );
            resolve({
                againstIt,
                forIt ,
                abstention,
                participants,
                majority ,
                fail,
                id : documentId ,
                parentId ,
                documentBody,
                parentBody,
                index,
                length,
                voteComplete,
            });
        }, error => {
            reject( error );
        }).finally( () => {
            session.close();
            driver.close();
        })
    })
}

module.exports = {
    voteResultFromDocument,
}