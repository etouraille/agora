

const getDriver = require('./../neo/driver');
// set round = 0 and unset voteComplete
const migrate = () => {
    const driver = getDriver();
    const session = driver.session();

    let query = "MATCH (d:Document) " +
        "WHERE d.createdAt IS NULL " +
        "SET d.createdAt = datetime(\"2022-01-01T00:00:00.000+0100\").epochMillis ";
    return session.run(query).then(data => {
        query = "MATCH (d:Document)-[r:SUBSCRIBED_BY]->(:User)-[hst:HAS_SUBSCRIBE_TO]->(d:Document) " +
            "WHERE r.subscribedAt IS NULL OR hst.subscribedAt IS NULL  " +
        "SET r.subscribedAt = datetime(\"2022-01-01T00:00:00.000+0100\").epochMillis , " +
            " hst.subscribedAt = datetime(\"2022-01-01T00:00:00.000+0100\").epochMillis ";
        const sess = driver.session();
        return sess.run(query).then(() => {
            console.log('subscribed at done');
        }).finally(() => {
            sess.close();
        })
    }).then(() => {
        console.log('createdAt done');
    }).finally(() => {
        session.close();
        driver.close()
    })
}
migrate();

