var express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const  { ping } = require('./api/ping');
const { signIn , subscribe , eachCheckToken } = require('./handlers')
const { create, get , deleteDocument } = require('./api/document');
const { documents } = require('./api/documents')
const { amend } = require('./api/amend');
const { getUsers } = require('./api/users');
const { invite, uninvite,  getInvitedUsers } = require( './api/invite');
const { readyForVote, getReadyForVote , forIt , againstIt, getVoters , deleteVote } = require('./api/vote');
const { voteSuccessOnDocument } = require( './api/voteSuccess');
const { subscribeDoc, unsubscribeDoc , getSubscribedDoc} = require('./api/subscribe')
const { socketDocument } = require('./socket/document');
const app = express()
app.use(bodyParser.json())
app.use(cookieParser())


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Expose-Headers", "token");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.use(eachCheckToken);

app.get('/api/ping', ping );
app.get('/api/users', getUsers);
app.get('/api/documents', documents);
app.post('/api/document', create);
app.get('/api/document/:id', get);
app.delete('/api/document/:id', deleteDocument);
app.post('/api/amend', amend );
app.post('/api/invite', invite );
app.post('/api/uninvite', uninvite );

app.get('/api/invited/:id', getInvitedUsers );

app.post('/subscribe', subscribe);
app.post('/signin', signIn)
app.put('/api/ready-for-vote', readyForVote);
app.get('/api/ready-for-vote/:id', getReadyForVote);
app.post('/api/vote/for', forIt );
app.delete('/api/vote/:id', deleteVote);
app.post('/api/vote/against', againstIt)
app.get('/api/vote/voters/:id', getVoters);
app.get('/api/vote-success-on-doc/:id', voteSuccessOnDocument);

app.post('/api/subscribe-doc', subscribeDoc);
app.post('/api/unsubscribe-doc', unsubscribeDoc);
app.get('/api/subscribed-doc', getSubscribedDoc);


const WebSocket = require('ws');


const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', socketDocument);

app.listen(8000)