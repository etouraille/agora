const dotenv = require('dotenv');
dotenv.config();
const config = {
    mercureEndpoint : process.env.mercureEndpoint ? process.env.mercureEndpoint : 'mercure.flibus.team',
    mercureToken : process.env.mercureToken ? process.env.mercureToken : 'changeIt',
    jwtKey : process.env.jwtKey ? process.env.jwtKey : 'la vie des mouettes',
    jwtExpirySeconds : process.env.jwtExpirySeconds ? process.env.jwtExpirySeconds : 6000,
    front: process.env.front ? process.env.front : 'http://localhost:3000'
}
module.exports = config;
