const getDriver = require('./../neo/driver');

const getUsers = (req , res ) => {

    const driver = getDriver();
    const session = driver.session();
    const query = 'MATCH (user: User ) WHERE user.login <> $me RETURN user ';

    let result = session.run( query , { me : res.username });
    result.then((data ) => {
        let array = [];
        data.records.map( record  => {
            if( record.get(0)) {
                array.push(record.get(0).properties);
            }
        })
        return res.json(array).end();
    }, error => {
        return res.json(500, {reason : error });
    }).finally(() => {
        session.close();
        driver.close();
    })
}
module.exports = {
    getUsers,
}