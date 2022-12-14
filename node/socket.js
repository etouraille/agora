const WebSocket = require('ws');
const {socketDocument} = require("./socket/document");

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};


const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', socketDocument);
