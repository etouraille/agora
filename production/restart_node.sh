#!/bin/bash
ps aux | grep 'node serve.js'| awk '{ print $2}' | xargs sudo kill -9
docker exec -i production_node_1 bin/bash -c "cd /src;npm install -g pm2;pm2 start serve.js"
