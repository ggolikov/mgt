import type { Feature } from 'geojson';

export type RingName =
  | 'Red Square'
  | 'Kremlin'
  | 'Boulevard Ring'
  | 'Garden Ring'
  | 'Third Transport Ring'
  | 'MKAD';

export type ComparePoint = 'from' | 'to';

export interface RingStateItem {
  feature: Feature | undefined;
  layer: any | null;
}

export type Layer = {
  layer: any | null;
}

export type RingsState = Record<RingName, RingStateItem>;
export type ComparePointsState = Record<ComparePoint, Layer>;
export type CompareCirclesState = {
  straight: Layer;
  reverse: Layer;
  middleLine: Layer;
};
