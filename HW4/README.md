# Homework 4 - Advanced Docker

### Tasks

#### File IO

1. Do ```docker build -t file-io .``` to build the image.

2. Once, the image is build do ```sh expose.sh```. This will create a new container which will use socat to expose the file ```out.txt``` on port 9001.

3. Now, run ```sh link.sh``` to create a linked container to server container.

4. Run ```docker exec -it <client_container_id> bash``` to get inside the client container.

5. Finally, do ```curl server:9001``` to get the content of the file out.txt located in server container. 

![alt text](https://github.com/kumar-utsav/HW/blob/master/HW4/Task1%20(file-io)/task1.gif "Task 1")


#### Ambassador Pattern

1. Create two different ubuntu based droplets (server and client) and install all the required tools (git, curl, docker, docker-compose, etc.).

2. Copy the ```docker-compose.yml``` file of the server folder to the server droplet. Do ```docker-compose up```. This will create two containers one for redis and another for redis-ambassador. 

3. Now, copy the ```docker-compose.yml``` file of the client folder to the client droplet. Do ```docker-compose up```. This will create one container for redis-ambassador. This will connect to the redis server running on the server droplet. In this compose file, you need to pass in the ip address of the droplet running the container running the redis server.

4. Now, run ```docker run -i -t --rm --link redis-ambassador:redis relateiq/redis-cli```. This will create a new container linked to the redis ambassador which will give you access to the redis-cli.
 
5. In the redis-cli you can perform redis's set and get operations.

![alt text](https://github.com/kumar-utsav/HW/blob/master/HW4/Task2%20(ambassador)/task2.gif "Task 1")

#### Docker Deploy

In this task, follow the steps from the Deployment workshop to setup everything.
