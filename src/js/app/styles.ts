import type { RingName } from './types';

export const BASE_STYLE = {
  weight: 3,
  opacity: 1,
  fillOpacity: 0,
} as const;

export function getStrokeColor(ringName: RingName): string {
  switch (ringName) {
    case 'Red Square':
      return '#FF0000';
    case 'Kremlin':
      return '#FFC300';
    case 'Boulevard Ring':
      return '#FFFF00';
    case 'Garden Ring':
      return '#13FF04';
    case 'Third Transport Ring':
      return '#00B97B';
    case 'MKAD':
      return '#0346F8';
    default:
      return '#000000';
  }
}