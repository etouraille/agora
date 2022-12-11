const getDriver = require('./../neo/driver');

const { v4: uuid } = require('uuid');
const migrate = () => {
    const driver = getDriver();
    const session = driver.session();

    let query = "MATCH (u:User) WHERE u.id IS NULL RETURN ID(u) ";
    return session.run(query).then(data => {
        if (data.records.length === 0) return null;
        return Promise.all(data.records.map(item => {
            let id = item.get(0).low;
            console.log(id);
            query = "MATCH (u) WHERE ID(u) = $id SET u.id = $uuid";
            let _session = driver.session();
            return _session.run(query, {id, uuid: uuid()})
                .then(() => console.log( 'id seted'))
                .finally(() => _session.close());
        }))
    }).finally(() => {
        session.close();
        driver.close()
    })
}
migrate();

const migrateArchive = () => {
    const driver = getDriver();
    const session = driver.session();
    let query = "MATCH (:Document)-[:HAS_ARCHIVE]->(d:Document) " +
        "REMOVE d:Document " +
        "SET d:Archive ";

    return session.run(query).then(() => console.log('complete Archive')).finally(() => {
        session.close();
        driver.close();
    })
}
migrateArchive();
