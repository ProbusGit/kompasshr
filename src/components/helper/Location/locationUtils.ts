// locationUtils.ts
import { getDistance } from 'geolib';

export interface Location {
    locationId: number;
    locationName: string;
    latitude: string;
    longitude: string;
    range: string;
}

export interface CurrentLocation {
    locationId: number;
    locationName: string;
    latitude: number;
    longitude: number;
}

export function detectCurrentLocation(
    currentLat: number,
    currentLon: number,
    locations: Location[]
): CurrentLocation {
    if (!locations || locations.length === 0) {
        throw new Error('No locations provided');
    }

    let nearestLocation: CurrentLocation | null = null;
    let minDistance = Infinity;

    for (const location of locations) {
        const locationLat = parseFloat(location.latitude);
        const locationLon = parseFloat(location.longitude);
        const range = parseFloat(location.range) * 1000; // Convert km to meters

        // Calculate distance in meters using geolib
        const distance = getDistance(
            { latitude: currentLat, longitude: currentLon },
            { latitude: locationLat, longitude: locationLon }
        );

        // Check if within range and closer than previous nearest
        if (distance <= range && distance < minDistance) {
            minDistance = distance;
            nearestLocation = {
                locationId: location.locationId,
                locationName: location.locationName,
                latitude: locationLat,
                longitude: locationLon,
            };
        }
    }

    if (!nearestLocation) {
        throw new Error('No nearby locations found within range');
    }

    return nearestLocation;
}