#!/bin/bash
docker exec -i production_node_cdn_1 /bin/bash -c "pm2 kill;pm2 start -f app.js"
