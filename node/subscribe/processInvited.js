
const getDriver = require('../neo/driver');

const processInvited = (req, res, next ) => {
    const token = req.header('SubscribeToken');
    if(token) {
        let driver = getDriver();
        let session = driver.session();
        let query = "MATCH (i:InvitedUser) WHERE i.token = $token AND i.processed IS NULL SET i.processed = 1 RETURN i ";
        let result = session.run(query, {token});
        result.then(data => {
            if (data.records.length === 0) {
                next();
            } else {
                res.documentToSubscribe = data.records[0].get(0).properties.documentId;
                next();
            }
        })
    } else {
        next();
    }
}

module.exports = {
    processInvited,
}