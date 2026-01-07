import rings from './data/rings.json';
import { useAppStore } from './store';
import { MAP_CENTER, MAP_ZOOM, TILE_URLS } from './constants';
import { BASE_STYLE, getStrokeColor } from './styles';
import { createMapOptions } from './mapConfig';
import type { RingsGeoJson } from './types';
import Mgt from '../mgt';

declare const L: any;

// Initialize MGT instance
const mgt = new Mgt();

// Initialize store with map and mgt instances
const map = L.map('map', createMapOptions()).setView(MAP_CENTER, MAP_ZOOM);

const baseLayer = L.tileLayer(TILE_URLS[1], {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

// Set map and mgt in store
useAppStore.getState().setMap(map);
useAppStore.getState().setMgt(mgt);

// Add rings to map
L.geoJson(rings as RingsGeoJson, {
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