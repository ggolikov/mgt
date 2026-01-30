import { create } from 'zustand';
import type { FeatureCollection } from 'geojson';
import type { RingName, ComparePoint, RingsState, ComparePointsState, CompareCirclesState, Layer, CrossLinesState } from './types';
import rings from './data/rings.json';
import { RING_NAMES } from './constants';
import Mgt from '../mgt';

interface AppState {
  rings: RingsState;
  comparePoints: ComparePointsState;
  compareCircles: CompareCirclesState;
  reflectionPoint: Layer;
  crossLines: CrossLinesState;
  centerLine: Layer;
  pointsLine: Layer;
  map: any | null;
  mgt: Mgt | null;
  
  // Actions
  setMap: (map: any) => void;
  setMgt: (mgt: any) => void;
  setRingLayer: (ringName: RingName, layer: any) => void;
  removeRingLayer: (ringName: RingName) => void;
  setComparePointLayer: (type: ComparePoint, layer: any) => void;
  removeComparePointLayer: (type: ComparePoint) => void;
  setCompareCirclesData: (layers: any) => void;
  setReflectionPoint: (layer: any) => void;
  setCrossLines: (layers: any) => void;
  setCenterLine: (layer: any) => void;
  removeCenterLine: () => void;
  setPointsLine: (layer: any) => void;
  removePointsLine: () => void;
  clearAllLayers: () => void;
}

const initialRingsState: RingsState = RING_NAMES.reduce((prev, cur) => {
  const feature = (rings as FeatureCollection).features?.find(
    (f) => f.properties && f.properties.name === cur,
  );

  return {
    ...prev,
    [cur]: {
      feature,
      layer: null,
    },
  };
}, {} as RingsState);

const initialComparePointsState: ComparePointsState = {
  from: { layer: null },
  to: { layer: null },
};

const initialCompareCirclesState: CompareCirclesState = {
  straight: { layer: null },
  reverse: { layer: null },
  middleLine: { layer: null },
};

const initialReflectionPointState: Layer = {
  layer: null,
}

const initialCrossLinesState: CrossLinesState = {
  parallel: { layer: null },
  meridian: { layer: null },
}

const initialCenterLineState: Layer = {
  layer: null,
}

const initialPointsLineState: Layer = {
  layer: null,
}

export const useAppStore = create<AppState>((set, get) => ({
  rings: initialRingsState,
  comparePoints: initialComparePointsState,
  compareCircles: initialCompareCirclesState,
  reflectionPoint: initialReflectionPointState,
  crossLines: initialCrossLinesState,
  centerLine: initialCenterLineState,
  pointsLine: initialPointsLineState,
  map: null,
  mgt: null,

  setMap: (map) => set({ map }),
  setMgt: (mgt) => set({ mgt }),

  setRingLayer: (ringName, layer) =>
    set((state) => ({
      rings: {
        ...state.rings,
        [ringName]: {
          ...state.rings[ringName],
          layer,
        },
      },
    })),

  removeRingLayer: (ringName) => {
    const state = get();
    const layer = state.rings[ringName].layer;
    if (layer && state.map) {
      state.map.removeLayer(layer);
    }
    set((state) => ({
      rings: {
        ...state.rings,
        [ringName]: {
          ...state.rings[ringName],
          layer: null,
        },
      },
    }));
  },

  setComparePointLayer: (type, layer) =>
    set((state) => ({
      comparePoints: {
        ...state.comparePoints,
        [type]: { layer },
      },
    })),
  
  setCompareCirclesData: (layers) => 
    set((state) => ({
      compareCircles: {
        ...state.compareCircles,
        ...layers,
        }
      })),

  removeComparePointLayer: (type) => {
    const state = get();
    const layer = state.comparePoints[type].layer;
    if (layer && state.map) {
      state.map.removeLayer(layer);
    }
    set((state) => ({
      comparePoints: {
        ...state.comparePoints,
        [type]: { layer: null },
      },
    }));
  },

  setReflectionPoint: (layer) => 
    set((state) => ({
      reflectionPoint: {
        ...state.reflectionPoint,
        ...layer,
        }
    })),
  
  
  setCenterLine: (layer) => 
    set((state) => ({
      centerLine: {
        ...state.centerLine,
        ...layer,
        }
    })),
  
  removeCenterLine: () => {
    const state = get();
    if (state.centerLine.layer) {
      state.map.removeLayer(state.centerLine.layer);
    }
    set((state) => ({
      centerLine: initialCenterLineState,
    }));
  },

  setPointsLine: (layer) => 
    set((state) => ({
      pointsLine: {
        ...state.pointsLine,
        ...layer,
        }
    })),
  
  removePointsLine: () => {
    const state = get();
    if (state.pointsLine.layer) {
      state.map.removeLayer(state.pointsLine.layer);
    }
    set((state) => ({
      pointsLine: initialPointsLineState,
    }));
  },

  setCrossLines: (layers) => 
      set((state) => ({
        crossLines: {
          ...state.crossLines,
          ...layers,
          }
        })),

  clearAllLayers: () => {
    const state = get();
    RING_NAMES.forEach((ringName) => {
      const layer = state.rings[ringName].layer;
      if (layer && state.map) {
        state.map.removeLayer(layer);
      }
    });

    if (state.comparePoints.from.layer) {
      state.map.removeLayer(state.comparePoints.from.layer);
    }
    if (state.comparePoints.to.layer) {
      state.map.removeLayer(state.comparePoints.to.layer);
    }
    if (state.compareCircles.straight.layer) {
      state.map.removeLayer(state.compareCircles.straight.layer);
    }
    if (state.compareCircles.reverse.layer) {
      state.map.removeLayer(state.compareCircles.reverse.layer);
    }
    if (state.compareCircles.middleLine.layer) {
      state.map.removeLayer(state.compareCircles.middleLine.layer);
    }
    if (state.reflectionPoint.layer) {
      state.map.removeLayer(state.reflectionPoint.layer);
    }
    if (state.centerLine.layer) {
      state.map.removeLayer(state.centerLine.layer);
    }
    if (state.pointsLine.layer) {
      state.map.removeLayer(state.pointsLine.layer);
    }
    if (state.crossLines.parallel.layer) {
      state.map.removeLayer(state.crossLines.parallel.layer);
    }
    if (state.crossLines.meridian.layer) {
      state.map.removeLayer(state.crossLines.meridian.layer);
    }

    set((state) => ({
      rings: RING_NAMES.reduce(
        (acc, ringName) => ({
          ...acc,
          [ringName]: { ...state.rings[ringName], layer: null },
        }),
        {} as RingsState,
      ),
      comparePoints: initialComparePointsState,
      compareCircles: initialCompareCirclesState,
      reflectionPoint: initialReflectionPointState,
      crossLines: initialCrossLinesState,
      centerLine: initialCenterLineState,
    }));
  },
}));