#!/bin/bash
rsync -avz . ubuntu@ami:production/node/
ssh ubuntu@ami production/restart_node.sh
