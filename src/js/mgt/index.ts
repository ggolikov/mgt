import * as turf from '@turf/turf';
import type { Feature, MultiPolygon, Polygon } from 'geojson';

type PolygonGeometry = Polygon | MultiPolygon;
type PolygonFeature = Feature<PolygonGeometry>;
type PolygonLike = PolygonGeometry | PolygonFeature;

type PointFeature = turf.Feature<turf.Point>;

export interface LatLngLike {
  lat: number;
  lng: number;
}

export default class Mgt {
  static bufferSteps = 200;

  public static distanceToPolygon({
    point,
    polygon,
  }: {
    point: PointFeature;
    polygon: PolygonLike;
  }): number {
    // Normalize to geometry
    let geom: PolygonGeometry;

    if (polygon.type === 'Feature') {
      geom = (polygon as PolygonFeature).geometry;
    } else {
      geom = polygon as PolygonGeometry;
    }

    let distance: number;

    if (geom.type === 'MultiPolygon') {
      distance = geom.coordinates
        .map((coords) =>
          Mgt.distanceToPolygon({
            point,
            polygon: turf.polygon(coords).geometry,
          }),
        )
        .reduce((smallest, current) =>
          current < smallest ? current : smallest,
        );
    } else {
      // Polygon, possibly with holes
      if (geom.coordinates.length > 1) {
        const [exteriorDistance, ...interiorDistances] = geom.coordinates.map(
          (coords) =>
            Mgt.distanceToPolygon({
              point,
              polygon: turf.polygon([coords]).geometry,
            }),
        );

        if (exteriorDistance < 0) {
          const smallestInteriorDistance = interiorDistances.reduce(
            (smallest, current) =>
              current < smallest ? current : smallest,
          );

          if (smallestInteriorDistance < 0) {
            distance = smallestInteriorDistance * -1;
          } else {
            distance =
              smallestInteriorDistance < exteriorDistance * -1
                ? smallestInteriorDistance * -1
                : exteriorDistance;
          }
        } else {
          distance = exteriorDistance;
        }
      } else {
        // The actual distance operation - on a normal, hole-less polygon (converted to meters)
        distance = turf.pointToLineDistance(
            point,
          // @ts-ignore  
          turf.polygonToLineString(geom),
        );

        if (turf.booleanPointInPolygon(point, geom as PolygonGeometry)) {
          distance = distance * -1;
        }
      }
    }

    return distance;
  }

  public static getBufferAtPoint(latLng: LatLngLike, geoJson: PolygonLike): turf.Feature {
    const point = turf.point([latLng.lng, latLng.lat]) as PointFeature;
    const distance = Mgt.distanceToPolygon({ point, polygon: geoJson });

    return turf.buffer(geoJson as any, distance, {
      steps: Mgt.bufferSteps,
    });
  }

  public static getTwoPointsCircles(from: LatLngLike, to: LatLngLike): turf.Feature[] {
    const fromPoint = turf.point([from.lng, from.lat]) as PointFeature;
    const toPoint = turf.point([to.lng, to.lat]) as PointFeature;

    const distance = turf.distance(fromPoint, toPoint, { units: 'meters' });

    const straight = turf.circle(fromPoint, distance, { units: 'meters' });
    const reverse = turf.circle(toPoint, distance, { units: 'meters' });

    const intersection = turf.lineIntersect(straight, reverse);

    const middleLine = turf.lineString(intersection.features.map(f => f.geometry.coordinates));
    
    console.log(middleLine);
    

    // TODO: Draw middle line
    // const intersection = turf.

    return [straight, reverse, middleLine];
  }

  public static getReflectionPoint(latLng: LatLngLike, origin: LatLngLike): LatLngLike {
    const symmetricalLng = 2 * origin.lng - latLng.lng;
    const symmetricalLat = 2 * origin.lat - latLng.lat;

    return {
      lat: symmetricalLat,
      lng: symmetricalLng,
    }
  }

  public static getCrossLines(latLng: LatLngLike): turf.Feature[] {

    const horizontalLine = turf.lineString([
      [-180, latLng.lat],
      [180, latLng.lat],
    ]);

    const verticalLine = turf.lineString([
      [latLng.lng, -90],
      [latLng.lng, 90],
    ]);

    return [horizontalLine, verticalLine];
  }

  public static clipFeatures(lines: turf.Feature[], clipPolygon: PolygonLike): turf.Feature[] {
    let polygonFeature: PolygonFeature;
    if (clipPolygon.type === 'Feature') {
      polygonFeature = clipPolygon as PolygonFeature;
    } else {
      polygonFeature = turf.feature(clipPolygon) as PolygonFeature;
    }

    const clippedLines: turf.Feature[] = [];

    lines.forEach((line) => {
      const intersection = turf.lineIntersect(line, polygonFeature);

      if (intersection) {
        if (intersection.type === 'FeatureCollection') {
          const coords = intersection.features.map(f => f.geometry.coordinates);
          clippedLines.push(turf.lineString(coords));
        }
      }
    });

    return clippedLines;
  }
}


