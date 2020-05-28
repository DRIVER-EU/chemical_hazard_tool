export enum PasquillClass {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F'
}

export interface IScenarioDefinition {
  /** Scenario ID or name */
  id: string;
  /** Time of release, e.g. 2020-01-27 12:00 in 24H notation */
  start_of_release: string;
  /** Total quantity in m^3? */
  quantity: number;
  /** Release quantity in m^3/h? */
  release_rate: number;
  /** Release duration in seconds? */
  duration: number;
  /** Size of source in meter? */
  initial_size: number;
  /** Wind speed in m/s? */
  windspeed: number;
  /** Wind direction in degrees, where 0 is North, and 180 is south? */
  winddirection: number;
  /** Roughness length in meters? */
  roughness_length: number;
  /**
   * Turbulence, Pasquill atmospheric stability class, see
   * https://en.wikipedia.org/wiki/Outline_of_air_pollution_dispersion#The_Pasquill_
   * atmospheric_stability_classes. A is very unstable, D is neutral, and F is
   * stable.
   */
  pasquill_class: PasquillClass;
  /**
   * Location of the source as [longitude, latitude, altitude] in WGS84, where
   * longitude in between [-180, 180], latitude in between [-90, 90], and altitude
   * in meters above the WGS84 elipse.
   */
  source_location: number[];
}

export enum CbrnOutput {
  contours = 'contours',
  template = 'template',
  both = 'both',
  trajectories = 'trajectories'
}

export interface IControlParameters {
  /** Maximum distance in meters? */
  max_dist: number;
  /** Z? */
  z: number;
  /** Cell size in meter? */
  cell_size: number;
  /** Time of interest in seconds? */
  time_of_interest: number;
  /** Format of the output data? */
  output: CbrnOutput;
  /** Comment */
  comment: string;
}

/** Chemical hazard source specification */
export interface IChemicalHazard {
  scenario: IScenarioDefinition;
  control_parameters: IControlParameters;
}
