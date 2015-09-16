var fs = require("fs");
var AWS = require("aws-sdk");

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'us-east-1'
});

var ec2 = new AWS.EC2();

var aws = {
  
  run: function(params){
    
    ec2.runInstances(params, function(err, data) {
      if (err) { console.log("Could not create instance", err); return; }

      var instanceId = data.Instances[0].InstanceId;
      console.log("\nAWS Instance created with Instance ID: ", instanceId);

      console.log("\nWaiting for instances's IP assignment.......");

      setTimeout(function(){
        ec2.describeInstances({ InstanceIds: [ instanceId ] }, function(err, data) {
          
          if (err) console.log(err, err.stack); // an error occurred
          
          else{

              var ip = "node_aws_" + instanceId + " ansible_ssh_host=" + data.Reservations[0].Instances[0].PublicIpAddress + " ansible_ssh_user=ubuntu" + " ansible_ssh_private_key_file=" + params.KeyName + ".pem" + "\n";
              
              fs.appendFile('inventory', ip, function(err){
                console.log("\nNew aws instance ID written to inventory.");
                if(err) {
                  return console.log(err);
                }
              });
              
          }    
        });

      }, 5000);
    });
  }
}

module.exports = aws;

