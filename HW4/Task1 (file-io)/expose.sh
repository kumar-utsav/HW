echo "Using socat to map file access to read file container and expose over port 9001."

docker run -d --name server file-io socat tcp-l:9001,reuseaddr,fork system:'cat out.txt',nofork
