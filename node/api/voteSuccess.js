const getDriver = require('./../neo/driver');
const {voteSuccess } = require('./../document/voteSuccess');
const voteSuccessOnDocument  = ( req, res ) => {
    const id = req.params.id;

    //TODO check if vote is succes.
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (d:Document)-[r:HAS_PARENT]->(p:Document) WHERE d.id = $id" +
        " RETURN d , p , r ";
    const result = session.run( query , {id });
    result.then( data => {
        if( data.records[0]) {
            let parentDoc  = data.records[0].get(1).properties;
            let doc = data.records[0].get(0).properties;
            let r = data.records[0].get(2).properties;
            voteSuccess(doc.id , parentDoc.id, parentDoc.body, doc.body, r.index, r.length)
                .then( success => {
                    return res.json({ success : true}).end();
                }, error => {
                    return res.status(500).json({reason : error}).end();
                })
        } else {
            return res.status( 500).json({reason : "Document do not exist "});
        }
    }, error => {
        return res.status(500).json({reason : error}).end();
    }).finally(() => {
        session.close();
        driver.close();
    })

}

module.exports = {
    voteSuccessOnDocument,
}
