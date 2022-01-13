#!/bin/bash
dodcker exec -i production_node_cdn_1 /bin/bash -c "npm install -g pm2;pm2 start app.js"
