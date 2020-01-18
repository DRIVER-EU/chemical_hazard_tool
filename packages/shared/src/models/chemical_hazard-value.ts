/** Chemical hazard source specification */
export interface IChemicalHazard {
  /** Latitude expressed in WGS84 between [-90, 90] */
  lat: number;
  /** Longitude expressed in WGS84 between [-180, 180] */
  lon: number;
  /** Source specification */
  source: string;
}
