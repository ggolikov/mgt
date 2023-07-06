import { feature } from '@turf/turf';
import Mgt from '../../src/index.js';
import rings from './data/rings.json';
const mgt = new Mgt();

const ringNames = ["Red Square", "Kremlin", "Boulevard Ring", "Garden Ring", "Third Transport Ring", "MKAD"];

const state = {
	rings: ringNames.reduce((prev, cur) => ({
		...prev,
		[cur]: {
			feature: rings.features.find(f => f.properties.name === cur),
			layer: null,
		}
	}), {})
};

function getStrokeColor(ringName) {
switch (ringName) {
	case "Red Square":
		return '#FF0000';
	case "Kremlin":
		return '#FFC300';
	case "Boulevard Ring":
		return '#FFFF00';
	case "Garden Ring":
		return '#13FF04';
	case "Third Transport Ring":
		return '#00B97B';
	case "MKAD":
		return '#0346F8';
	default:
		break;
}}

const baseStyle = {
	weight: 3,
	opacity: 1,
	fillOpacity: 0
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
			callback: drawBufferFromRing.bind(null, 'Red Square'),
		},
		{
			text: 'Буфер от Кремля',
			callback: drawBufferFromRing.bind(null, 'Kremlin'),
		},
		{
			text: 'Буфер от Бульварного кольца',
			callback: drawBufferFromRing.bind(null, 'Boulevard Ring'),
		},
		{
			text: 'Буфер от Садового кольца',
			callback: drawBufferFromRing.bind(null, 'Garden Ring'),
		},
		{
			text: 'Буфер от ТТК',
			callback: drawBufferFromRing.bind(null, 'Third Transport Ring'),
		},
		{
			text: 'Буфер от МКАД',
			callback: drawBufferFromRing.bind(null, 'MKAD'),
		},
	],
};

const map = L.map('map', mapOptions).setView([55.755864, 37.617698], 12);
const urls = [
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
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

function clearLayers() {
	Object.keys(state.rings).forEach((ringName) => {
		const obj = state.rings[ringName];

		if (obj.layer) {
			map.removeLayer(obj.layer);
			obj.layer = null;
		} 
	})

	console.log(map._layers);
}

function drawBufferFromRing(ringName, e) {
	const json = mgt.getBufferAtPoint(e.latlng, state.rings[ringName].feature);
	
	if (state.rings[ringName].layer) {
		map.removeLayer(state.rings[ringName].layer);
	}

	const layer = L.geoJson(json, {
		style: function () {
			return {
				...baseStyle, color: getStrokeColor(ringName),  dashArray: '10', }
		}
	});

	state.rings[ringName].layer = layer;
	
	layer.addTo(map);
}

// L.geoJson(atd).addTo(map);
L.geoJson(rings, {
	style: function (feature) {
		return { ...baseStyle, color: getStrokeColor(feature.properties.name) }
	}
}).addTo(map);

map.addLayer(baseLayer);

window.map = map;
window.mgt = mgt;

console.log(mgt);
