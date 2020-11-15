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
    type_of_release?: string;
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
      source_height: 2,
    } as IScenarioDefinition;
  }
  // if (source.scenario.quantity > 0 && source.scenario.release_rate > 0) {
  //   source.scenario.release_rate = 0;
  // }
  return [
    { id: 'source', type: 'section' },
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
          show: ['output=contours', 'output=both'],
          label: 'Time of interest [s]',
          type: 'number',
          className: 'col m6',
          value: 900,
        },
      ],
    },
    {
      id: 'scenario',
      label: '##### Scenario',
      className: 'col s12',
      type: [
        {
          id: 'id',
          label: 'Name',
          type: 'text',
          value: 'Leakage of (what) at (where)',
          className: 'col m12',
        },
        {
          id: 'start_of_release',
          label: 'Start of release',
          type: 'time',
          className: 'col m6',
          transform,
        },
        { type: 'md', 
          value: '###### Specify source', 
          className: 'col s12' },
        {
          id: 'type_of_release',
          show: '!control_parameters.output=template',
          type: 'select',
          label: 'Release type',
          options: [
            { id: 'instantaneous', label: 'instantaneous' },
            { id: 'continuous', label: '(semi) continuous' },
          ],
          className: 'col m6',
        },
        {
          id: 'initial_size',
          show: 'control_parameters.mode=advanced',
          label: 'Initial size [m]',
          type: 'number',
          className: 'col m6',
          min: 1,
          max: 25,
          required: true,
        },
        {
          id: 'quantity',
          show: 'type_of_release=instantaneous',
          label: 'Quantity [kg]',
          type: 'number',
          className: 'col m6',
          min: 1,
          max: 1000000,
          // required: source.extended?.useQuantity,
        },
        {
          id: 'release_rate',
          show: 'type_of_release=continuous',
          label: 'Release rate [kg/s]',
          type: 'number',
          className: 'col m6',
          min: 0,
          max: 1000,
          // required: !source.extended?.useQuantity,
        },
        {
          id: 'duration',
          show: ['type_of_release=continuous', 'control_parameters.mode=advanced'],
          label: 'Duration [s]',
          type: 'number',
          className: 'col m6',
          // required: !source.extended?.useQuantity,
        },
        {
          id: 'source_height',
          show: '!control_parameters.output=template',
          label: 'Source height [m]',
          type: 'number',
          className: 'col m6',
        },
        {
          id: 'chemical',
          show: '!control_parameters.output=template',
          label: 'Chemical',
          type: 'select',
          className: 'col m6',
          options: [
            { id: 'unknown', label: 'unknown' },
            { id: 'acrolein', label: 'acrolein' },
            { id: 'acrylonitrile', label: 'acrylonitrile' },
            { id: 'allyl alcohol', label: 'allyl alcohol' },
            { id: 'ammonia', label: 'ammonia' },
            { id: 'bromine', label: 'bromine' },
            { id: 'bromomethane', label: 'bromomethane' },
            { id: 'carbon_monoxide', label: 'carbon monoxide' },
            { id: 'chlorine', label: 'chlorine' },
            { id: 'ethylene oxide', label: 'ethylene oxide' },
            { id: 'hydrogen chloride', label: 'hydrogen chloride' },
            { id: 'hydrogen cyanide', label: 'hydrogen cyanide' },
            { id: 'hydrogen fluoride', label: 'hydrogen fluoride' },
            { id: 'hydrogen sulfide', label: 'hydrogen sulfide' },
            { id: 'methane', label: 'methane' },
            { id: 'methyl isocyanate', label: 'methyl isocyanate' },
            { id: 'nitrogen dioxide', label: 'nitrogen dioxide' },
            { id: 'phosgene', label: 'phosgene' },
            { id: 'phosphine', label: 'phosphine' },
            { id: 'sulfur dioxide', label: 'sulfur dioxide' },
            { id: 'tetraethyl lead', label: 'tetraethyl lead' },
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
          label: 'Wind speed [m/s]',
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
          show: '!control_parameters.output=template',
          label: 'Pasquill class',
          type: 'select',
          options: [
            { id: 'A', label: 'Very unstable' },
            { id: 'B', label: 'Unstable' },
            { id: 'C', label: 'Slightly Unstable' },
            { id: 'D', label: 'Neutral' },
            { id: 'E', label: 'Slightly stable' },
            { id: 'F', label: 'Stable' },
          ],
          required: true,
          className: 'col s12 m6',
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
          id: 'mode',
          type: 'select',
          options: [
            { id: 'simple', label: 'Simple'},
            { id: 'advanced', label: 'Advanced'},
          ],
          value: 'simple',
        },
        {
          id: 'z',
          type: 'number',
          value: 1.5,
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
