const getDriver = require('./../neo/driver');
// set round = 0 and unset voteComplete
const bcrypt = require('bcrypt');
const migrate = () => {
    const driver = getDriver();
    const session = driver.session();

    let query = "" +
        " MATCH (u:User) RETURN u " ;

    return session.run(query).then(data => {
        data.records.forEach(elem => {
            let password = elem.get(0).properties.password;
            if(password) {
                let hash = bcrypt.hashSync(password, 10);
                query = "MATCH (u:User) WHERE id = $id SET password = $hash RETURN u ";
                let _session = driver.session();
                _session.run(query, {id: elem.get(0).id, hash}).then();
            }
        })
    }).finally(() => {
        session.close();
        driver.close()
    })
}
migrate();
