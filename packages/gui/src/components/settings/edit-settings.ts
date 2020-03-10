import m, { FactoryComponent } from 'mithril';
import { LayoutForm } from 'mithril-ui-form';
import { CbrnOutput, IControlParameters } from '../../../../shared/src';
import { IActions, IAppModel } from '../../services/meiosis';
import { formGenerator } from '../../template/form';

export const sourceKey = 'chemicalHazardKey';
export const zoomKey = 'zoom';

export const EditSettings: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  return {
    view: ({ attrs: { state, actions } }) => {
      const { app } = state;
      if (!app) {
        actions.updateSettings({
          max_dist: 1000,
          z: 1.5,
          cell_size: 10,
          time_of_interest: 120,
          output: CbrnOutput.contours,
        } as IControlParameters);
        return;
      }
      const form = formGenerator(app);
      return m('.row', [
        m(LayoutForm, {
          form,
          obj: app,
          onchange: _ =>
            app.control_parameters &&
            actions.updateSettings(app.control_parameters),
          section: 'settings',
        }),
      ]);
    },
  };
};
