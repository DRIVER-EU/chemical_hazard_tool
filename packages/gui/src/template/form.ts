import { Form } from 'mithril-ui-form';
import { IChemicalHazard } from '../../../shared/src';

export const formGenerator = (source: Partial<IChemicalHazard>): Form => {

  // const roleOptions = roles.map(r => ({ id: r.id, label: r.title }));
  // const groupOptions = groups.map(r => ({ id: r.id, label: r.title }));
  // console.log(JSON.stringify(characteristicsForm(characteristics), null, 2));
  return [
    { type: 'md', value: '##### Source definition.' },
    {
      id: 'lat',
      label: 'Latitude',
      type: 'number',
      min: -90,
      max: 90,
      step: 0.0001,
      required: true,
      className: 'col s6',
    },
    {
      id: 'lon',
      label: 'Longitude',
      type: 'number',
      min: -180,
      max: 180,
      step: 0.0001,
      required: true,
      className: 'col s6',
    },
    {
      id: 'source',
      label: 'Source',
      type: 'text',
      required: true,
      className: 'col s12',
    },
  ] as Form;
};
