import { Post, Controller, Inject, Body } from '@nestjs/common';
import { Logger, ProduceRequest } from 'node-test-bed-adapter';
import { TestbedService } from '../services/testbed.service';
import { ChemicalHazard } from '../models/chemical-hazard';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import axios from 'axios';
import { geojsonToAvro } from '../utils';

const log = Logger.instance;

@Controller('cbrn')
export class ChemicalHazardsController {
  constructor(
    @Inject('TestbedService') private readonly testbed: TestbedService
  ) {}

  @ApiBody({ type: ChemicalHazard })
  @ApiResponse({ description: 'GeoJSON' })
  @ApiOperation({ description: 'Create a new chemical hazard source' })
  @Post('chemical_hazard')
  async createSource(@Body() chemicalHazardSource: ChemicalHazard) {
    return new Promise((resolve, reject) => {
      const payload = {
        topic: 'chemical_hazard',
        messages: chemicalHazardSource,
      } as ProduceRequest;
      console.log(payload);
      this.testbed.send(payload, (err, data) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        if (data) {
          log.info(JSON.stringify(data, null, 2));
          axios
            .post<GeoJSON.FeatureCollection<GeoJSON.MultiLineString>>(
              //'http://app-practice01.tsn.tno.nl:8080/process',
              'http://localhost:8080/process',
              chemicalHazardSource
            )
            .then(res => {
              const features = res.data
                ? res.data.features.filter(
                    f =>
                      f.geometry &&
                      f.geometry.coordinates &&
                      f.geometry.coordinates.length > 0 &&
                      f.properties &&
                      Object.keys(f.properties).length > 0
                  )
                : undefined;
              const geojson = {
                features,
                type: res.data.type,
                bbox: res.data.bbox,
              };
              log.info(`statusCode: ${res.status}`);
              const resPayload = {
                topic: 'cbrn_geojson',
                messages: geojsonToAvro(geojson),
              };
              this.testbed.send(resPayload, (err2, data2) => {
                if (err2) {
                  log.error(err2);
                }
                log.info(JSON.stringify(data2, null, 2));
              });
              resolve(geojson);
            })
            .catch(error => {
              reject(error);
            });
        }
      });
    });
  }
}
