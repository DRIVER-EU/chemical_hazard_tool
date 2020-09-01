import { Form, padLeft } from 'mithril-ui-form';
import {
  CbrnOutput,
  IChemicalHazard,
  IControlParameters,
  IScenarioDefinition,
  PasquillClass,
} from '../../../shared/src';

/** Additional properties for internal usage */
export interface IChemicalHazardExt extends IChemicalHazard {
  extended?: {
    useQuantity?: boolean;
  };
}

const convertTime = /[\d-]* (\d{2}):(\d{2})/gm;

const transform = (dir: 'from' | 'to', v: string | Date) => {
  if (dir === 'from') {
    const m = convertTime.exec(v as string);
    if (m) {
      const d = new Date();
      d.setHours(+m[1], +m[2]);
      return d;
    }
    return new Date();
  } else {
    const d = v as Date;
    return `${padLeft(d.getDate())}-${padLeft(
      d.getMonth() + 1
    )}-${d.getFullYear()} ${padLeft(d.getHours())}:${padLeft(d.getMinutes())}`;
  }
};

export const formGenerator = (source: Partial<IChemicalHazardExt>): Form => {
  if (!source.control_parameters) {
    source.control_parameters = {
      max_dist: 1000,
      z: 1.5,
      cell_size: 10,
      time_of_interest: 120,
      output: CbrnOutput.contours,
      comment: '',
    } as IControlParameters;
  }
  if (!source.scenario) {
    source.scenario = {
      // start_of_release:
      quantity: 0,
      release_rate: 0,
      duration: 600,
      initial_size: 15,
      windspeed: 2,
      winddirection: 270,
      pasquill_class: PasquillClass.D,
      roughness_length: 0.1,
    } as IScenarioDefinition;
  }
  // if (source.scenario.quantity > 0 && source.scenario.release_rate > 0) {
  //   source.scenario.release_rate = 0;
  // }
  return [
    { id: 'source', type: 'section' },
    {
      id: 'scenario',
      label: '##### Scenario',
      className: 'col s12',
      type: [
        {
          id: 'id',
          label: 'Name',
          type: 'text',
          className: 'col m6',
        },
        {
          id: 'start_of_release',
          label: 'Start of release',
          type: 'time',
          className: 'col m6',
          transform,
        },
        { type: 'md', value: '###### Specify source', className: 'col s12' },
        {
          id: 'useQuantity',
          type: 'checkbox',
          label: 'Quantity',
          value: true,
          className: 'col m6',
        },
        {
          id: 'initial_size',
          label: 'Initial size [m]',
          type: 'number',
          className: 'col m6',
          min: 1,
          max: 25,
          required: true,
        },
        {
          id: 'quantity',
          show: 'useQuantity=true',
          label: 'Quantity [kg]',
          type: 'number',
          className: 'col m6',
          min: 1,
          max: 1000000,
          required: source.extended?.useQuantity,
        },
        {
          id: 'release_rate',
          show: ['useQuantity=false', '!useQuantity'],
          label: 'Release rate [kg/s]',
          type: 'number',
          className: 'col m6',
          min: 0,
          max: 1000,
          required: !source.extended?.useQuantity,
        },
        {
          id: 'duration',
          show: ['useQuantity=false', '!useQuantity'],
          label: 'Duration [s]',
          type: 'number',
          className: 'col m6',
          required: !source.extended?.useQuantity,
        },
        {
          id: 'chemical',
          label: 'Chemical',
          type: 'select',
          className: 'col m6',
          options: [
            { id: 'unknown', label: 'unknown' },
            { id: 'carbon_monoxide', label: 'carbon monoxide' },
            { id: 'phosgene', label: 'phosgene' },
            { id: 'styrene', label: 'styrene' },
            { id: 'chlorine', label: 'chlorine' },
            { id: 'methane', label: 'methane' },
          ],
        },
        {
          id: 'toxicity',
          show: 'chemical=unknown',
          label: 'Toxicity',
          type: 'select',
          value: 'medium',
          className: 'col m6',
          options: [
            { id: 'verylow', label: 'Very low' },
            { id: 'low' },
            { id: 'medium' },
            { id: 'high' },
            { id: 'veryhigh', label: 'Very high' },
          ],
        },
        { type: 'md', value: '###### Meteorology', className: 'col s12' },
        {
          id: 'use_meteo_service',
          type: 'checkbox',
          label: 'Wind direction and speed from external service',
          value: 'true',
          className: 'col m12',
        },
        {
          id: 'windspeed',
          show: 'use_meteo_service=false',
          label: 'Wind speed [km/h]',
          type: 'number',
          className: 'col s12 m6',
          required: true,
        },
        {
          id: 'winddirection',
          show: 'use_meteo_service=false',
          label: 'Wind direction [DGT]',
          type: 'number',
          className: 'col s12 m6',
          required: true,
        },
        {
          id: 'pasquill_class',
          label: 'Pasquill class',
          type: 'select',
          options: [
            { id: 'A' },
            { id: 'B' },
            { id: 'C' },
            { id: 'D' },
            { id: 'E' },
            { id: 'F' },
          ],
          required: true,
          className: 'col s12 m6',
        },
        {
          id: 'roughness_length',
          label: 'Roughness length [m]',
          type: 'text',
          // min: 0.001,
          // max: 10,
          required: true,
          className: 'col s12 m6',
        },
      ],
    },
    {
      id: 'control_parameters',
      label: '##### Control parameters',
      className: 'col s12',
      type: [
        {
          id: 'output',
          label: 'Output',
          type: 'select',
          className: 'col m6',
          options: [
            { id: 'template' , label: 'template' },
            { id: 'contours', label: 'contours' },
            { id: 'both', label: 'both' },
            { id: 'ensemble', label: 'ensemble' },
            { id: 'trajectories', label: 'trajectories' },
          ],
        },
        {
          id: 'time_of_interest',
          label: 'Time of interest [s]',
          type: 'number',
          className: 'col m6',
        },
      ],
    },
    { id: 'settings', type: 'section' },
    {
      id: 'control_parameters',
      label: '##### Control parameters',
      className: 'col s12',
      type: [
        {
          id: 'max_dist',
          label: 'Max distance [m]',
          type: 'number',
        },
        {
          id: 'z',
          type: 'number',
        },
        {
          id: 'cell_size',
          label: 'Cell size [m]',
          type: 'number',
        },
        {
          id: 'time_of_interest',
          label: 'Time of interest [s]',
          type: 'number',
        },
        {
          id: 'comment',
          label: 'Comment',
          type: 'textarea',
        },
      ],
    },
  ] as Form;
};
