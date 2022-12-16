const getDriver = require('./../neo/driver');

const getTitle = (req, res ) => {
    const id = req.params.id;

    const driver = getDriver();
    const session = driver.session();

    const query = "MATCH (d:Document) WHERE d.id = $id  " +
        " OPTIONAL MATCH (d)-[:HAS_PARENT*1..]->(p:Document) WHERE NOT (p)-[:HAS_PARENT]->(:Document) " +
        " RETURN d, p ";

    session.run(query, {id}).then((data) => {
        if(data.records[0]) {
            let title;
            if(data.records[0].get(1)) {
                title = data.records[0].get(1).properties.title;
            } else {
                title = data.records[0].get(0).properties.title
            }
            return res.json({ title });
        } else {
            return res.status(404).json({error: 'Document doesn t exists'});
        }
    }).catch((error) => {
        res.status(500).json({error})
        console.log(error);
        })
        .finally(() => {
            driver.close();
            session.close();
        })

}

module.exports = {
    getTitle,
}