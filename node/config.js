const dotenv = require('dotenv');
if (process.env.ENV === 'development') {
   dotenv.config({path: __dirname + '/.env.development'});
} else {
    dotenv.config({path : __dirname + '/.env.production'});
}
const config = {
    mercureEndpoint : process.env.mercureEndpoint,
    mercureToken : process.env.mercureToken,
    jwtKey : process.env.jwtKey,
    jwtExpirySeconds : process.env.jwtExpirySeconds,
    front: process.env.front,
}
module.exports = config;

