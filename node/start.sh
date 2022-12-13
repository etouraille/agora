docker exec -ti api-agora /bin/bash -c "pm2 kill;pm2 start ecosystem.config.js  --env development"
docker exec -ti socket-agora /bin/bash -c "pm2 kill;pm2 start ecosystem.config-socket.js"

