#!/bin/bash
rsync -avz --exclude '.env' --exclude 'node_modules'  . ubuntu@ami:production/cdn/
