#!/bin/bash
rsync -avz --exclude '.env' --exclude 'node_modules' . ubuntu@ami:production/cdn/
ssh ubuntu@ami "cd production/cdn;npm install"
ssh ubuntu@ami "docker exec -i production_node_cdn_1 /bin/bash -c 'npm install -g pm2; pm2 start app.js'"
