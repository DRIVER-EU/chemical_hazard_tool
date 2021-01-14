import { Feature, FeatureCollection, Point, Geometry } from 'geojson';
import L, { FeatureGroup, geoJSON, map, Map, PathOptions } from 'leaflet';
import m, { FactoryComponent } from 'mithril';
import { LeafletMap } from 'mithril-leaflet';
import { Button, RangeInput, TextInput } from 'mithril-materialized';
import { LayoutForm } from 'mithril-ui-form';
import {
  IChemicalHazard,
  IControlParameters,
  IScenarioDefinition,
} from '../../../../shared/src';
import { chemicalHazardService } from '../../services/chemical-hazard-service';
import { appStateMgmt, IActions, IAppModel } from '../../services/meiosis';
import { formGenerator } from '../../template/form';

export const zoomKey = 'zoom';

/** Coordinate reference system for Rijksdriehoek */
const crsRD = new (L as any).Proj.CRS(
  'EPSG:28992',
  '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs',
  {
    origin: [-285401.92, 22598.08],
    resolutions: [
      3440.64,
      1720.32,
      860.16,
      430.08,
      215.04,
      107.52,
      53.76,
      26.88,
      13.44,
      6.72,
      3.36,
      1.68,
      0.84,
      0.42,
      0.21,
      0.105,
      0.0525,
      0.02625,
    ],
    bounds: L.bounds([-285401.92, 22598.08], [595401.92, 903401.92]),
  }
);

const baseLayers = {
  // topo: {
  //   url:
  //     'https://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/opentopoachtergrondkaart/EPSG:28992/{z}/{x}/{-y}.png',
  //   options: {
  //     maxZoom: 16,
  //   },
  // },
  'NL kleur': {
    url:
      'https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart/EPSG:3857/{z}/{x}/{y}.png',
    options: {
      minZoom: 3,
      maxZoom: 20,
      attribution: 'Map data: <a href="http://www.kadaster.nl">Kadaster</a>',
    },
  },
  OSM: {
    url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    options: {
      minZoom: 3,
      maxZoom: 20,
      attribution:
        '©OpenStreetMap Contributors. Tiles courtesy of Humanitarian OpenStreetMap Team',
    },
  },
  'NL lucht': {
    url:
      'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/2019_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg',
    options: {
      minZoom: 3,
      maxZoom: 19,
      attribution: 'Map data: <a href="http://www.pdok.nl">PDOK</a>',
    },
  },
  'NL grijs': {
    url:
      'https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaartgrijs/EPSG:3857/{z}/{x}/{y}.png',
    options: {
      minZoom: 3,
      maxZoom: 20,
      attribution: 'Map data: <a href="http://www.kadaster.nl">Kadaster</a>',
    },
  },
};

export const EditForm: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  const state = {
    map: undefined as undefined | Map,
    overlays: {} as { [key: string]: any },
    zoom: 10,
    loaded: false,
    isValid: false,
    error: '',
    deltaTime: 0,
    /** Relevant context for the Form, can be used with show/disabling */
    context: {
      admin: true,
    },
    sources: undefined as undefined | FeatureCollection<Point>,
    clouds: undefined as undefined | FeatureGroup,
    canPublish: false,
    version: 0,
    geojsonClouds: undefined as undefined | FeatureCollection<Geometry>,
  };

  const onsubmit = async (
    actions: IActions,
    hazard: Partial<IChemicalHazard>
  ) => {
    // log('submitting...');
    const { sources } = state;
    if (hazard && hazard.scenario && sources) {
      state.clouds = undefined;
      state.canPublish = false;
      hazard.scenario.source_location =
        sources.features[0].geometry.coordinates;
      hazard.scenario.source_location[2] = 0;
      actions.updateScenario(hazard.scenario);
      const res = await chemicalHazardService.publish(hazard);
      if (res) {
        state.geojsonClouds = res;
        // console.log(res.features.map((f) => JSON.stringify(f.properties)));
        state.version++;
        (state.clouds = geoJSON(res, {
          style: (feature) => {
            const style = {
              fillOpacity: feature?.properties.fillOpacity,
              color: '#' + feature?.properties.color,
            } as PathOptions;
            return style;
          },
          onEachFeature: (f) => (f.id = 'clouds'),
        })),
          m.redraw();
      }
    }
  };

  const formChanged = (source: Partial<IChemicalHazard>, isValid: boolean) => {
    state.canPublish = isValid;
    console.log(JSON.stringify(source, null, 2));
  };

  const getReleaseTime = (
    source: Partial<{ scenario: IScenarioDefinition }>,
    offsetInSec = 0
  ) => {
    const startOfRelease = source && source.scenario?.start_of_release;
    if (!startOfRelease) return undefined;
    const m = /(?<day>\d+)-(?<month>\d+)-(?<year>\d+) (?<hour>\d+):(?<minute>\d+)/i.exec(
      startOfRelease
    );
    if (!m || m.length < 5) return undefined;
    return new Date(
      new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5]).valueOf() +
        1000 * offsetInSec
    );
  };
  return {
    view: ({ attrs: { state: appState, actions } }) => {
      if (!appStateMgmt) {
        return;
      }
      // if (!loaded) {
      //   return m(CircularSpinner, { className: 'center-align', style: 'margin-top: 20%;' });
      // }
      const { app: source } = appState;
      const { context, canPublish, deltaTime, clouds, sources } = state;
      const form = formGenerator(source);
      const displayTime = getReleaseTime(source, deltaTime);
      const range =
        state.geojsonClouds &&
        state.geojsonClouds.features.reduce(
          (acc, cur) => [
            Math.min(acc[0], cur.properties?.deltaTime),
            Math.max(acc[1], cur.properties?.deltaTime),
          ],
          [Number.MAX_SAFE_INTEGER, 0]
        );
      const overlays = (state.sources
        ? clouds
          ? {
              sources: geoJSON(sources, {
                style: {
                  color: 'red',
                  weight: 5,
                  opacity: 0.65,
                },
              }),
              clouds,
            }
          : {
              sources: geoJSON(state.sources),
            }
        : undefined) as
        | undefined
        | { sources: FeatureGroup }
        | { sources: FeatureGroup; clouds: FeatureGroup };
      return m('.row', [
        m(
          'ul#slide-out.sidenav.sidenav-fixed',
          {
            style: `height: ${window.innerHeight - 30}px; 
                    width: 350px`,
            oncreate: ({ dom }) => {
              M.Sidenav.init(dom);
            },
          },
          [
            m(LayoutForm, {
              form,
              obj: source,
              onchange: (isValid) => {
                formChanged(source, isValid);
                // console.log(JSON.stringify(obj, null, 2));
              },
              context,
              section: 'source',
            }),
            m('.buttons', [
              m(Button, {
                label: 'Publish',
                iconName: 'send',
                disabled: !canPublish,
                class: `green col s12 ${state.canPublish ? '' : 'disabled'}`,
                onclick: async () => {
                  await onsubmit(actions, source);
                },
              }),
            ]),
            range &&
              clouds && [
                m(RangeInput, {
                  label: 'Delta time [s]',
                  value: 0,
                  min: 0,
                  max: range[1],
                  step: 1,
                  style: 'margin-top: 30px',
                  onchange: (v) => {
                    state.deltaTime = v;
                    const opacityCalc = (dt = 0) => {
                      const delta = Math.abs(dt - v);
                      return delta < 300
                        ? 0.4
                        : delta < 1000
                        ? 0.4 - (delta * 3.5) / 10000
                        : 0.05;
                    };
                    clouds.eachLayer((l) => {
                      const g = l as L.Polygon;
                      const opacity = opacityCalc(
                        g.feature?.properties?.deltaTime
                      );
                      g.setStyle({ opacity, fillOpacity: opacity });
                    });
                  },
                }),
                displayTime &&
                  m(TextInput, {
                    label: 'Cloud focus time',
                    initialValue: `${displayTime.toLocaleTimeString('NL')}`,
                    disabled: true,
                  }),
              ],
          ]
        ),
        m('.contentarea', [
          m(LeafletMap, {
            key: `key_${state.version}`,
            style: `position: absolute; top: 64px; height: ${
              window.innerHeight - 64
            }; left: ${window.innerWidth > 992 ? 350 : 0}px; width: ${
              window.innerWidth > 992 ? `${window.innerWidth - 350}px` : '100%'
            };`,
            view: state.sources
              ? [
                  state.sources.features[0].geometry.coordinates[1],
                  state.sources.features[0].geometry.coordinates[0],
                ]
              : [51.9, 4.48],
            zoom: state.zoom || 10,
            // mapOptions: { crs: crsRD },
            baseLayers,
            maxZoom: 20,
            overlays,
            visible: ['sources', 'clouds'],
            editable: ['sources'],
            onLoaded: (lmap) => {
              state.map = lmap;
              L.tileLayer
                .wms(
                  'http://geoservices.knmi.nl/cgi-bin/inspire/Actuele10mindataKNMIstations.cgi?allowTemporalUpdates=true&contextualWMSLegend=0&crs=EPSG:3857',
                  {
                    layers: 'ff_dd',
                    styles: 'windspeed_barb/barb',
                    transparent: true,
                  }
                )
                .addTo(lmap);
            },
            onMapClicked: (e) => {
              const { latlng } = e;
              if (latlng && source?.scenario) {
                state.sources = {
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      geometry: {
                        type: 'Point',
                        coordinates: [latlng.lng, latlng.lat, latlng.alt || 0],
                      },
                      properties: [],
                    } as Feature<Point>,
                  ],
                } as FeatureCollection<GeoJSON.Point>;
                state.version++;
                state.clouds = undefined;
                state.canPublish = true;
                m.redraw();
              }
            },
            showScale: { imperial: false },
            onLayerEdited: (fg: FeatureGroup<Point>) => {
              state.sources = fg.toGeoJSON() as FeatureCollection<Point>;
              state.version++;
              state.clouds = undefined;
              state.canPublish = true;
              m.redraw();
            },
            onZoomEnd: () => {
              state.zoom = state.map?.getZoom() || 10;
            },
            // onLoadedOverlaysChanged: (v: string[]) => (state.visible = v),
          }),
        ]),
      ]);
    },
  };
};
