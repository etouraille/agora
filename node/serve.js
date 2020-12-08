var express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const  { ping } = require('./api/ping');
const { signIn , subscribe , eachCheckToken } = require('./handlers')
const { create, get } = require('./api/document');
const { documents } = require('./api/documents')
const { amend } = require('./api/amend');
const { getUsers } = require('./api/users');
const { invite, getInvitedUsers } = require( './api/invite');
const { socketDocument } = require('./socket/document');
const app = express()
app.use(bodyParser.json())
app.use(cookieParser())


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Expose-Headers", "token");
    next();
});

app.use(eachCheckToken);

app.get('/api/ping', ping );
app.get('/api/users', getUsers);
app.get('/api/documents', documents);
app.post('/api/document', create);
app.get('/api/document/:id', get);
app.post('/api/amend', amend );
app.post('/api/invite', invite );
app.get('/api/invited/:id', getInvitedUsers );

app.post('/subscribe', subscribe);
app.post('/signin', signIn)


const WebSocket = require('ws');


const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', socketDocument);

app.listen(8000)