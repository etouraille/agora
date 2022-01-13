#!/bin/bash
rsync -avz --exclude 'traefik/acme.json' . ubuntu@ami:production/
