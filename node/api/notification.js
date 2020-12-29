const getDriver = require('./../neo/driver');

const notificationGet = (req, res ) => {

    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (u:User)-[nr:HAS_NOTIFICATION]->(n:Notification)-[:NOTIFY_ON]->(d:Document) " +
        "WHERE u.login = $user AND n.clear = false " +
        "OPTIONAL MATCH (d)-[:HAS_PARENT*1..]->(p:Document) WHERE NOT (p)-[:HAS_PARENT]->(:Document) " +
        "RETURN d, n , p ";
    const result = session.run( query , { user : res.username });

    let ret = [];

    result.then( data => {
        data.records.forEach( elem => {
            let notification = elem.get(1).properties;
            let user = res.username;
            let id = elem.get(0).properties.id;
            let title = elem.get(2) ? elem.get(2).properties.title : elem.get(0).properties.title;
            ret.push({ id , user , notification , title });
        })
        res.json(ret).end();
    }, error => {
        console.log( error );
        res.status(500).json( { reason : error }).end();
    })


}

const clear = (req, res ) => {
    const {id } = req.body;
    const driver = getDriver();
    const session = driver.session();
    const query = "MATCH (n:Notification) WHERE n.id = $id " +
        "SET n.clear = true ";

    let result = session.run( query , {id });
    result.then(data => {

        console.log( data , 'here =====================================');
        return res.json({ ok : true}).end();
    }, error => {
        console.log(error);
        return res.status( 500).json({reason : error }).end();
    }).finally(() => {
        session.close();
        driver.close();
    })

}

module.exports = {
    notificationGet,
    clear,
}