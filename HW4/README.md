Task 1:
——————

docker build -t file-io .

docker run -d --name server file-io socat tcp-l:9001,reuseaddr,fork system:'cat out.txt',nofork

socat - TCP4:172.17.0.4:3333 

docker run -itd --name client -h client --link server:server file-io


docker exec -it <> bash

Task 2:
——————-








Install Compose

curl -L https://github.com/docker/compose/releases/download/1.5.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose




Remove Stuff

#!/bin/bash
# Delete all containers
docker rm -f $(docker ps -a -q)
# Delete all images
docker rmi $(docker images -q)


