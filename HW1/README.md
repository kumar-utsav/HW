# HW #1 Provisioning and Configuring Servers

To complete this homework, I have used two service providers namely Digital Ocean and Amazon Web Services.

## Steps to setup Digital Ocean

1. Create an account on Digital Ocean.

2. Generate your digital ocean token using Digital Ocean GUI and save it as your environment variable to be used later in the nodejs script. This can be done using the following command from the terminal: 
   ``` export DIGITAL_OCEAN_TOKEN=<your digital ocean token> ``` 

3. Generate your system's SSH Key using ``` ssh-keygen -t rsa ```.

4. Generate SSH ID for your system's public SSH Key using the following command:
   ```
   curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <your digital ocean token>' -d '{"name":"My SSH Public Key","public_key":"<your public SSH Key>"}' "https://api.digitalocean.com/v2/account/keys"
     
   ```

5. Save your SSH ID to your system's environment variables using the following command:

   ```
   export DIGITAL_OCEAN_SSH_ID=<your SSH ID>
   ```

## Steps to setup AWS

1. Create a free tier account on AWS.

2. Go to IAM and create a user. Create the keys for the user and download them.

3. Save the keys to your system's environment variables using the following command:

   ``` 
   export AWS_ACCESS_KEY=<your aws access key>
  
   export AWS_SECRET_ACCESS_KEY=<your aws secret access key>
   ```

4. Upload your public SSH Key to the AWS using the AWS GUI.,

5. Create a Group, give Administrative Access to it and add the previously created user to it.

6. GO to EC2 console and create a KeyPair and download the .pem file.

7. Save the .pem file in the same folder as your node script and give it permissions using the following command:
   ```
   chmod 400 <pem file>
   ```

8. Save the name of the pem file in your system's environment variable using the following command: 
   ```
   export AWS_KEY_NAME=<your pem file name>
   ```

9. Go to Security Groups option in the EC2 console on AWS GUI. Create the following inbound security rules:
   ```
   All TCP
   SSH
   ```

## Setting up Ansible

1. Install ansible on your system (mac) using the following command:
   ```
   brew install ansible
   ```

2. Create a playbook file and add the provisioning tasks to it. This playbook file will get the servers list from the inventory file and provision them using the tasks listed.


 
## Provisioning and Configuring The Two Servers Using Node Script

1. Go to HW/HW1 directory. Run ``` npm install ``` to install all the dependencies needed for the execution of the node script. 

2. Run the following command:
   ```
   node main.js <droplet_name> <droplet_region> <droplet_image>
   ```  
   
   The above command will run a node script which will create a droplet on Digital Ocean and an AMI instance on AWS. The IP addresses of both the servers will be fetched and will be written along with other info regarding the servers on     the inventory file.
   
   The image name and instance type of the AMI is feeded directly into the code. 

   The node script uses the environment variables set up previously to create the VMs. 

3. You can do ``` cat inventory``` and ``` cat playbook.yml``` to check out the contents of the inventory and playbook files respectively.

4. Now, to provision the servers using Ansible, run the following command:
   ```
   ansible-playbook -i inventory playbook.yml
   ```

   The above command will consume the inventory file and use the rules in playbook.yml to provision the respective server.

5. You can check if the servers got provisioned by opening the corresponding web sites through their ip addresses in the web browser.

   You will see "Welcome to Nginx" if the servers are properly provisioned.
 
  
Below is the GIF showing the whole process:

![alt text](https://github.com/kumar-utsav/HW/blob/master/HW1/HW1.gif "Complete Process")