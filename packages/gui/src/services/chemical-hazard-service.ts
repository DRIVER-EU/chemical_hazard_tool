import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import m from 'mithril';
import { IChemicalHazard } from '../../../shared/src';

console.log(process.env.SERVER);

class ChemicalHazardService {
  // private baseUrl = `http://localhost:8080/process`;
  private baseUrl = `${process.env.SERVER}/cbrn/dispersion`;

  public async publish(
    source: Partial<IChemicalHazard>
  ): Promise<FeatureCollection<Geometry, GeoJsonProperties> | void> {
    console.log(JSON.stringify(source, null, 2));
    try {
      const result = await m.request<FeatureCollection>({
        method: 'POST',
        url: this.baseUrl,
        body: source,
        // body: {
        //   scenario: {
        //     start_of_release: '2020-01-27 12:00',
        //     quantity: 1000,
        //     release_rate: 10,
        //     duration: 600,
        //     initial_size: 15,
        //     source_location: [4.3375, 51.8775, 0],
        //     offset_x: 7,
        //     offset_y: -3,
        //     offset_z: 1,
        //     windspeed: 2,
        //     winddirection: 270,
        //     pasquill_class: 'D',
        //     roughness_length: 0.1,
        //   },
        //   control_parameters: {
        //     max_dist: 1000,
        //     z: 1.5,
        //     cell_size: 10,
        //     time_of_interest: 120,
        //     output: 'template',
        //   },
        // },
      });
      console.log(result);
      return result;
    } catch (err) {
      return console.error(err.message);
    }
  }
}

export const chemicalHazardService = new ChemicalHazardService();
