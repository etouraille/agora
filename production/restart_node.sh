#!/bin/bash
ps -aux | grep 'node serve.js' | awk '{ print $1}' | xargs kill -9
docker exec -i production_node_1 /bin/bash -c "pm2 kill;pm2 start -f -i 1 serve.js"
