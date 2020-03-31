import { Feature, FeatureCollection, Point } from 'geojson';
import L, { FeatureGroup, geoJSON, Map } from 'leaflet';
import m, { FactoryComponent } from 'mithril';
import { LeafletMap } from 'mithril-leaflet';
import { Button } from 'mithril-materialized';
import { LayoutForm } from 'mithril-ui-form';
import { IChemicalHazard } from '../../../../shared/src';
import { chemicalHazardService } from '../../services/chemical-hazard-service';
import { appStateMgmt, IActions, IAppModel } from '../../services/meiosis';
import { formGenerator } from '../../template/form';

export const zoomKey = 'zoom';

export const EditForm: FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}> = () => {
  const state = {
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
      const zoom = window.localStorage.getItem(zoomKey);
      if (zoom) {
        state.zoom = JSON.parse(zoom);
      }
    },
    view: ({ attrs: { state: appState, actions } }) => {
      if (!appStateMgmt) {
        return;
      }
      const { app: source } = appState;
      const { context, canPublish } = state;
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
              onchange: isValid => {
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
          ]
        ),
        m('.contentarea', [
          m(LeafletMap, {
            key: `key_${state.version}`,
            style: `position: absolute; top: 64px; height: ${window.innerHeight -
              64}; left: ${window.innerWidth > 992 ? 300 : 0}px; width: ${
              window.innerWidth > 992 ? `${window.innerWidth - 300}px` : '100%'
            };`,
            view: state.sources
              ? [
                  state.sources.features[0].geometry.coordinates[1],
                  state.sources.features[0].geometry.coordinates[0],
                ]
              : [51.9, 4.48],
            // zoom: zoom || 15,
            overlays,
            visible: ['sources', 'clouds'],
            editable: ['sources'],
            onLoaded: lmap => {
              state.map = lmap;
              // http://geoservices.knmi.nl/cgi-bin/inspire/Actuele10mindataKNMIstations.cgi
              L.tileLayer
                .wms(
                  'http://geoservices.knmi.nl/cgi-bin/inspire/Actuele10mindataKNMIstations.cgi',
                  {
                    layers: 'ff_dd',
                    styles: 'windspeed_barb/barb',
                    transparent: true,
                  }
                  // { layers: 'windspeed_vector/barb' }
                )
                .addTo(lmap);
            },
            onMapClicked: e => {
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
            // onLoadedOverlaysChanged: (v: string[]) => (state.visible = v),
          }),
        ]),
      ]);
    },
  };
};
