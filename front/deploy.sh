#!/bin/bash
npm run build
rsync -avz build/ ubuntu@ami:production/build/
