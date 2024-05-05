#!/bin/bash 
set -e

docker compose -f docker/compose.yaml up --force-recreate --build --remove-orphans -d
