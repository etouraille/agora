const jwt = require('jsonwebtoken')
const config = require('./../config');
const mercure = (req, res ) => {

    let token = jwt.sign({ mercure : {  subscribe : []}}, config.mercureSubscriberToken, {
        expiresIn: 3600*24, // Bearer expiring in one minute
        noTimestamp: true, // Do not add "issued at" information to avoid error "Token used before issued"
        algorithm: 'HS256',
    });
    res.json( { token : token });
}
module.exports = {
    mercure,
}
