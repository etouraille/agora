const dotenv = require('dotenv');
if (process.env.ENV === 'development') {
   dotenv.config({path: __dirname + '/.env.development'});
   console.log('dev');
} else {
    dotenv.config({path : __dirname + '/.env.production'});
    console.log('prod');
}
const config = {
    mercureEndpoint : process.env.mercureEndpoint,
    mercureToken : process.env.mercureToken,
    jwtKey : process.env.jwtKey,
    jwtExpirySeconds : process.env.jwtExpirySeconds,
    front: process.env.front,
    sendinblueApiKey: process.env.SENDINBLUE_TRANSAC,
    googleKey : process.env.googleKey,
}
module.exports = config;

