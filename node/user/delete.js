const getDriver = require('../neo/driver');
const {deleteElasticUser} = require("../elastic/deleteElastic");

const deleteUserWithId = async (id) => {

    const driver = getDriver();
    const session = driver.session();

    const query = "MATCH (u:User) WHERE u.id = $id " +
        "OPTIONAL MATCH (u)-[n:HAS_NOTIFICATION]->(:Notification) " +
        "OPTIONAL MATCH (u)-[c:CREATE]->(:Document) " +
        "OPTIONAL MATCH (:Document)-[cb:CREATED_BY]->(u) " +
        "OPTIONAL MATCH (:Document)-[sb:SUBSCRIBED_BY]->(u)-[hst:HAS_SUBSCRIBE_TO]->(:Document) " +
        "DELETE n, c , cb, sb, hst, u RETURN u.id ";

    return session.run(query, {id}).then((data) => {
        id = data.records[0].get(0);
        return deleteElasticUser(id);
    }).finally(() => {
        session.close();
        driver.close();
    })

}
module.exports = {
    deleteUserWithId,
}
