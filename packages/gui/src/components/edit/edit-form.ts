import { Feature, FeatureCollection, Point } from 'geojson';
import { FeatureGroup, geoJSON, Map } from 'leaflet';
import M from 'materialize-css';
import m from 'mithril';
import { LeafletMap } from 'mithril-leaflet';
import { Button } from 'mithril-materialized';
import { LayoutForm } from 'mithril-ui-form';
import { IChemicalHazard } from '../../../../shared/src';
// import { capitalizeFirstLetter } from '../../utils';
// import { CircularSpinner } from '../ui/preloader';
import { chemicalHazardService } from '../../services/chemical-hazard-service';
import { formGenerator } from '../../template/form';

export const sourceKey = 'chemicalHazardKey';
export const zoomKey = 'zoom';

export const EditForm = () => {
  const state = {
    hazard: {} as Partial<IChemicalHazard>,
    map: undefined as undefined | Map,
    zoom: 15,
    loaded: false,
    isValid: false,
    error: '',
    /** Relevant context for the Form, can be used with show/disabling */
    context: {
      admin: true,
    },
    sources: undefined as undefined | FeatureCollection<Point>,
    clouds: undefined as undefined | FeatureGroup,
    canPublish: false,
    version: 0,
  };

  const onsubmit = async () => {
    // log('submitting...');
    const { hazard, sources } = state;
    if (hazard && hazard.scenario && sources) {
      state.clouds = undefined;
      state.canPublish = false;
      hazard.scenario.source_location =
        sources.features[0].geometry.coordinates;
      console.log(JSON.stringify(hazard, null, 2));
      window.localStorage.setItem(sourceKey, JSON.stringify(hazard));
      const res = await chemicalHazardService.publish(hazard);
      if (res) {
        console.log(res);
        state.version++;
        state.clouds = geoJSON(res);
        m.redraw();
      }
    }
  };

  const formChanged = (source: Partial<IChemicalHazard>, isValid: boolean) => {
    const { scenario } = source;
    state.canPublish = isValid;
    const { map } = state;
    if (isValid && map && scenario?.source_location) {
      map.flyTo({
        lat: scenario.source_location[1],
        lng: scenario.source_location[0],
      });
    }
    console.log(JSON.stringify(source, null, 2));
  };

  return {
    oninit: () => {
      const storedSource = window.localStorage.getItem(sourceKey);
      if (storedSource) {
        state.hazard = JSON.parse(storedSource);
      }
      const zoom = window.localStorage.getItem(zoomKey);
      if (zoom) {
        state.zoom = JSON.parse(zoom);
      }
    },
    view: () => {
      const { hazard: source, context, canPublish, zoom } = state;
      const form = formGenerator(source);
      // if (!loaded) {
      //   return m(CircularSpinner, { className: 'center-align', style: 'margin-top: 20%;' });
      // }
      const overlays = (state.sources
        ? state.clouds
          ? {
              sources: geoJSON(state.sources),
              clouds: state.clouds,
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
            style: `height: ${window.innerHeight - 30}px`,
            oncreate: ({ dom }) => {
              M.Sidenav.init(dom);
            },
          },
          [
            m(LayoutForm, {
              form,
              obj: source,
              onchange: (isValid, obj) => {
                formChanged(source, isValid);
                // console.log(JSON.stringify(obj, null, 2));
              },
              context,
            }),
            m('.buttons', [
              m(Button, {
                label: 'Publish',
                iconName: 'send',
                disabled: !canPublish,
                class: `green col s12 ${state.canPublish ? '' : 'disabled'}`,
                onclick: async () => {
                  await onsubmit();
                },
              }),
            ]),
          ]
        ),
        m('.contentarea', [
          m(LeafletMap, {
            key: `key_${state.version}`,
            style: `position: absolute; left: 300px; top: 64px; height: ${window.innerHeight -
              85}; width: ${window.innerWidth - 300}px;`,
            view: state.sources
              ? [
                  state.sources.features[0].geometry.coordinates[1],
                  state.sources.features[0].geometry.coordinates[0],
                ]
              : [51.9, 4.48],
            // zoom: zoom || 15,
            overlays,
            visible: ['sources', 'clouds'],
            editable: ['sources', 'clouds'],
            onLoaded: lmap => (state.map = lmap),
            onMapClicked: e => {
              const { latlng } = e;
              if (latlng && state.hazard?.scenario) {
                state.hazard.scenario.source_location = [
                  latlng.lng,
                  latlng.lat,
                  latlng.alt || 0,
                ];
                state.sources = {
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      geometry: {
                        type: 'Point',
                        coordinates: state.hazard.scenario.source_location,
                      },
                      properties: [],
                    } as Feature<Point>,
                  ],
                } as FeatureCollection<GeoJSON.Point>;
                state.canPublish = true;
                m.redraw();
              }
            },
            showScale: { imperial: false },
            onLayerEdited: (f: FeatureGroup) =>
              console.log(JSON.stringify(f.toGeoJSON(), null, 2)),
            // onLoadedOverlaysChanged: (v: string[]) => (state.visible = v),
          }),
        ]),
      ]);
    },
  };
};
