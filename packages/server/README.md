# Chemical hazard tool server

The server starts a simple node application, that:

- Serves the GUI
- Acts as a proxy for the chemical dispersion service

The service requires the following environment settings as part of an `.env` file or in your Docker settings:

```env
PORT=3333
METEO_SERVICE="http://localhost:8081"
DISPERSION_SERVICE="http://localhost:8080/process"
```

## Develop

```bash
npm start
```

## Docker

To run and publish this service (first, run `npm run docker:build`), the meteo and dispersion services, use the following commands:

```bash
docker tag chemical-hazard-tool tnocs/chemical-hazard-tool:0.2.0
docker push tnocs/chemical-hazard-tool:0.2.0
docker tag chemical-hazard-tool tnocs/chemical-hazard-tool:latest
docker push tnocs/chemical-hazard-tool:latest
docker tag meteoservice tnocs/meteoservice:0.1.0
docker push tnocs/meteoservice:0.1.0
docker tag meteoservice tnocs/meteoservice:latest
docker push tnocs/meteoservice:latest
docker tag dispersionservice tnocs/dispersionservice:0.1.0
docker push tnocs/dispersionservice:0.1.0
docker tag dispersionservice tnocs/dispersionservice:latest
docker push tnocs/dispersionservice:latest
```

In the `docker` folder, an example is published how to run them all together inside a `docker-compose`.
