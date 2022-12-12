const dotenv = require('dotenv');
if (process.env.ENV === 'development') {
   dotenv.config({path: __dirname + '/.env.development'});
   console.log('dev');
} else {
    dotenv.config({path : __dirname + '/.env.production'});
    console.log('prod');
}
const config = {
    mercureEndpoint : process.env.MERCURE_ENDPOINT,
    mercureToken : process.env.MERCURE_TOKEN,
    mercureSubscriberToken: process.env.MERCURE_SUBSCRIBER_TOKEN,
    jwtKey : process.env.JWT_KEY,
    jwtExpirySeconds : process.env.JWT_EXPIRY_SECONDS,
    front: process.env.FRONT,
    sendinblueApiKey: process.env.SENDINBLUE_TRANSAC,
    googleKey : process.env.GOOGLE_KEY,
    facebookSecret: process.env.FACEBOOK_SECRET,
    facebookId: process.env.FACEBOOK_ID,
}
module.exports = config;

