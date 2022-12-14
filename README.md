## Agora 

Agora is a solution to edit document in a collaborative way based on amend and vote

it's build on neo4J, node, elastic, React and mercure

the website is visble [here](https://queel.fr)

## Installation on a development mode

 * install docker 
 * clone repository
```shell
git clone git@github.com:etouraille/agora.git
git submodule init
git submodule update
``` 
 * build container and launch
```shell
cd docker
docker compose build
docker compose up -d
```
 * set env variable
```shell
cd node
cp .env.example .env.development
```
You need a mercure server for the application to work properly.
The mercure server is set on remote host. the ~/agora/production permits 
to launch this mercure server.
you can also uses [this](https://mercure.rocks/docs/hub/install) to install it locally

 * install dependencies
```shell
cd ~/agora/node
npm install 
cd ~/agora/front
npm install
```
 * launch api
```shell
cd ~/agora/node
./start.sh
```
 * launch front
```shell
cd ~/agora/front
npm start
```
