# Leafii Server

Leafii is an open source portfolio search engine community.

### Setting up the server

First, clone the repo

```sh
$ cd ~/Documents
$ git clone git@github.com:sinr0202/leafii_delta.git
```
To run the server, you will need meteor

```sh
$ curl https://install.meteor.com/ | sh
```

This will install the latest meteor on the machine. Next cd into the project & download the dependency modules.

```sh
$ cd leafii_delta
$ meteor npm install
$ meteor
```

The last command should take a while intially. It downloads meteor packages and handles the boot. After running this command intially, the consecutive commands should be faster. The command should have also launch the server instance at port 3000

To run server, run:

```sh
$ meteor
```

### Launching headlessly

On remote development/production servers, you will want to launch the instances, then detach them. To launch meteor & detach the process follow these steps:

```sh
$ nohup meteor run --production
# [ctrl] + [z] // puts on stop in the background
$ bg
# [ctrl] + [d] // exits the ssh connection
```

You can check on the server output even after launching the instance in the background:

```sh
$ tail -f nohup.out
```

### Enviornment Variables

To securely operate the server, we need environment variables:
```
export NODE_ENV=production
export ROOT_URL=http://leafii.com
export EMAIL=support@leafii.com
export PASSWORD=*********
export LC_ALL=C     #for mongodb
export PRERENDER_SERVICE_URL=http://leafii.com:3005/
export PORT=3005    #for prerenderer
export CRAWLERSRC='/media/volume1/leafii_crawler/'
```

### IP rerouting for Leafolio

The cloud servers cannot access each other on public ip's. The servers can only communitcate through the local ip's. Rerouting the public ip to local ip allows flawless communication. The IP's may differ.

```sh
# Change dst. ip of packets sent to 208.75.74.227 (public) to 10.1.56.6 (local)
$ sudo iptables -t nat -A OUTPUT -d 208.75.74.227 -j DNAT --to-destination 10.1.56.6

# Change src. ip of packets sent from 10.1.56.6 (local) to 208.75.74.227 (public)
$ sudo iptables -t nat -A INPUT -s 10.1.56.6 -j SNAT --to-source 208.75.74.227
```

### Running prerenderer for google crawlers

(To be updated soon)

### Seeding the database

To seed the database with an initial data, run the meteor mongo console and insert the data manually

```sh
$ meteor mongo
> db.users.insert(arr) # where arr is the user data
```

### Calculating the keywords

To parse the keywords out of the database, use [leafii_crawler][https://github.com/sinr0202/leafii_crawler]

License
----
MIT
**We are an open source startup helping the community of website owners connect. Please don't harm us!**