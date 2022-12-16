## Agora 

Agora is a solution to edit document in a collaborative way based on amend and vote

it's build on neo4J, node, elastic, React and mercure

the website is visble [https://queel.fr](https://queel.fr)

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
