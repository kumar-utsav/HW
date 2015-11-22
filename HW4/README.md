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
3. 


3) **Docker Deploy**: Extend the deployment workshop to run a docker deployment process.

* A commit will build a new docker image.
* Push to local registery.
* Deploy the dockerized [simple node.js App](https://github.com/CSC-DevOps/App) to blue or green slice.
* Add appropriate hook commands to pull from registery, stop, and restart containers.

### Evaluation

* File IO (20%)
* Ambassador pattern (40%)
* Docker Deploy (40%)

### Submission

[Submit a README.md](https://docs.google.com/a/ncsu.edu/forms/d/1oioay5bF5Le7PpuH1VAzxHCSNsOdkTvEqfrymHI1wjk/viewform?usp=send_form#start=invite) with a screencast (or .gif) for each component. Include code/scripts/configuration files in repo.

Assignment is due, Monday, November 23rd midnight
