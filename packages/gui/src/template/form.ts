import { Form, padLeft } from 'mithril-ui-form';
import {
  CbrnOutput,
  IChemicalHazard,
  IControlParameters,
  IScenarioDefinition,
  PasquillClass,
} from '../../../shared/src';

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

export const formGenerator = (source: Partial<IChemicalHazard>): Form => {
  if (!source.control_parameters) {
    source.control_parameters = {
      max_dist: 1000,
      z: 1.5,
      cell_size: 10,
      time_of_interest: 120,
      output: CbrnOutput.contours,
    } as IControlParameters;
  }
  if (!source.scenario) {
    source.scenario = {
      // start_of_release:
      offset_x: 0,
      offset_y: 0,
      offset_z: 0,
      quantity: 1000,
      release_rate: 10,
      duration: 600,
      initial_size: 15,
      windspeed: 2,
      winddirection: 270,
      pasquill_class: PasquillClass.D,
      roughness_length: 0.1,
    } as IScenarioDefinition;
  }
  return [
    {
      id: 'scenario',
      label: '##### Scenario',
      className: 'col s12',
      type: [
        {
          id: 'start_of_release',
          label: 'Start of release',
          type: 'time',
          transform,
        },
        {
          id: 'quantity',
          label: 'Quantity',
          type: 'number',
          className: 'col m6',
        },
        {
          id: 'release_rate',
          label: 'Release rate',
          type: 'number',
          className: 'col m6',
        },
        {
          id: 'duration',
          label: 'Duration [s]',
          type: 'number',
          className: 'col m6',
        },
        {
          id: 'initial_size',
          label: 'Initial size [m]',
          type: 'number',
          className: 'col m6',
        },
        {
          type: 'md',
          value: '###### Source offset in meter',
          className: 'col s12',
        },
        {
          id: 'offset_x',
          label: 'X',
          type: 'number',
          className: 'col s4',
        },
        {
          id: 'offset_y',
          label: 'Y',
          type: 'number',
          className: 'col s4',
        },
        {
          id: 'offset_z',
          label: 'Z',
          type: 'number',
          className: 'col s4',
        },
        { type: 'md', value: '###### Wind', className: 'col s12' },
        {
          id: 'windspeed',
          label: 'Wind speed',
          type: 'number',
          className: 'col s12 m6',
        },
        {
          id: 'winddirection',
          label: 'Wind direction',
          type: 'number',
          className: 'col s12 m6',
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
          className: 'col s12 m6',
        },
        {
          id: 'roughness_length',
          label: 'Roughness length',
          type: 'number',
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
          id: 'max_dist',
          label: 'Max distance',
          type: 'number',
        },
        {
          id: 'z',
          type: 'number',
        },
        {
          id: 'cell_size',
          label: 'Cell size',
          type: 'number',
        },
        {
          id: 'time_of_interest',
          label: 'Time of interest',
          type: 'number',
        },
      ],
    },
  ] as Form;
};
