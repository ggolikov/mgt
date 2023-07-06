import * as turf from '@turf/turf';
export default class Mgt {
    static bufferSteps = 200;

    static distanceToPolygon({ point, polygon }) {
        if (polygon.type === "Feature") { polygon = polygon.geometry }
        let distance;
        if (polygon.type === "MultiPolygon") {
            distance = polygon.coordinates
                .map(coords => distanceToPolygon({ point, polygon: turf.polygon(coords).geometry }))
                .reduce((smallest, current) => (current < smallest ? current : smallest));
        } else {
            if (polygon.coordinates.length > 1) {
                const [exteriorDistance, ...interiorDistances] = polygon.coordinates.map(coords =>
                    distanceToPolygon({ point, polygon: turf.polygon([coords]).geometry })
                );
                if (exteriorDistance < 0) {
                    const smallestInteriorDistance = interiorDistances.reduce(
                        (smallest, current) => (current < smallest ? current : smallest)
                    );
                    if (smallestInteriorDistance < 0) {
                        distance = smallestInteriorDistance * -1;
                    } else {
                        distance = smallestInteriorDistance < exteriorDistance * -1
                            ? smallestInteriorDistance * -1
                            : exteriorDistance;
                    }
                } else {
                    distance = exteriorDistance;
                }
            } else {
                // The actual distance operation - on a normal, hole-less polygon (converted to meters)
                distance = turf.pointToLineDistance(point, turf.polygonToLineString(polygon));
                if (turf.booleanPointInPolygon(point, polygon)) {
                    distance = distance * -1;
                }
            }
        }
        return distance
    }

    getBufferAtPoint(latLng, geoJson) {
        const point = turf.point([latLng.lng, latLng.lat]);
        const distance = Mgt.distanceToPolygon({ point, polygon: geoJson });

        return turf.buffer(geoJson, distance, {steps: Mgt.bufferSteps});
    }
}