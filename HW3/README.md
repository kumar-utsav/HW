# HW #3 Proxies, Queues, Cache Fluency.

### Tasks

#### Complete set/get

Run the server with ``` node webServer.js 3000``` command in terminal. Go to browser and go the the url ```localhost:3000/set``` to set a temporary variable. And, go to the url ```localhost:3000/get``` to fetch the value of that temporary variable. The variable will expire in 10 secs.

Code snippet for this task:
```
app.get('/set', function(req, res) {
    client.set("tempKey", "this message will self-destruct in 10 seconds")
    client.expire("tempKey", 10)
    res.send("Temporary key set!!!")
})

app.get('/get', function(req, res) {
    client.get("tempKey", function(err, value) {
        res.send(value)
    });
})
```

Screencast for this task:
![alt text](https://github.com/kumar-utsav/HW/blob/master/HW3/gifs/setget.gif "Set Get")


#### Complete recent

Run the server with ``` node webServer.js 3000``` command in terminal. Go to browser and go the the url ```localhost:3000/recent``` to see all the recent url visits.

Code snippet for this task:

```
app.get('/recent', function(req, res) {
    client.lrange("visitedList", 0, -1, function(err, urls) {
        res.send(urls);
    });
});
```
Screencast for this task:
![alt text](https://github.com/kumar-utsav/HW/blob/master/HW3/gifs/recent.gif "Recent")

#### Complete upload/meow

Run the server with ``` node webServer.js 3000``` command in terminal. Upload the images from another terminal using ``` curl -F "image=@./img/morning.jpg" localhost:3000/upload```. Go to browser and go the the url ```localhost:3000/meow``` to see the most recent image upload. Each the time url is hit, the image will be removed from the queue.

Code snippet for this task:
```
app.post('/upload', [multer({
    dest: './uploads/'
}), function(req, res) {
    
    if (req.files.image) {
        fs.readFile(req.files.image.path, function(err, data) {
            if (err) throw err;
            var img = new Buffer(data).toString('base64');
            client.rpush('images', img);
        });
    }

    res.status(204).end()
}]);

app.get('/meow', function(req, res) {
    client.rpop("images", function(err, img) {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write("<h1>\n<img src='data:my_pic.jpg;base64," + img + "'/>");
        res.end();
    });
});
```

Screencast for this task:

![alt text](https://github.com/kumar-utsav/HW/blob/master/HW3/gifs/upload.gif "Upload")

#### Additional service instance running

For this task, open two terminals and run ``` node webServer.js 3000``` in one and ```node webServer.js 3001``` in another.  You will see two instances runnning, one in each terminal.

Following is the screencast for the same:

![alt text](https://github.com/kumar-utsav/HW/blob/master/HW3/gifs/ins.gif "2 Instances")

#### Demonstrate proxy

In this task, I created a proxy server which will load balance the requests to two different servers. Run ``` node httpProxy.js <port1> <port2>``` to start the proxy server. This command will take two port numbers as user input on which the two servers are running. The requests will be served by hitting ``` localhost:3002``` but the response will come from the respective server to which the request was forwarded to by the proxy server.

Code snippet for this task:

```
var server = http.createServer(function(req, res) {

	client.lpop('ports', function(err, port){
		var address = 'http://localhost:' + port;
		proxy.web(req, res, { target: address });
		console.log("Redirecting request to port: " + port);
		client.rpush('ports', port);
	});
});

```

Screencast for this task:

![alt text](https://github.com/kumar-utsav/HW/blob/master/HW3/gifs/proxy.gif "2 Instances")
