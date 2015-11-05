var redis = require("redis")
var request = require("request")
var express = require("express")
var multer = require('multer')

var app = express()
var client = redis.createClient(6379, '127.0.0.1', {})

var next = 3000;

var server = app.listen(3002, function() {
    var host = server.address().address;
    var port = server.address().port;

    client.set('prev', 3000);

    console.log('Example app listening at http://%s:%s', host, port);

});

function resolvePort() {

    client.get('prev', function(err, value) {
        if (value == 3000) {
            next = 3001;
            client.set('prev', 3001);
        } else {
            next = 3000;
            client.set('prev', 3000);
        }
    });

    return next;
}


app.get('/', function(req, res) {
    var port = resolvePort();
    console.log("Response from server localhost:" + port);
    request('http://localhost:' + port + '/', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
    })
});

app.get('/get', function(req, res) {
    var port = resolvePort();
    console.log("Response from server localhost:" + port);
    request('http://localhost:' + port + '/get', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
    })
});

app.get('/set', function(req, res) {
    var port = resolvePort();
    console.log("Response from server localhost:" + port);
    request('http://localhost:' + port + '/set', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
    })
});

app.post('/upload', [multer({
    dest: './uploads/'
}), function(req, res) {

    var port = resolvePort();
    console.log("Response from server localhost:" + port);
    
    request({url: 'http://localhost:' + port + '/upload', files: req.files}, function(error, response, body) {
        console.log("Res: " + JSON.stringify(response));
        if (!error && response.statusCode == 200) {
            res.end(body)
        }
    })

    res.status(204).end()
}]);

app.get('/meow', function(req, res) {
    var port = resolvePort();
    console.log("Response from server localhost:" + port);
    request('http://localhost:' + port + '/meow', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
    })
});

app.get('/recent', function(req, res) {
    var port = resolvePort();
    console.log("Response from server localhost:" + port);
    request('http://localhost:' + port + '/recent', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body)
        }
    })
});