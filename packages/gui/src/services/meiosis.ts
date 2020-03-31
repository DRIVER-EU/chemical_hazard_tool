import Stream from 'mithril/stream';
import {
  IChemicalHazard,
  IControlParameters,
  IScenarioDefinition,
} from '../../../shared/src';
import { merge } from '../utils/mergerino';

export const sourceKey = 'chemicalHazardKey';

const storedSource = window.localStorage.getItem(sourceKey);
const hazard = (storedSource
  ? JSON.parse(storedSource)
  : {}) as IChemicalHazard;

/** Application state */
export const appStateMgmt = {
  initial: {
    app: {
      scenario: hazard.scenario ? hazard.scenario : ({} as IScenarioDefinition),
      control_parameters: hazard.control_parameters
        ? hazard.control_parameters
        : ({} as IControlParameters),
    },
  },
  actions: (us: UpdateStream) => {
    return {
      updateScenario: (scenario: IScenarioDefinition) => {
        hazard.scenario = scenario;
        appStateMgmt.effects.saveToLocalStorage(hazard);
        return us({ app: { scenario } });
      },
      updateSettings: (settings: IControlParameters) => {
        hazard.control_parameters = settings;
        appStateMgmt.effects.saveToLocalStorage(hazard);
        return us({ app: { control_parameters: settings } });
      },
    };
  },
  effects: {
    saveToLocalStorage: (h: IChemicalHazard) =>
      window.localStorage.setItem(sourceKey, JSON.stringify(h)),
  },
};

export interface IAppModel {
  app: Partial<{
    scenario: IScenarioDefinition;
    control_parameters: IControlParameters;
  }>;
}

export interface IActions {
  updateSettings: (s: IControlParameters) => UpdateStream;
  updateScenario: (s: IScenarioDefinition) => UpdateStream;
}

export type ModelUpdateFunction =
  | Partial<IAppModel>
  | ((model: Partial<IAppModel>) => Partial<IAppModel>);
export type UpdateStream = Stream<ModelUpdateFunction>;

const app = {
  initial: Object.assign({}, appStateMgmt.initial),
  actions: (us: UpdateStream) =>
    Object.assign({}, appStateMgmt.actions(us)) as IActions,
};

const update = Stream<ModelUpdateFunction>();
export const states = Stream.scan(merge, app.initial, update);
export const actions = app.actions(update);
