const getDriver = require('../neo/driver');
const {deleteElasticUser} = require("../elastic/deleteElastic");

const deleteUserWithId = async (id) => {

    const driver = getDriver();
    const session = driver.session();

    const query = "MATCH (u:User) WHERE u.id = $id " +
        "OPTIONAL MATCH (u)-[n:HAS_NOTIFICATION]->(:Notification) " +
        "OPTIONAL MATCH (u)-[c:CREATE]->(:Document) " +
        "OPTIONAL MATCH (u)-[vf:VOTE_FOR]->(:Document) " +
        "OPTIONAL MATCH (:Document)-[cb:CREATE_BY]->(u) " +
        "OPTIONAL MATCH (:Document)-[feb:FOR_EDIT_BY]->(u) " +
        "OPTIONAL MATCH (:Document)-[sb:SUBSCRIBED_BY]->(u)-[hst:HAS_SUBSCRIBE_TO]->(:Document) " +
        "OPTIONAL MATCH (:Document)-[osb:OLD_SUBSCRIBED_BY]->(u)-[ohst:OLD_HAS_SUBSCRIBE_TO]->(:Document) " +

        "DELETE n, c ,  cb, sb, hst, feb, vf, osb, ohst,  u ";

    return session.run(query, {id}).then((data) => {
        return deleteElasticUser(id);
    }).finally(() => {
        session.close();
        driver.close();
    })

}
module.exports = {
    deleteUserWithId,
}
