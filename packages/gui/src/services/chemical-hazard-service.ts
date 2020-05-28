import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import m from 'mithril';
import { IChemicalHazard } from '../../../shared/src';

console.log(process.env.SERVER);

class ChemicalHazardService {
  private baseUrl = `${process.env.SERVER}/cbrn/chemical_hazard`;

  public async publish(
    source: Partial<IChemicalHazard>
  ): Promise<FeatureCollection<Geometry, GeoJsonProperties> | void> {
    try {
      const result = await m.request<FeatureCollection>({
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

export const chemicalHazardService = new ChemicalHazardService();
