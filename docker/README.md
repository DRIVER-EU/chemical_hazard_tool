# Chemical Hazard Tool: docker deployment

This docker compose file is based on the example of running the Table-Top Infrastructure. 

This `docker-compose.yml` will start the following services:

- Zookeeper: [Apache Zookeeper](https://zookeeper.apache.org/), an internal service, required for managing the state of connected client (what group of clients have read what messages). In case a client crashes, it can continue processing messages where it crashed.
- Broker: [Apache Kafka](https://kafka.apache.org/) is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications. All TTI messages are streamed over Kafka between different solutions.
- Schema registry: Each published message must adhere to a an [AVRO-based](https://avro.apache.org/) schema, so each connected client knows exactly what information it receives. 
- Kafka REST: A REST client for getting information from Kafka.
- Kafka topics UI: An optional service to easily inspect the Kafka topics, and the messages that were sent.
Go to the [Topics UI](http://localhost:3600).
- Kafka schema registry UI: An optional service to easily inspect the AVRO schemas that are used per topic (each topic is associated with one and only one schema, but a schema may have different versions).
Go to the [Schema registry UI](http://localhost:3601).
- Bootstrapper: A service that runs on startup, registering all required schemas and topics. When creating new schema files, just add them to the `schemas` folder and add their name to the `PRODUCE_TOPICS` setting of the bootstrapper, so the producer can create them on start-up.
- Meteo Web Service: A web service that retreives the current meteo information.
- Dispersion service: A web service that computes the dispersion of a gas cloud.
- Chemical Hazard Tool: A combination of a server and GUI that enable the user to interface with the dispersion service and inspect the output of the Chemical Hazard Tool.

## Starting the environment

To start all the services in the background (`-d` flag) run the following command in the current folder:

```bash
docker-compose up -d
```

## Inspecting the environment

If you have [nodejs](https://nodejs.org/en/) installed, you can try `dockly` (`npm i -g dockly`).  
Alternatively, if the [Docker plugin](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) is installed in [VS code](https://code.visualstudio.com/), the logs can be shown by rightlicking on the running image and pressing "Logs".

## Setting up the server on the VM

- Install [Nginx](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)
- Install [letsencrypt-nginx](https://phoenixnap.com/kb/letsencrypt-nginx) to setup NGINX with Let's Encrypt.
- Install [Docker](https://docs.docker.com/engine/install/ubuntu/).
- While running the example, I got the error message, `connection refused`. This is due to the proxy on the VM. I could fix it by using the link provided [here](https://stackoverflow.com/questions/50130899/cant-docker-pull-connection-refused), specifically:

```bash
sudo mkdir -p /etc/systemd/system/docker.service.d
```

Create a file called `/etc/systemd/system/docker.service.d/http-proxy.conf` that adds the HTTP_PROXY environment variable:

```bash
[Service]
Environment="HTTP_PROXY=http://proxy.example.com:80/"
```

And flush changes:

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
systemctl show --property=Environment docker

# Install docker-compose
sudo apt install docker-compose

# Allow current user to start Docker (without sudo)
sudo chown $USER /var/run/docker.sock

# Pull/update all images
docker-compose pull
docker-compose up -d
```
