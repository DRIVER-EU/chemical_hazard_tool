# Chemical Hazard Tool

A simple GUI and Kafka front-end to generate chemical hazard sources, and display its output.

![Screenshot](./img/screenshot.png)

## Installation

The application is a mono-repository, developed in TypeScript using [Nest.js](https://docs.nestjs.com) for the server, and [Mithril](https://mithril.js.org) for the GUI. It consists of the following packages:

- Server: to POST new chemical hazard sources to Kafka and GET chemical hazard clouds as GeoJSON from Kafka.
- GUI: to enter new source definitions and show the resulting cloud.
- Shared: shared models

Since the server connects to Kafka, make sure that you have a running instance of Kafka. The easiest way is to run the docker configuration in the `Docker` folder.

```bash
cd docker
docker-compose up -d
cd ..
# If you don't have pnpm installed, you can install it using `npm i -g pnpm`
pnpm m i
npm start
```

## Development

Assuming the project is running using `npm start`, you can access:

- The GUI at [http://localhost:1234](http://localhost:1234).
- OpenAPI (Swagger) interface at [http://localhost:3333/api](http://localhost:3333/api).
- OpenAPI configuration file at [http://localhost:3333/api-json](http://localhost:3333/api-json).
- The server at [http://localhost:3333](http://localhost:3333)

## Schemas

The chemical hazard source is defined in `packages/server/schemas/cbrn/chemical_hazard.avsc`. You can run `npm run convert` to update the TypeScript interface definition.
