import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { ProduceRequest } from 'node-test-bed-adapter';

interface ISendResponse {
  [topic: string]: {
    [partition: number]: number;
  };
}

import {
  TestBedAdapter,
  Logger,
  LogLevel,
  IAdapterMessage,
} from 'node-test-bed-adapter';

const log = Logger.instance;

@Injectable()
export class TestbedService {
  public adapter: TestBedAdapter;
  private connected = false;

  handleConnection(d: any) {
    log.debug(`Timer connection received from ${d.id}`);
  }

  constructor() {
    // @Inject('DefaultWebSocketGateway')
    // private readonly socket: DefaultWebSocketGateway
    console.log('Init testbed');
    this.adapter = new TestBedAdapter({
      clientId: 'ChemicalHazardTool',
      kafkaHost: process.env.KAFKA_HOST || 'localhost:3501',
      schemaRegistry: process.env.SCHEMA_REGISTRY || 'localhost:3502',
      fromOffset: true,
      // autoRegisterSchemas: true,
      schemaFolder: path.resolve(`${process.cwd()}/schemas`),
      produce: ['chemical_hazard', 'cbrn_geojson'],
      // consume: [{ topic: 'standard_geojson' }],
      fetchAllSchemas: false,
      fetchAllVersions: false,
      wrapUnions: false,
      // wrapUnions: 'auto',
      // Start from the latest message, not from the first
      logging: {
        logToConsole: LogLevel.Info,
        logToKafka: LogLevel.Warn,
      },
    });
    this.adapter.on('ready', () => {
      this.connected = true;
      this.adapter.on('message', message => this.handleMessage(message));
      log.info('Kafka is connected');
    });
    this.adapter.on('reconnect', () => {
      this.connected = true;
      log.info('Kafka is connected');
    });
    this.adapter.on('error', err => {
      this.connected = false;
      console.error('Test-bed not connected');
      log.error(`Kafka received an error: ${err}`);
    });
    this.adapter.connect();
  }

  public send(
    payloads: ProduceRequest | ProduceRequest[],
    cb: (error?: any, data?: ISendResponse) => any
  ): any {
    if (this.connected) {
      this.adapter.send(payloads, cb);
    } else {
      console.log('Test-bed not connected...');
      cb(null, {});
    }
  }

  private async handleMessage(message: IAdapterMessage) {
    // const stringify = (m: string | Object) =>
    //   typeof m === 'string' ? m : JSON.stringify(m, null, 2);
    switch (message.topic.toLowerCase()) {
      // case 'system_heartbeat':
      //   log.info(
      //     `Received heartbeat message with key ${stringify(
      //       message.key
      //     )}: ${stringify(message.value)}`
      //   );
      //   break;
      // case 'system_timing':
      //   log.info(
      //     `Received timing message with key ${stringify(
      //       message.key
      //     )}: ${stringify(message.value)}`
      //   );
      //   break;
      // case 'system_configuration':
      //   log.info(
      //     `Received configuration message with key ${stringify(
      //       message.key
      //     )}: ${stringify(message.value)}`
      //   );
      //   break;
      default:
        // log.info(`Received ${message.topic} message with key ${stringify(message.key)}: ${stringify(message.value)}`);
        break;
    }
  }
}
