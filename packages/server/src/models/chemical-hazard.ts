import { ApiProperty } from '@nestjs/swagger';
import {
  IChemicalHazard,
  IScenarioDefinition,
  IControlParameters,
} from '../../../shared/src';

export class ChemicalHazard implements IChemicalHazard {
  constructor({ scenario, control_parameters }: IChemicalHazard) {
    this.scenario = scenario;
    this.control_parameters = control_parameters;
  }

  @ApiProperty({ description: 'Scenario definition' })
  public readonly scenario: IScenarioDefinition;
  @ApiProperty({ description: 'Control parameters' })
  public readonly control_parameters: IControlParameters;
}
