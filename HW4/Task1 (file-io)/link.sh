echo "Using a linked container that access that file over network"

docker run -itd --name client -h client --link server:server file-io
