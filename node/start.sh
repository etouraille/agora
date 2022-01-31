docker exec -ti docker_node_1 /bin/bash -c "pm2 kill;pm2 start ecosystem.config.js  --env development"

