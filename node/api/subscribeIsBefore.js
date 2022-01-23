const getDriver = require('./../neo/driver');

const getSubscribeIsBefore = (req, res ) => {
    let email = res.username;

    let id = req.params.id;

    const driver = getDriver();
    const session = driver.session();

    let query = " MATCH (d:Document) WHERE d.id = $id " +
        "OPTIONAL MATCH (d)-[r:HAS_PARENT|SUBSCRIBED_BY*1..]->(u:User) " +
        "WHERE 'SUBSCRIBED_BY' in [rel in r | type(rel)] AND u.login = $email " +
        "RETURN d , r ";

    const ret = [];
    session.run(query, {email, id }).then(data => {
        if(data.records[0]) {
            let elem = data.records[0];
            let createdAt = elem.get(0).properties.createdAt;
            let subscribedAt  = elem.get(1) ? elem.get(1).pop()?.properties?.subscribedAt : null;
            res.status(200).json({subscribeIsBefore: subscribedAt ? subscribedAt.lessThanOrEqual(createdAt) : false });

        } else {
            res.status(404).json({reason : 'Document doesnt exists'});
        }
    }).finally(() => {
        session.close();
        driver.close();
    })


}
module.exports = {
    getSubscribeIsBefore,
}
