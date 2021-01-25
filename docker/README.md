# TTI Local

Example of running the Table-Top Infrastructure locally on your PC. This `docker-compose.yml` will start the following services:

- Zookeeper: [Apache Zookeeper](https://zookeeper.apache.org/), an internal service, required for managing the state of connected client (what group of clients have read what messages). In case a client crashes, it can continue processing messages where it crashed.
- Broker: [Apache Kafka](https://kafka.apache.org/) is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications. All TTI messages are streamed over Kafka between different solutions.
- Schema registry: Each published message must adhere to a an [AVRO-based](https://avro.apache.org/) schema, so each connected client knows exactly what information it receives. 
- Kafka REST: A REST client for getting information from Kafka.
- Kafka topics ui: An optional service to easily inspect the Kafka topics, and the messages that were sent.
Go to the [Topics UI](http://localhost:3600).
- Kafka schema registry ui: An optional service to easily inspect the AVRO schemas that are used per topic (each topic is associated with one and only one schema, but a schema may have different versions).
Go to the [Schema registry UI](http://localhost:3601).
- Bootstrapper: A service that runs on startup, registering all required schemas and topics. When creating new schema files, just add them to the `schemas` folder and add their name to the `PRODUCE_TOPICS` setting of the bootstrapper, so the producer can create them on start-up.
- Meteo Web Service: A web service that retreives the current meteo information.
- Dispersion service: A web service that computes the dispersion of a gas cloud.

## Starting the environment

```bash
docker-compose up -d
```

Currently, on startup, you need to register the Meteo web service with the dispersion service. Therefore, run the following command in your browser:

```browser
GET http://localhost:8080/SetMeteoServiceHost?host=http://meteoservice:8081
```

## Inspecting the environment

If you have [nodejs](https://nodejs.org/en/) installed, you can try `dockly` (`npm i -g dockly`).
