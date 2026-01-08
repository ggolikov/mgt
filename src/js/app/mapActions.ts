import type { RingName, ComparePoint } from './types';
import { useAppStore } from './store';
import { getStrokeColor, BASE_STYLE, CIRCLE_COLOR } from './styles';
import { LatLngLike } from '../mgt';
import { MOSCOW_CENTER } from './constants';

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

    if (!store.map) {
        return;
    }

    if (existingLayer) {
        store.map.removeLayer(existingLayer);
    }

    const layer = L.marker([e.latlng.lat, e.latlng.lng]).addTo(store.map);
    store.setComparePointLayer(type, layer);
    
    let from: LatLngLike | null = null;
    let to: LatLngLike | null = null;

    if (type === 'from') {
        from = e.latlng;
        to = store.comparePoints['to'].layer?.getLatLng();
    } else {
        from = store.comparePoints['from'].layer?.getLatLng();
        to = e.latlng;
    }

    if (from && to) {
        const features = store.mgt.getTwoPointsCircles(from, to);

        const layers = {
            straight: {
                layer: L.geoJson(features[0], {
                    style: () => ({
                        ...BASE_STYLE,
                        color: CIRCLE_COLOR,
                        dashArray: '10',
                    }),
                }),
            },
            reverse: {
                layer: L.geoJson(features[1], {
                    style: () => ({
                        ...BASE_STYLE,
                        color: CIRCLE_COLOR,
                        dashArray: '10',
                    }),
                }),
            }
        };

        layers.straight.layer.addTo(store.map);
        layers.reverse.layer.addTo(store.map);

        store.setCompareCirclesData(layers);
    }
}

export function drawReflectionPoint(e: { latlng: { lat: number; lng: number } }): void {
    const store = useAppStore.getState();

    const reflectionPoint = store.mgt.getReflectionPoint(e.latlng, L.latLng(MOSCOW_CENTER));
    
    const layer = L.marker([reflectionPoint.lat, reflectionPoint.lng]).addTo(store.map);

    store.setReflectionPoint(layer);
}