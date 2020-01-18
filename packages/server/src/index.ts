import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationModule } from './app.module';
import { Logger } from '@nestjs/common';

const port = process.env.PORT || 3333;

async function bootstrap() {
  process.on('uncaughtException', err => {
    Logger.error('Caught exception: ' + err);
  });
  // process.on('unhandledRejection', reason => {
  //   Logger.error('Unhandled Rejection: ' + reason);
  //   if ((reason as any).stack) {
  //     Logger.error((reason as any).stack);
  //   }
  // });
  const app = await NestFactory.create<NestExpressApplication>(
    ApplicationModule,
    { cors: true }
  );
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(express.static(path.join(process.cwd(), 'public')));

  const options = new DocumentBuilder()
    .setTitle('Chemical Hazard Service')
    .setDescription('Chemical Hazard Service API description')
    .setVersion('0.1.0')
    .addTag('Chemical Hazard Service')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  process.on('unhandledRejection', reason => {
    Logger.error('Unhandled Rejection: ' + reason);
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
  });

  await app.listen(port, () => {
    Logger.log(`The chemical hazard service is listening on port ${port}.`);
    Logger.log(`Swagger documentation is available at 'http://localhost:${port}/api'.`);
  });
}
bootstrap();
