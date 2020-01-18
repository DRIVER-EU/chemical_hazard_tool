import { Post, Controller, Inject, Body } from '@nestjs/common';
import { Logger, ProduceRequest } from 'node-test-bed-adapter';
import { TestbedService } from '../services/testbed.service';
import { ChemicalHazard } from '../models/chemical-hazard';
import { ApiOperation, ApiBody } from '@nestjs/swagger';

const log = Logger.instance;

@Controller('cbrn')
export class ChemicalHazardsController {
  constructor(
    @Inject('TestbedService') private readonly testbed: TestbedService
  ) {}

  @ApiBody({ type: ChemicalHazard })
  @ApiOperation({ description: 'Create a new chemical hazard source' })
  @Post('chemical_hazard')
  async createSource(@Body() chemicalHazardSource: ChemicalHazard) {
    return new Promise((resolve, reject) => {
      const payload = {
        topic: 'chemical_hazard',
        messages: chemicalHazardSource,
      } as ProduceRequest;
      console.log(payload);
      this.testbed.adapter.send(payload, (err, data) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        if (data) {
          log.info(JSON.stringify(data, null, 2));
          resolve(data);
        }
      });
    });
  }
}
