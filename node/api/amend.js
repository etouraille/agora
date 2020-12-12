const getDriver = require('./../neo/driver');

const { v4 : uuid } = require('uuid');

const amend = ( req, res ) => {



    const {id, selection, index, length } = req.body;

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

            let query = 'MATCH (document:Document) WHERE document.id = $idParent ' +
                'MERGE (document1 : Document {  body : $selection , id : $id })' +
                '-[r:HAS_PARENT { index : $index , length : $length }]->(document)-[s:HAS_CHILDREN { index : $index , length : $length }]->(document1)' +
                ' RETURN document1.id';


            let result = session.run(query, { idParent : id , selection : JSON.stringify(selection) , id : uuid(), index : index , length : length  })
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
    }, error => {
        return res.json(500, {reason : error }).end();
    }).finally(() => {

    });
}
module.exports = {
    amend,
}