#!/bin/bash
rsync -avz --exclude '.env' . ubuntu@ami:production/cdn/
