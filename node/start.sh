ps -aux | grep 'node socket.js' | awk '{ print $2 }' | xargs sudo kill -9 
docker exec -i api-agora /bin/bash -c "pm2 kill;pm2 start ecosystem.config.js  --env development"
docker exec -ti socket-agora /bin/bash -c "node socket.js"

