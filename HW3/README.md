# HW #3 Proxies, Queues, Cache Fluency.

### Tasks

#### Complete set/get

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

#### Complete recent

Code snippet for this task:

```
app.get('/recent', function(req, res) {
    client.lrange("visitedList", 0, -1, function(err, urls) {
        res.send(urls);
    });
});
```

#### Complete upload/meow

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


#### Additional service instance running

Code snippet for this task:


#### Demonstrate proxy

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
