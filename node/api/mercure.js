const jwt = require('jsonwebtoken')
const mercure = (req, res ) => {

    let token = jwt.sign({ mercure : {  subscribe : []}}, 'changeIt', {
        expiresIn: 600, // Bearer expiring in one minute
        noTimestamp: true, // Do not add "issued at" information to avoid error "Token used before issued"
        algorithm: 'HS256',
    });
    res.json( { token : token });
}
module.exports = {
    mercure,
}
