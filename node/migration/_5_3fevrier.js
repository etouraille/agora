const getDriver = require('./../neo/driver');
// set round = 0 and unset voteComplete
const migrate = () => {
    const driver = getDriver();
    const session = driver.session();

    let query = "" +
        " MATCH (d:Document)-[p:FOR_EDIT_BY]->(u:User) " +
        " WITH p.invited as email , d, u , p " +
        " OPTIONAL MATCH (m:User) WHERE m.email = email " +
        " WITH m.id as uuid, p " +
        " SET p.invited = uuid ";

    return session.run(query).then(data => {

    }).finally(() => {
        session.close();
        driver.close()
    })
}
migrate();
