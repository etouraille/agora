const getDriver = require('./../neo/driver');
const {v4 : uuid } = require('uuid');
const { quillMerge } = require('./../quill/quillMerge');
// on créée un document archive avec l'ancien contenu
// on remplace le nouveau contenu dans le document parent
// on desactive le lien entre le parent et le document fils
const voteSuccess = (id ) => {

    const driver = getDriver();
    const session = driver.session();

    let query = "" +
        "MATCH (d:Document)-[r:HAS_PARENT]->(p:Document) " +
        "WHERE d.id = $id " +
        "RETURN d, p , r ";
    let result = session.run( query ,{id });
    return new Promise( (resolve, reject )  => {
        result.then( data => {
            if( data.records.length > 0) {

                let parentId = data.records[0].get(1).properties.id;
                let complete  = data.records[0].get(2).properties.voteComplete;
                let parentBody = data.records[0].get(1).properties.body;
                let childBody = data.records[0].get(0).properties.body;
                let index = data.records[0].get(2).properties.index;
                let length = data.records[0].get(2).properties.length;

                if (parentId && !complete) {
                    let query = "MATCH (d:Document) WHERE d.id = $parentId " +
                        "OPTIONAL MATCH (d)-[r:HAS_ARCHIVE]->(p:Document ) " +
                        "RETURN d, r " +
                        "ORDER BY r.rank DESC ";
                    // on crée un document archive avec l'ancien document.
                    let result = session.run(query, {parentId});
                    result.then(data => {
                        let docParent = data.records[0].get(0).properties;
                        let rank = data.records[0].get(1) ? data.records[0].get(1).properties.rank + 1 : 0;
                        let query = "MATCH (d:Document) WHERE d.id = $parentId " +
                            "MERGE (d)-[:HAS_ARCHIVE{ rank : $rank }]" +
                            "->(a:Document { body : $body, title : $title, id : $uid }) "
                        let result = session.run(query, {
                            parentId,
                            body: docParent.body,
                            title: docParent.title,
                            uid: uuid(),
                            rank,
                        })

                        result.then(data => {

                            const newParentBody = quillMerge(parentBody, childBody, index, length);
                            let query = "" +
                                "MATCH ( p:Document )-[cr:HAS_CHILDREN]->(c:Document)-[pr:HAS_PARENT]->(d) " +
                                "WHERE p.id = $parentId AND c.id = $id " +
                                "OPTIONAL MATCH (:User)-[vf:VOTE_FOR]->(p) " +
                                "SET p.body = $newBody " +
                                "SET cr.voteComplete = true " +
                                "SET pr.voteComplete = true " +
                                "DELETE vf ";
                            // TODO : mettre les votes sur l'archive, faire un summary.
                            let result = session.run(query, {
                                parentId: parentId,
                                id: id,
                                newBody: JSON.stringify(newParentBody),
                            })
                            result.then(data => {
                                console.log('updated');
                                resolve({updated: true, parentId });
                            }, error => {
                                console.log(1, error);
                                reject(error);
                            }).finally(() => {
                                session.close();
                                driver.close();
                            })
                        }, error => {
                            console.log(2, error);
                            reject(error);
                            session.close();
                            driver.close();
                        })


                    }, error => {
                        console.log(3, error);
                        reject(error);
                        session.close();
                        driver.close();
                    })

                } else {
                    resolve({updated: false});
                    session.close();
                    driver.close();
                }
            } else {
                resolve( { updated : false });
                session.close();
                driver.close();
            }
        }, error => {
            console.log( 7, error );
            reject(error);
            session.close();
            driver.close();
        })
    })
}

const voteFail = ( documentId ) => {
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document)-[hp:HAS_PARENT]->(p:Document)-[hc:HAS_CHILDREN]->(d) " +
        "WHERE d.id = $id " +
        "SET hp.votComplete = false " +
        "SET hc.voteComplete = false ";
    let result = session.run( query , {id :  documentId });
    return new Promise((resolve, reject ) => {
        result.then( data => {
            resolve( true );
        }, error => {
            reject( error );
        }).finally(() => {
            session.close();
            driver.close();
        })
    })
}

module.exports = {
    voteSuccess,
    voteFail,
}