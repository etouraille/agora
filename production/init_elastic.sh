#!/bin/bash
docker exec -ti production_node_1 /bin/bash -c "cd /src;node elasticInit.js"
