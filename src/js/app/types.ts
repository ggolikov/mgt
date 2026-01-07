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

export interface ComparePointsStateItem {
  layer: any | null;
}

export type RingsState = Record<RingName, RingStateItem>;
export type ComparePointsState = Record<ComparePoint, ComparePointsStateItem>;
export type CompareCirclesState = {
  straight: {
    layer: any | null;
  };
  reverse: {
    layer: any | null;
  };
  middleLine: {
    layer: any | null;
  }
};
