const WebSocket = require('ws');
const {socketDocument} = require("./socket/document");



const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', socketDocument);
