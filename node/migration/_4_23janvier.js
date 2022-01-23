const getDriver = require('./../neo/driver');
// set round = 0 and unset voteComplete
const migrate = () => {
    const driver = getDriver();
    const session = driver.session();

    let query = "MATCH (d:Document)-[r:FOR_EDIT_BY]->(:User) " +
        "WHERE NOT (d)-[:HAS_PARENT]->(:Document) " +
        "SET r.round = 0 , r.readyForVote = true";
    return session.run(query).then(data => {

    }).finally(() => {
        session.close();
        driver.close()
    })
}
migrate();
