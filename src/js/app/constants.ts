import type { RingName } from './types';

export const RING_NAMES: RingName[] = [
  'Red Square',
  'Kremlin',
  'Boulevard Ring',
  'Garden Ring',
  'Third Transport Ring',
  'MKAD',
];

export const MAP_CENTER: [number, number] = [55.755864, 37.617698];
export const MAP_ZOOM = 12;

export const TILE_URLS: string[] = [
  'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
  'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
  'https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png',
  'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png',
];