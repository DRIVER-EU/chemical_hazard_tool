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
  if (source.scenario.quantity > 0 && source.scenario.release_rate > 0) {
    source.scenario.release_rate = 0;
  }
  return [
    { id: 'source', type: 'section' },
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
        // { id: 'useQuantity', type: 'switch' },
        {
          id: 'quantity',
          label: 'Quantity',
          type: 'number',
          className: 'col m6',
          min: 1,
          max: 1000000,
          required: !source.scenario.release_rate,
          disabled: source.scenario.release_rate > 0,
        },
        {
          id: 'release_rate',
          label: 'Release rate',
          type: 'number',
          className: 'col m6',
          min: 0,
          max: 1000,
          required: !source.scenario.quantity,
          disabled: source.scenario.quantity > 0,
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
          min: 0.1,
          max: 20,
          required: true,
        },
        { type: 'md', value: '###### Wind', className: 'col s12' },
        {
          id: 'windspeed',
          label: 'Wind speed',
          type: 'number',
          className: 'col s12 m6',
          required: true,
        },
        {
          id: 'winddirection',
          label: 'Wind direction',
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
          label: 'Roughness length',
          type: 'number',
          min: 0.1,
          max: 10,
          required: true,
          className: 'col s12 m6',
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
