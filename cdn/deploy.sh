#!/bin/bash
rsync -avz ---exclude '.env' . ununtu@ami:production/cdn/
