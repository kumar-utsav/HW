var fs = require("fs");
var droplet = require("./droplet");
var aws = require("./aws");

var dropletName = process.argv[2];
var region = process.argv[3]; 
var imageName = process.argv[4];

var hosts = "[servers]\n"

var awsParams = {
  ImageId: 'ami-d05e75b8',
  InstanceType: 't2.micro',
  MinCount: 1, 
  MaxCount: 1,
  KeyName: process.env.AWS_KEY_NAME
};

fs.exists("inventory", function(exists){
	if(!exists){
		fs.writeFile('inventory', hosts, function(err){
		  if(err) {
		    return console.log(err);
		  }
		});	   
	}
});

droplet.createDroplet(dropletName, region, imageName);

aws.run(awsParams);


