var fs = require("fs");
var AWS = require("aws-sdk");

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'us-east-1'
});

var params = {
  ImageId: process.argv[2], //ami-d05e75b8 
  InstanceType: process.argv[3], //t2.micro
  MinCount: 1, 
  MaxCount: 1,
  KeyName: process.env.AWS_KEY_NAME
};

var ec2 = new AWS.EC2();

ec2.runInstances(params, function(err, data) {
  if (err) { console.log("Could not create instance", err); return; }

  var instanceId = data.Instances[0].InstanceId;
  console.log("\nAWS Instance created with Instance ID: ", instanceId);

  console.log("\nWaiting for IP assignment.......");

  setTimeout(function(){
    ec2.describeInstances({ InstanceIds: [ instanceId ] }, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else{
        var ip = "[Instances]\n" + JSON.stringify(data.Reservations[0].Instances[0].PublicIpAddress);
        fs.writeFile("inventory", ip, function(err) {
            console.log("\nInventory file created with the public IP address of the created AWS instance.")
            if(err) {
                return console.log(err);
            }
        });
      }    
    });

  }, 5000);

});



