import * as path from 'path';
import { Get, Controller, Inject, Injectable } from '@nestjs/common';

import {
  TestBedAdapter,
  Logger,
  LogLevel,
  ITopicMetadataItem,
  IAdapterMessage,
  ITestBedOptions,
} from 'node-test-bed-adapter';
import { OffsetFetchRequest } from 'kafka-node';

const log = Logger.instance;

@Injectable()
export class TestbedService {
  public adapter: TestBedAdapter;

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
      this.adapter.on('message', message => this.handleMessage(message));

      log.info('Kafka is connected');
      // this.getTopics();
    });
    this.adapter.on('error', err =>
      log.error(`Kafka received an error: ${err}`)
    );
    this.adapter.connect();
  }

  // private getTopics() {
  //   this.adapter.loadMetadataForTopics([], (error, results) => {
  //     if (error) {
  //       return log.error(error);
  //     }
  //     if (results && results.length > 0) {
  //       results.forEach(result => {
  //         if (result.hasOwnProperty('metadata')) {
  //           console.log('TOPICS');
  //           const metadata = (result as {
  //             [metadata: string]: { [topic: string]: ITopicMetadataItem };
  //           }).metadata;
  //           for (let key in metadata) {
  //             const md = metadata[key];
  //             console.log(
  //               `Topic: ${key}, partitions: ${Object.keys(md).length}`
  //             );
  //           }
  //         } else {
  //           console.log('NODE');
  //           console.log(result);
  //         }
  //       });
  //     }
  //   });
  // }

  private async handleMessage(message: IAdapterMessage) {
    const stringify = (m: string | Object) =>
      typeof m === 'string' ? m : JSON.stringify(m, null, 2);
    switch (message.topic.toLowerCase()) {
      case 'system_heartbeat':
        log.info(
          `Received heartbeat message with key ${stringify(
            message.key
          )}: ${stringify(message.value)}`
        );
        // if (this.socket && this.socket.server) {
        //   // this.socket.server.emit('time', this.getAdapterState());
        // }
        break;
      case 'system_timing':
        log.info(
          `Received timing message with key ${stringify(
            message.key
          )}: ${stringify(message.value)}`
        );
        // if (this.socket && this.socket.server) {
        //   // this.socket.server.emit('time', this.getAdapterState());
        // }
        break;
      case 'system_configuration':
        log.info(
          `Received configuration message with key ${stringify(
            message.key
          )}: ${stringify(message.value)}`
        );
        break;
      default:
        // log.info(`Received ${message.topic} message with key ${stringify(message.key)}: ${stringify(message.value)}`);
        break;
    }
  }
}
