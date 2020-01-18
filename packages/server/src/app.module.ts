import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TestbedService } from './services/testbed.service';
import { ChemicalHazardsController } from './cbrn/cbrn.controller';

@Module({
  imports: [],
  controllers: [AppController, ChemicalHazardsController],
  providers: [TestbedService],
})
export class ApplicationModule {}
