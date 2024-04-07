#!/bin/bash 
set -e

docker kill $(docker ps -a --format "{{.Names}}" | grep mongo)
