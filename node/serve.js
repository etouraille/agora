const log = console.log;
/*
console.log = function() {
    log.apply(console, arguments);
    // Print the stack trace
    console.trace();
};
*/
const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const { home } = require("./open/home");
const { ping } = require('./api/ping');
const { signIn , subscribe , eachCheckToken } = require('./handlers')
const { create, get , deleteDocument } = require('./api/document');
const { getUser } = require("./open/user");
const { documents } = require('./api/documents')
const { amend } = require('./api/amend');
const { canAmend } = require('./acl/canAmend');
const { getUsers } = require('./api/users');
const { invite, uninvite,  getInvitedUsers } = require( './api/invite');
const { inviteEmail } = require("./api/invite-email");
const { canVote } = require('./acl/canVote');
const { canReadyForVote } = require("./api/canReadyForVote");
const { readyForVote, getReadyForVote , forIt , againstIt, getVoters , deleteVote } = require('./api/vote');
const { getSubscribeIsBefore } = require("./api/subscribeIsBefore");
const { putRound } = require("./api/round");
const { voteSuccessOnDocument } = require( './api/voteSuccess');
const { subscribeDoc, unsubscribeDoc , getSubscribedDoc, getSubscribedForDocument} = require('./api/subscribe')
const { mercure } = require( './api/mercure');
const { search } = require( './api/search');
const { test } = require('./api/test');
const { elasticRoute } = require('./api/elastic');
const { clear, notificationGet } = require('./api/notification');
const { postAttach, getAttach, deleteAttach} = require("./api/attach");
const { searchUsers } = require("./api/searchUsers");
const { socketDocument } = require('./socket/document');
const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Expose-Headers", "token");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.use(eachCheckToken);

app.get('/', home);
app.post('/home', home);
app.get('/user/:id', getUser);
app.get('/api/ping', ping );
app.get('/api/users', getUsers);
app.get('/api/documents', documents);
app.post('/api/document', create);
app.get('/api/document/:id', get);
app.delete('/api/document/:id', deleteDocument);
app.post('/api/amend', canAmend );
app.post('/api/amend', amend );
app.post('/api/invite', invite );
app.post('/api/uninvite', uninvite );

app.get('/api/invited/:id', getInvitedUsers );

app.post('/subscribe', subscribe);
app.post('/signin', signIn)
app.put('/api/ready-for-vote', canReadyForVote);
app.put('/api/ready-for-vote', readyForVote);
app.get('/api/ready-for-vote/:id', getReadyForVote);
app.get('/api/subscribe-is-before/:id', getSubscribeIsBefore);
app.put('/api/round', putRound);
app.post('/api/vote/for', canVote );
app.post('/api/vote/for', forIt );
app.delete('/api/vote/:id', deleteVote);
app.post('/api/vote/against', canVote);
app.post('/api/vote/against', againstIt)
app.get('/api/vote/voters/:id', getVoters);
app.get('/api/vote-success-on-doc/:id', voteSuccessOnDocument);

app.post('/api/subscribe-doc', subscribeDoc);
app.post('/api/unsubscribe-doc', unsubscribeDoc);
app.get('/api/subscribed-doc', getSubscribedDoc);
app.get('/api/subscribed-doc/:id', getSubscribedForDocument);
app.get('/api/mercure', mercure );
app.post('/api/search-document', search );
app.post('/api/search-user', searchUsers );
app.post('/api/notification/clear', clear );
app.get('/api/notification', notificationGet );
app.post('/api/invite-to-contribute', inviteEmail );
app.post('/api/attach', postAttach);
app.get('/api/attach/:id', getAttach);
app.delete('/api/attach/:id', deleteAttach);
//app.get('/test', test );
//app.get('/elastic/:id', elasticRoute );


const WebSocket = require('ws');



const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', socketDocument);

app.listen(8000)
