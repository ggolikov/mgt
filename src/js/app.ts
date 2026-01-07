import type { FeatureCollection, Feature } from 'geojson';
import Mgt from './mgt';
import rings from './data/rings.json';

declare const L: any;

type RingsGeoJson = typeof rings;

type RingName =
  | 'Red Square'
  | 'Kremlin'
  | 'Boulevard Ring'
  | 'Garden Ring'
  | 'Third Transport Ring'
  | 'MKAD';

interface RingStateItem {
  feature: Feature | undefined;
  layer: any | null;
}

type RingsState = Record<RingName, RingStateItem>;

const mgt = new Mgt();

const ringNames: RingName[] = [
  'Red Square',
  'Kremlin',
  'Boulevard Ring',
  'Garden Ring',
  'Third Transport Ring',
  'MKAD',
];

const state: { rings: RingsState } = {
  rings: ringNames.reduce((prev, cur) => {
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
  }, {} as RingsState),
};

function getStrokeColor(ringName: RingName): string {
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

const baseStyle = {
  weight: 3,
  opacity: 1,
  fillOpacity: 0,
};

const mapOptions = {
  contextmenu: true,
  contextmenuWidth: 200,
  contextmenuItems: [
    {
      text: 'Очистить',
      callback: clearLayers,
    },
    {
      text: 'Буфер от Красной площади',
      callback: drawBufferFromRing.bind(null, 'Red Square' as RingName),
    },
    {
      text: 'Буфер от Кремля',
      callback: drawBufferFromRing.bind(null, 'Kremlin' as RingName),
    },
    {
      text: 'Буфер от Бульварного кольца',
      callback: drawBufferFromRing.bind(null, 'Boulevard Ring' as RingName),
    },
    {
      text: 'Буфер от Садового кольца',
      callback: drawBufferFromRing.bind(null, 'Garden Ring' as RingName),
    },
    {
      text: 'Буфер от ТТК',
      callback: drawBufferFromRing.bind(
        null,
        'Third Transport Ring' as RingName,
      ),
    },
    {
      text: 'Буфер от МКАД',
      callback: drawBufferFromRing.bind(null, 'MKAD' as RingName),
    },
  ],
};

const map = L.map('map', mapOptions).setView([55.755864, 37.617698], 12);

const urls: string[] = [
  'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
  'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
  'https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png',
  'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png',
];

const baseLayer = L.tileLayer(urls[1], {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

function clearLayers(): void {
  (Object.keys(state.rings) as RingName[]).forEach((ringName) => {
    const obj = state.rings[ringName];

    if (obj.layer) {
      map.removeLayer(obj.layer);
      obj.layer = null;
    }
  });

  // eslint-disable-next-line no-console
  console.log(map._layers);
}

function drawBufferFromRing(
  ringName: RingName,
  e: { latlng: { lat: number; lng: number } },
): void {
  const ringFeature = state.rings[ringName].feature;
  if (!ringFeature) {
    return;
  }

  const json = mgt.getBufferAtPoint(e.latlng, ringFeature);

  if (state.rings[ringName].layer) {
    map.removeLayer(state.rings[ringName].layer);
  }

  const layer = L.geoJson(json, {
    style: () => ({
      ...baseStyle,
      color: getStrokeColor(ringName),
      dashArray: '10',
    }),
  });

  state.rings[ringName].layer = layer;

  layer.addTo(map);
}

L.geoJson(rings as RingsGeoJson, {
  style: (feature: any) => ({
    ...baseStyle,
    color: getStrokeColor(feature.properties.name as RingName),
  }),
}).addTo(map);

map.addLayer(baseLayer);

(window as any).map = map;
(window as any).mgt = mgt;

// eslint-disable-next-line no-console
console.log(mgt);


