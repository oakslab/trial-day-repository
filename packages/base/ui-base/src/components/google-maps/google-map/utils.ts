export type Item = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

const DEFAULT_BOUNDS_MINIMUM = 0.01 as const;

export const calculateDefaultBounds = (
  items: Item[],
): {
  east: number;
  north: number;
  south: number;
  west: number;
} => {
  if (items.length === 0) {
    throw new Error('No data provided.');
  }

  if (items.length === 1 && items[0]) {
    return {
      north: items[0].lat + DEFAULT_BOUNDS_MINIMUM,
      south: items[0].lat - DEFAULT_BOUNDS_MINIMUM,
      east: items[0].lng + DEFAULT_BOUNDS_MINIMUM,
      west: items[0].lng - DEFAULT_BOUNDS_MINIMUM,
    };
  }

  let north = -Infinity;
  let south = Infinity;
  let east = -Infinity;
  let west = Infinity;

  for (const item of items) {
    if (item.lat > north) north = item.lat;
    if (item.lat < south) south = item.lat;
    if (item.lng > east) east = item.lng;
    if (item.lng < west) west = item.lng;
  }

  return { north, south, east, west };
};
