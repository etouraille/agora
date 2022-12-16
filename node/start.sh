ps -aux | grep 'node socket.js' | awk '{ print $2 }' | xargs sudo kill -9
ps -aux | grep 'node serve.js' | awk '{ print $2 }' | xargs sudo kill -9
docker exec -i api-agora /bin/bash -c "pm2 kill;pm2 restart all --update-env;pm2 start ecosystem.config.js --env development;pm2 restart node  --update-env"
docker exec -ti socket-agora /bin/bash -c "node socket.js"

