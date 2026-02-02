import type { RingName, ComparePoint } from './types';
import { useAppStore } from './store';
import { getStrokeColor, BASE_STYLE, CIRCLE_COLOR } from './styles';
import Mgt, { LatLngLike } from '../mgt';
import { MOSCOW_CENTER } from './constants';
import rings from './data/rings.json';

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

  const json = Mgt.getBufferAtPoint(e.latlng, ringFeature);

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
    
    if (!store.map) {
        return;
    }

    const existingLayer = store.comparePoints[type].layer;

    if (existingLayer) {
        store.map.removeLayer(existingLayer);
    }

    const layer = L.marker([e.latlng.lat, e.latlng.lng]).addTo(store.map);
    store.setComparePointLayer(type, layer);
}

export function drawPointsComparison() {
    const store = useAppStore.getState();
    let from: LatLngLike | null = store.comparePoints['from'].layer?.getLatLng();
    let to: LatLngLike | null = store.comparePoints['to'].layer?.getLatLng();

    if (from && to) {
        const features = Mgt.getTwoPointsCircles(from, to);

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
            },
            middleLine: {
                layer: L.geoJson(features[2], {
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
        layers.middleLine.layer.addTo(store.map);
        
        store.setCompareCirclesData(layers);
    }
}

export function drawReflectionPoint(e: { latlng: { lat: number; lng: number } }): void {
    const store = useAppStore.getState();

    const reflectionPoint = Mgt.getReflectionPoint(e.latlng, L.latLng(MOSCOW_CENTER));
    
    const layer = L.marker([reflectionPoint.lat, reflectionPoint.lng]).addTo(store.map);

    store.setReflectionPoint(layer);
}

export function drawCrossLines(e: { latlng: { lat: number; lng: number } }): void {
    const store = useAppStore.getState();

    const parallelLayer = store.crossLines.parallel.layer;

    if (parallelLayer) {
        store.map.removeLayer(parallelLayer);
    }

    const meridianLayer = store.crossLines.meridian.layer;

    if (meridianLayer) {
        store.map.removeLayer(meridianLayer);
    }

    const mkad = (rings as FeatureCollection).features?.find(
        (f) => f.properties && f.properties.name === 'MKAD',
      );
    const crossLines = Mgt.clipFeatures(Mgt.getCrossLines(e.latlng), mkad);
    
    const layers = {
        parallel: {
            layer: L.geoJson(crossLines[0], {
                style: () => ({
                    ...BASE_STYLE,
                    color: CIRCLE_COLOR,
                    dashArray: '10',
                }),
            }),
        },
        meridian: {
            layer: L.geoJson(crossLines[1], {
                style: () => ({
                    ...BASE_STYLE,
                    color: CIRCLE_COLOR,
                    dashArray: '10',
                }),
            }),
        }
    };

    layers.parallel.layer.addTo(store.map);
    layers.meridian.layer.addTo(store.map);

    store.setCrossLines(layers);
}

export function drawCenterLine(e: { latlng: { lat: number; lng: number } }): void {
    const store = useAppStore.getState();


  if (store.centerLine.layer) {
    store.removeCenterLine();
  }


    const mkad = (rings as FeatureCollection).features?.find(
        (f) => f.properties && f.properties.name === 'MKAD',
    );
    
    const centerLatLng = L.latLng(MOSCOW_CENTER);

    const centerLine = Mgt.clipFeatures([Mgt.getLineBetweenPoints(e.latlng, centerLatLng)], mkad)[0];

    const layer = L.geoJson(centerLine, {
        style: () => ({
            ...BASE_STYLE,
            color: CIRCLE_COLOR,
            dashArray: '10',
        }),
    });
    store.setCenterLine({ layer });
    layer.addTo(store.map);
}


export function drawPointsLine(): void {
    const store = useAppStore.getState();

    store.removePointsLine();

    if (store.comparePoints.from.layer && store.comparePoints.to.layer) {
      const fromLatLng = store.comparePoints.from.layer.getLatLng();
        const toLatLng = store.comparePoints.to.layer.getLatLng();
        

    const mkad = (rings as FeatureCollection).features?.find(
        (f) => f.properties && f.properties.name === 'MKAD',
    );
    
    const pointsLine = Mgt.clipFeatures([Mgt.getLineBetweenPoints(fromLatLng, toLatLng)], mkad)[0];


    const layer = L.geoJson(pointsLine, {
        style: () => ({
          ...BASE_STYLE,
          color: CIRCLE_COLOR,
          dashArray: '10',
        }),
      });
    
     store.setPointsLine({ layer });
    layer.addTo(store.map);
    }
}
  
export function drawAzimuths(azimuthsArray: number[]): void {
    const store = useAppStore.getState();

    const azimuths = Mgt.getAzimuths(azimuthsArray);

    const layers = {
        azimuths: {
            layer: L.geoJson(azimuths, {
                style: () => ({
                    ...BASE_STYLE,
                    color: CIRCLE_COLOR,
                    dashArray: '10',
                }),
            }),
        }
    };

    layers.azimuths.layer.addTo(store.map);
    store.setAzimuths(layers);
}