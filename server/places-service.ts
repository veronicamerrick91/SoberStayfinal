interface NearbyPlace {
  name: string;
  type: string;
  distance: string;
  distanceMiles: number;
  address?: string;
}

interface GeocodingResult {
  lat: number;
  lng: number;
}

const PLACE_TYPES = [
  { type: 'hospital', label: 'Hospitals' },
  { type: 'pharmacy', label: 'Pharmacies' },
  { type: 'doctor', label: 'Medical Offices' },
  { type: 'gym', label: 'Fitness Centers' },
  { type: 'park', label: 'Parks' },
  { type: 'bus_station', label: 'Public Transit' },
  { type: 'subway_station', label: 'Public Transit' },
  { type: 'train_station', label: 'Public Transit' },
  { type: 'grocery_or_supermarket', label: 'Grocery Stores' },
  { type: 'supermarket', label: 'Grocery Stores' },
  { type: 'church', label: 'Places of Worship' },
  { type: 'mosque', label: 'Places of Worship' },
  { type: 'synagogue', label: 'Places of Worship' },
  { type: 'cafe', label: 'Cafes' },
  { type: 'library', label: 'Libraries' },
];

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(miles: number): string {
  if (miles < 0.1) {
    return `${Math.round(miles * 5280)} ft`;
  }
  return `${miles.toFixed(1)} mi`;
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.log("Google Maps API key not configured");
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }
    
    console.log("Geocoding failed:", data.status, data.error_message || "");
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function getNearbyPlaces(lat: number, lng: number): Promise<NearbyPlace[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.log("Google Maps API key not configured");
    return [];
  }

  const nearbyPlaces: NearbyPlace[] = [];
  const seenNames = new Set<string>();
  const SEARCH_RADIUS = 24000;

  const typesToSearch = [
    { type: 'hospital', label: 'Hospitals' },
    { type: 'pharmacy', label: 'Pharmacies' },
    { type: 'gym', label: 'Fitness Centers' },
    { type: 'park', label: 'Parks' },
    { type: 'transit_station', label: 'Public Transit' },
    { type: 'supermarket', label: 'Grocery Stores' },
    { type: 'church', label: 'Places of Worship' },
    { type: 'library', label: 'Libraries' },
  ];

  for (const { type: placeType, label } of typesToSearch) {
    try {
      const url = `https://places.googleapis.com/v1/places:searchNearby`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location',
        },
        body: JSON.stringify({
          includedTypes: [placeType],
          maxResultCount: 3,
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: SEARCH_RADIUS,
            },
          },
        }),
      });
      const data = await response.json();

      if (data.places && data.places.length > 0) {
        for (const place of data.places.slice(0, 2)) {
          const name = place.displayName?.text || 'Unknown';
          if (seenNames.has(name)) continue;
          seenNames.add(name);

          const placeLat = place.location?.latitude;
          const placeLng = place.location?.longitude;
          if (!placeLat || !placeLng) continue;
          
          const distanceMiles = calculateDistance(lat, lng, placeLat, placeLng);

          nearbyPlaces.push({
            name,
            type: label,
            distance: formatDistance(distanceMiles),
            distanceMiles,
            address: place.formattedAddress,
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching ${placeType}:`, error);
    }
  }

  nearbyPlaces.sort((a, b) => a.distanceMiles - b.distanceMiles);

  return nearbyPlaces.slice(0, 12);
}

export async function getNearbyServicesForAddress(address: string): Promise<NearbyPlace[]> {
  const coordinates = await geocodeAddress(address);
  if (!coordinates) {
    return [];
  }
  return getNearbyPlaces(coordinates.lat, coordinates.lng);
}

export function isGoogleMapsConfigured(): boolean {
  return !!process.env.GOOGLE_MAPS_API_KEY;
}
