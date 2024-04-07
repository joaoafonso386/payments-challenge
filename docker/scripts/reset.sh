#!/bin/bash 

dir=$(dirname "$0")  
sh "$dir/stop.sh"

docker rm $(docker ps -a --format "{{.Names}}" | grep mongo)