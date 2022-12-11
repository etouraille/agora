#!/bin/bash
docker exec -i production-node_cdn-1 /bin/bash -c "pm2 kill;pm2 start -f app.js"
