#!/bin/bash
docker exec -ti production-node-1 /bin/bash -c "cd /src;node elasticInit.js"
