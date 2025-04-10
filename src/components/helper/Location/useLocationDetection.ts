import { useEffect, useState } from 'react';
import { detectCurrentLocation, CurrentLocation, Location } from './locationUtils';

const useLocationDetection = (
    currentLat: number | null,
    currentLon: number | null,
    locations: Location[]
): {
    currentLocation: CurrentLocation | null;
    isLoading: boolean;
    error: string | null;
} => {
    const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (currentLat && currentLon && locations.length > 0) {
            setIsLoading(true);
            try {
                const detectedLocation = detectCurrentLocation(
                    currentLat,
                    currentLon,
                    locations
                );
                setCurrentLocation(detectedLocation);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Location not found in the predefined list. You are not in the range.'
                );
                setCurrentLocation(null);
            } finally {
                setIsLoading(false);
            }
        }
    }, [currentLat, currentLon, locations]);

    return { currentLocation, isLoading, error };
};

export default useLocationDetection;