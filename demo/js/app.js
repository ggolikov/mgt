import Mgt from '../../src/index.js';

const map = L.map('map').setView([55.755864, 37.617698], 12);
const urls = [
	'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
	'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
	'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
	'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
	'https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png',
	'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png',
];
const baseLayer = L.tileLayer(urls[0], {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

map.addLayer(baseLayer);

window.map = map;

var latlngs = [
	[37, -109.05],
	[41, -109.03],
	[41, -102.05],
	[37, -102.04],
];

var polygon = L.polygon(latlngs, { color: 'red' }).addTo(map);
const mgt = new Mgt();

mgt.greet();

console.log(mgt);
