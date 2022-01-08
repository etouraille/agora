#!/bin/bash
#rsync -avz . ubuntu@ami:production/node/
rsync -abz .env.production ubuntu@ami:production/node/.env
ssh ubuntu@ami production/restart_node.sh
