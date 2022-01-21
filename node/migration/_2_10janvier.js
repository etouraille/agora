const getDriver = require('./../neo/driver');
// set round = 0 and unset voteComplete
const migrate = () => {
    const driver = getDriver();
    const session = driver.session();

    let query = "MATCH (:Document)-[r:FOR_EDIT_BY]->(:User) " +
        "SET r.round = 0 REMOVE r.readyForVote ";
    return session.run(query).then(data => {

    }).finally(() => {
        session.close();
        driver.close()
    })
}
migrate();

