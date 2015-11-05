var redis = require('redis');
var httpProxy = require('http-proxy');
var http = require('http');

var client = redis.createClient(6379, '127.0.0.1', {})

var serverPorts = process.argv.splice(2);



for(var i in serverPorts){
	client.rpush('ports', serverPorts[i]);	
}

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {

	client.lpop('ports', function(err, port){
		var address = 'http://localhost:' + port;
		proxy.web(req, res, { target: address });
		console.log("Redirecting request to port: " + port);
		client.rpush('ports', port);
	});
});

console.log("Proxy server listening on port: 3002");
server.listen(3002)

