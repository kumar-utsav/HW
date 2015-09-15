var needle = require("needle");
var fs = require("fs");

var config = {};
config.token = process.env.DIGITAL_OCEAN_TOKEN;

var dropletID = 0; 

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

var client =
{

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			"ssh_keys":[parseInt(process.env.DIGITAL_OCEAN_SSH_ID, 10)],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: " + JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

	getDroplet: function( onResponse ){
		needle.get("https://api.digitalocean.com/v2/droplets/" + dropletID, {headers:headers}, onResponse);	
	}
};

// Create Droplet.
var name = process.argv[2];
var region = process.argv[3]; 
var image = process.argv[4];



client.createDroplet(name, region, image, function(err, resp, body) {

	dropletID = body.droplet.id;

	console.log("\nDroplet Created.");

	console.log("\nWaiting for IP assignment.......");

	setTimeout(function(){			// since IP assignment to a droplet takes time, I am making my program wait for the IP assignment.
		client.getDroplet(function(error, response){
			
			data = response.body;
			var ip = "[droplets]\n" + JSON.stringify(data.droplet.networks.v4[0].ip_address);

			fs.writeFile("inventory", ip, function(err) {
				console.log("\nInventory file created with the IP address of the droplet.")
			    if(err) {
			        return console.log(err);
			    }
			});

		});
	}, 12000);

});






