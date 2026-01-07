import type { RingName, ComparePoint } from './types';
import { useAppStore } from './store';
import { getStrokeColor, BASE_STYLE } from './styles';

declare const L: any;

export function drawBufferFromRing(
  ringName: RingName,
  e: { latlng: { lat: number; lng: number } },
): void {
  const store = useAppStore.getState();
  const ringFeature = store.rings[ringName].feature;
  if (!ringFeature || !store.mgt || !store.map) {
    return;
  }

  const json = store.mgt.getBufferAtPoint(e.latlng, ringFeature);

  if (store.rings[ringName].layer) {
    store.removeRingLayer(ringName);
  }

  const layer = L.geoJson(json, {
    style: () => ({
      ...BASE_STYLE,
      color: getStrokeColor(ringName),
      dashArray: '10',
    }),
  });

  store.setRingLayer(ringName, layer);
  layer.addTo(store.map);
}

export function drawComparePoint(
  type: ComparePoint,
  e: { latlng: { lat: number; lng: number } },
): void {
  const store = useAppStore.getState();
  const existingLayer = store.comparePoints[type].layer;

  if (existingLayer || !store.map) {
    return;
  }

  const layer = L.marker([e.latlng.lat, e.latlng.lng]).addTo(store.map);
  store.setComparePointLayer(type, layer);
}