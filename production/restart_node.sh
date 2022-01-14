#!/bin/bash
docker exec -i production_node_1 /bin/bash -c "pm2 start -f serve.js"
