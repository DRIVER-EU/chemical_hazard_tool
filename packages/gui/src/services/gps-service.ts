import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import m from 'mithril';

console.log(process.env.SERVER);

class GPSService {
  //private baseUrl = `http://localhost:3333/gps.json`;
  private baseUrl = `http://localhost:8082`;
  // private baseUrl = `${process.env.SERVER}/cbrn/gps`;

  public async publish(
    dummy: string
  ): Promise<FeatureCollection<Geometry, GeoJsonProperties> | void> {
    console.log(JSON.stringify(dummy, null, 2));
    try {
      const result = await m.request<FeatureCollection>({
        method: 'GET',
        url: this.baseUrl,
        body: dummy
        // body: {
        //   scenario: {
        //     start_of_release: '2020-01-27 12:00',
        //     quantity: 1000,
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

export const gpsService = new GPSService();
