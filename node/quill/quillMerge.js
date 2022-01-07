const Delta = require("quill-delta");
const getDriver = require('./../neo/driver');

const mergeApply = (parentId , id ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document)-[r:HAS_CHILDREN]->(c:Document) " +
        "WHERE NOT EXISTS(r.voteComplete) OR r.voteComplete = false AND d.id = $parentId " +
        "RETURN d, c , r " +
        "ORDER BY r.index ASC ";
    let result = session.run( query , {parentId });
    return new Promise( (resolve , reject ) => {

        result.then(data => {
            let ret = new Delta([]);
            let delta = 0;
            let res = [];
            data.records.forEach( (elem , i) => {
                const parentBody = elem.get(0).properties.body;
                const childBody = elem.get( 1).properties.body;
                const childId = elem.get(1).properties.id;
                const index = elem.get(2).properties.index;
                const length = elem.get(2).properties.length;

                if( childId === id ) {
                    const parent = new Delta(JSON.parse(parentBody));
                    const child = new Delta( JSON.parse(childBody) );
                    const before = parent.slice(0, index );
                    const content = child;
                    const after = parent.slice(index + length , parent.length());
                    ret = before.concat(content );
                    ret = ret.concat( after );
                    delta = child.length() - parent.slice(index, index + length ).length();
                } else {
                    if( delta ) {
                        res.push({id: childId, index: index + delta, length: length});
                    }
                }
            })

            const updateIndexes = ( res , driver ) => {
                return new Promise( (resolve, reject ) => {
                    res.forEach( (elem , index ) => {
                        let session = driver.session();
                        let query = "MATCH(c:Document)-[r:HAS_PARENT]->(p:Document)-[cr:HAS_CHILDREN]->(c) " +
                            "WHERE c.id = $id AND p.id = $parentId " +
                            "SET r.index = $index " +
                            "SET cr.index = $index ";
                        session.run(query , { id : elem.id , parentId , index : elem.index }).then(() => {

                            if(res.length === index + 1 ) {

                                resolve( true );
                            }
                        }, error => {
                            reject( error );
                        }).finally(() => {
                          session.close();
                        })
                    })
                    if( res.length === 0 ) {
                        resolve( true );
                    }
                })
            }

            let query = "" +
                "MATCH ( p:Document )-[cr:HAS_CHILDREN]->(c:Document)-[pr:HAS_PARENT]->(d) " +
                "WHERE p.id = $parentId AND c.id = $id " +
                "SET p.body = $newBody " +
                "SET cr.voteComplete = true " +
                "SET pr.voteComplete = true ";


            session.run( query , {parentId , id , newBody : JSON.stringify(ret)}).then(() => {

                let query =
                    " MATCH(p:Document)-[r:HAS_CHILDREN]->(:Document) WHERE p.id = $parentId " +
                    " RETURN r "
                session.run( query , {parentId }).then( data => {
                    let ret = [];
                    ret = data.records.map( elem => {
                        let voteComplete = elem.get(0).properties.voteComplete;
                        return voteComplete;
                    })
                    let isComplete = ret.length === ret.reduce((a, elem ) => (elem === true ? a + 1 : a ), 0 );
                    if( isComplete ) {
                        let query = "MATCH (:User)-[r:VOTE_FOR]->(p:Document) WHERE p.id = $parentId " +
                            "DELETE r ";
                        session.run( query , { parentId }).then(() => {

                            updateIndexes(res, driver).then( success => {
                                resolve( true );
                                session.close();
                                driver.close();
                            } ,error => {
                                reject( error );
                                session.close();
                                driver.close();
                            })

                        })

                    } else {
                        updateIndexes(res, driver).then( success => {
                            resolve( true );
                            session.close();
                            driver.close();
                        } ,error => {
                            reject( error );
                            session.close();
                            driver.close();
                        })
                    }
                })


            },error => {
                session.close();
                driver.close();
                reject( error );
            })
        }, error => {
            session.close();
            driver.close();
            reject( error );
        })
    })
}
module.exports = {
    mergeApply,
}
