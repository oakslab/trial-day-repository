import { useEffect, useMemo, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';
import { Map, useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useTheme } from '@base/ui-base/ui';
import { MarkerMapSvg } from '../map-marker-svg';
import { getSvgMarkClusterer } from './google-map.constants';
import { type Item, calculateDefaultBounds } from './utils';

type GoogleMapProps = {
  points: Item[];
  onMarkerClick?: (id: string) => void;
};

export default function GoogleMap({ points, onMarkerClick }: GoogleMapProps) {
  const defaultBounds = useMemo(() => calculateDefaultBounds(points), [points]);

  return (
    <Map
      mapId="google-map"
      key={`google-maps-${defaultBounds.north},${defaultBounds.south},${defaultBounds.east},${defaultBounds.west}`}
      gestureHandling={'greedy'}
      defaultBounds={defaultBounds}
    >
      <Markers points={points} onMarkerClick={onMarkerClick} />
    </Map>
  );
}

type Point = google.maps.LatLngLiteral & { id: string };
type MarkersProps = { points: Point[]; onMarkerClick?: (id: string) => void };

const Markers = ({ points, onMarkerClick }: MarkersProps) => {
  const map = useMap();
  const theme = useTheme();

  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const lastMarkers = useRef<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      const svg = window.btoa(getSvgMarkClusterer(theme.palette.primary.main));

      clusterer.current = new MarkerClusterer({
        map,
        renderer: {
          render: ({ count, position }) =>
            new google.maps.Marker({
              label: {
                text: String(count),
                color: theme.palette.common.white,
                fontSize: '10px',
                fontWeight: '500',
              },
              icon: {
                url: `data:image/svg+xml;base64,${svg}`,
                scaledSize: new google.maps.Size(45, 45),
              },
              position,
              zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
            }),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // Update markers
  useEffect(() => {
    const markersToAdd = Object.keys(markers).filter(
      (key) => !lastMarkers.current[key],
    );

    markersToAdd.forEach((key) => {
      clusterer.current?.addMarker(markers[key]!);
      lastMarkers.current[key] = markers[key]!;
    });

    return () => {
      const markersToRemove = Object.keys(lastMarkers.current).filter(
        (key) => !markers[key],
      );

      markersToRemove.forEach((key) => {
        clusterer.current?.removeMarker(lastMarkers.current[key]!);
        delete lastMarkers.current[key];
      });
    };
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (
      (marker && markers[key])||
      (!marker && !markers[key])
    ) {
      return
    };

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      }
      const { [key]: _, ...newMarkers } = prev;
      return newMarkers;
    });
  };

  return points.map((point) => (
    <AdvancedMarker
      position={point}
      key={point.id}
      ref={(marker) => setMarkerRef(marker, point.id)}
      onClick={() => onMarkerClick?.(point.id)}
    >
      <MarkerMapSvg />
    </AdvancedMarker>
  ));
};
