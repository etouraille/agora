const getDriver = require('./../neo/driver');

const { v4 : uuid } = require('uuid');

const amend = ( req, res ) => {

    const {id, selection} = req.body;

    const driver = getDriver();
    const session = driver.session();

    const query = 'MATCH (document:Document) WHERE document.id = $id RETURN document';
    let result = session.run(query, {id: id});
    result.then(data => {
        console.log( data.records );
        let singleRecord = data.records[0];
        if (!singleRecord) {
            res.json(500, {reason: 'No record for id : ' + id}).end();
            session.close();
            driver.close();
            return;
        } else {
            const document = singleRecord.get(0).properties;
            const start = document.body.indexOf(selection);
            const end = start + selection.length;
            console.log(document );
            console.log( selection );
            console.log ( start );
            if (start === -1) {
                res.json(500, {reason: 'selection doesnt belong to document'}).end();
                session.close();
                driver.close();
                return;
            } else {

                let query = 'MATCH (document:Document) WHERE document.id = $idParent ' +
                    'MERGE (document1 : Document {  body : $selection , id : $id, parentStart : $start , parentLength : $length })' +
                    '-[r:HAS_PARENT]->(document)-[s:HAS_CHILDREN]->(document1)' +
                    ' RETURN document1.id';


                let result = session.run(query, { idParent : id , selection : selection , id : uuid(), start , length : end - start })
                result.then(data => {
                    let singleResult = data.records[0];
                    if(! singleResult ) {
                        return res.json(500, {reason : 'Nothing persist'}).end();
                    } else {
                        console.log( singleResult.get(0));
                        return res.json({ id : singleResult.get(0) });
                    }
                }, error => {
                    return res.json(500, {reason : error });
                }).finally(() => {
                    session.close();
                    driver.close();
                })
            }
        }
    }, error => {
        return res.json(500, {reason : error }).end();
    }).finally(() => {

    });
}
module.exports = {
    amend,
}