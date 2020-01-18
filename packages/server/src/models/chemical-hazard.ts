import { ApiProperty } from '@nestjs/swagger';
import { IChemicalHazard } from '../../../shared/src';

export class ChemicalHazard implements IChemicalHazard {
  constructor({ lat = 0, lon = 0, source = '' }: IChemicalHazard) {
    this.lat = lat;
    this.lon = lon;
    this.source = source;
  }

  @ApiProperty({ description: 'Latitude in WGS84' })
  public readonly lat: number;
  @ApiProperty({ description: 'Longitude in WGS84' })
  public readonly lon: number;
  @ApiProperty({ description: 'Source name' })
  public readonly source: string;
}
