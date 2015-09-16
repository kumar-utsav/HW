# Provisioning and Configuring Digital Ocean's Droplet

## Steps to create a droplet on Digital Ocean and provision it using Ansible.

1. Generate your digital ocean token using Digital Ocean GUI and save it as your environment variable to be used    lated in the nodejs script. This can be done using the following command from the terminal: ``` export DIGITAL_OCEAN_TOKEN= <your digital ocean token> ```

2. Generate your system's SSH Key using ``` ssh-keygen -t rsa ```.

3. Generate SSH ID for your system's public SSH Key using the following command:
  ```
  curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <your digital ocean token>' -d '{"name":"My SSH Public Key","public_key":"<your public SSH Key>"}' "https://api.digitalocean.com/v2/account/keys"
     
  ```
  
4. Save the SSH ID as your environment variable usin the following command: ``` export DIGITAL_OCEAN_SSH_ID=<your digital ocean ssh id> ```.

5. Now, choose the name, region, and image for your droplet and pass them into the following commad to run a nodejs script to create a droplet. This script will also get the newly created droplet's IP address and save it in an inventory file.
  ```
  node main.js <droplet_name> <region> <image>
  ```
  
6. You can do ``` cat inventory ``` to view the ip address of newly created droplet.

7. You can use the ip address in the inventory file to access the droplet using :
  ```
  ssh root@<ip_address>
  ```

8. Create a playbook.yml file which will contain the tasks performed by the Ansible on the list of servers mentioned in that file.

9. Now, run the following command to provision the droplet using ansible:
  ```
  ansible-playbook -i inventory playbooks/playbook.yml -u root
  ```
  
Below is the GIF showing the whole process:

![alt text](https://github.com/kumar-utsav/HW/blob/master/HW1/Digital%20Ocean/Digital%20Ocean.gif "Provisioning DO's Droplet")
