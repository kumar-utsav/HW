var fs = require("fs");
var needle = require("needle");
var config = {};
config.token = process.env.DIGITAL_OCEAN_TOKEN;

var dropletID = 0; 

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

var droplet =
{

	createDroplet: function (dropletName, region, imageName, servers)
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

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, function(err, res, body){

			dropletID = body.droplet.id;

			console.log("\nDroplet created with droplet ID: " + dropletID);

			console.log("\nWaiting for droplet's IP assignment.......");

			setTimeout(function(){	// since IP assignment to a droplet takes time, I am making my program wait for the IP assignment.
				needle.get("https://api.digitalocean.com/v2/droplets/" + dropletID, {headers:headers}, function(err, response){
					
					data = response.body;

					var ip = "node_droplet_" + dropletID + " ansible_ssh_host=" + data.droplet.networks.v4[0].ip_address + " ansible_ssh_user=root" + "\n";

		            fs.appendFile('inventory', ip, function(err){

		            	console.log("\nNew droplet ID written to inventory.");
						if(err) {
							return console.log(err);
						}
		            });

				});			
			}, 12000);			

		});
	}
};


module.exports = droplet;


