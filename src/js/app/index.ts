import rings from './data/rings.json';
import { atd } from './data/atd';
import { useAppStore } from './store';
import { MAP_CENTER, MAP_ZOOM, TILE_URLS } from './constants';
import { BASE_STYLE, getStrokeColor } from './styles';
import { createMapOptions } from './mapConfig';
import Mgt from '../mgt';

declare const L: any;

// Initialize MGT instance
const mgt = Mgt;

// Initialize store with map and mgt instances
const map = L.map('map', createMapOptions()).setView(MAP_CENTER, MAP_ZOOM);

const baseLayer = L.tileLayer(TILE_URLS[1], {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

// Set map and mgt in store
useAppStore.getState().setMap(map);
useAppStore.getState().setMgt(Mgt);


L.geoJson(atd, {
  style: (feature: any) => ({
    ...BASE_STYLE,
    // сolor: '#FF0000',
    strokeColor: '#FF0000',
    opacity: 0.33,
    weight: 4,
    // dashArray: '10',
    // dashOffset: '10',
    // fillRule: 'evenodd',
  }),
}).addTo(map);

L.geoJson(rings, {
  style: (feature: any) => ({
    ...BASE_STYLE,
    color: getStrokeColor(feature.properties.name),
  }),
}).addTo(map);

map.addLayer(baseLayer);

// Expose to window for debugging
(window as any).map = map;
(window as any).mgt = mgt;
(window as any).store = useAppStore;

// eslint-disable-next-line no-console
console.log(mgt);