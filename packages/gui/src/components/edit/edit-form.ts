import { FeatureGroup, LatLngExpression, Map } from 'leaflet';
import M from 'materialize-css';
import m from 'mithril';
import { LeafletMap } from 'mithril-leaflet';
import { Button } from 'mithril-materialized';
import { LayoutForm } from 'mithril-ui-form';
import { IChemicalHazard } from '../../../../shared/src';
import { chemicalHazardService } from '../../services/chemical-hazard-service';
import { formGenerator } from '../../template/form';
// import { capitalizeFirstLetter } from '../../utils';
// import { CircularSpinner } from '../ui/preloader';

export const sourceKey = 'chemicalHazardKey';
export const zoomKey = 'zoom';

export const EditForm = () => {
  const state = {
    source: {} as Partial<IChemicalHazard>,
    map: undefined as undefined | Map,
    zoom: 15,
    loaded: false,
    isValid: false,
    error: '',
    /** Relevant context for the Form, can be used with show/disabling */
    context: {
      admin: true,
    },
    canPublish: false,
  };

  const onsubmit = async () => {
    // log('submitting...');
    state.canPublish = false;
    const { source } = state;
    if (source) {
      window.localStorage.setItem(sourceKey, JSON.stringify(source));
      await chemicalHazardService.publish(source);
    }
  };

  const formChanged = (
    source: Partial<IChemicalHazard>,
    isValid: boolean
  ) => {
    const { lat = 0, lon = 0 } = source;
    isValid = isValid && -90 <= lat && lat <= 90 && -180 <= lon && lon <= 180;
    state.canPublish = isValid;
    const { map } = state;
    if (isValid && map) {
      map.flyTo({lat, lng: lon });
    }
    console.log(JSON.stringify(source, null, 2));
  };

  return {
    oninit: () => {
      const storedSource = window.localStorage.getItem(sourceKey);
      if (storedSource) { state.source = JSON.parse(storedSource); }
      const zoom = window.localStorage.getItem(zoomKey);
      if (zoom) { state.zoom = JSON.parse(zoom); }
    },
    view: () => {
      const { source, context, canPublish, zoom } = state;
      const form = formGenerator(source);
      // if (!loaded) {
      //   return m(CircularSpinner, { className: 'center-align', style: 'margin-top: 20%;' });
      // }

      return m('.row', [
        m(
          'ul#slide-out.sidenav.sidenav-fixed',
          {
            oncreate: ({ dom }) => {
              M.Sidenav.init(dom);
            },
          },
          [
            m(LayoutForm, {
              form,
              obj: source,
              onchange: isValid => formChanged(source, isValid),
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
            key: `key_${source.lat}_${source.lon}`,
            style: `position: absolute; left: 300px; top: 64px; height: ${window.innerHeight -
              64}; width: ${window.innerWidth - 300}px;`,
            view: [
              source.lat || 52.11,
              source.lon || 4.33,
            ] as LatLngExpression,
            zoom: zoom || 13,
            // overlays,
            // visible,
            editable: ['test', 'pois'],
            onLoaded: lmap => state.map = lmap,
            onMapClicked: e => {
              const { latlng } = e;
              if (latlng) {
                state.source.lat = latlng.lat;
                state.source.lon = latlng.lng;
                state.zoom = state.map ? state.map.getZoom() : 15;
                window.localStorage.setItem(zoomKey, JSON.stringify(state.zoom));
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
