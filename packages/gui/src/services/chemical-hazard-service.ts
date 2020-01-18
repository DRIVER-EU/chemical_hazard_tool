import m from 'mithril';
import { IChemicalHazard } from '../../../shared/src';

console.log(process.env.SERVER);

class ChemicalHazardServce {
  private baseUrl = `${process.env.SERVER}/cbrn/chemical_hazard`;

  public async publish(source: Partial<IChemicalHazard>) {
    try {
      const result = await m.request<IChemicalHazard>({
        method: 'POST',
        url: this.baseUrl,
        body: source,
      });
      return result;
    } catch (err) {
      return console.error(err.message);
    }
  }
}

export const chemicalHazardService = new ChemicalHazardServce();
