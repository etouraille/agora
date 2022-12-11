#!/bin/bash
ps -aux | grep 'node serve.js' | awk '{ print $1}' | xargs kill -9
docker exec -i production-node-1 /bin/bash -c "pm2 kill;pm2 start ecosystem.config.js"
