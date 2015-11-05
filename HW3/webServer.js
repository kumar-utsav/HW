var redis = require('redis')
var multer = require('multer')
var express = require('express')
var fs = require('fs')
var app = express();

// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) {
    console.log(req.method, req.url);

    client.lpush("visitedList", req.url, function(err, reply) {
        client.ltrim("visitedList", 0, 9);
    });

    next(); // Passing the request to the next handler in the stack.
});

// An expiring cache: set/get task.

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

// Recent visited sites: recent task.

app.get('/recent', function(req, res) {
    client.lrange("visitedList", 0, -1, function(err, urls) {
        res.send(urls);
    });
});

// Upload/meow task.

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

// HTTP SERVER

var port = process.argv[2];

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log(host)

    console.log('Example app listening on localhost at port: ', host, port);
});

app.get('/', function(req, res) {
    res.send('hello world')
})