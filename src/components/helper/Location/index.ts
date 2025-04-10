import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import Geolocation, {
  GeoPosition,
  GeoError,
  GeoOptions,
} from 'react-native-geolocation-service';
import useAppPermissions from '../Permissions/PermissionSetup'; // Import the permissions hook

interface LocationCoords {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
}

interface LocationState {
  coords: LocationCoords;
  status: 'idle' | 'fetching' | 'success' | 'error';
  isFetching: boolean; // Explicit fetching state
  error: string | null;
  timestamp: number | null;
}

const useLocationTracker = (watch: boolean = false) => {
  const { permissions, requestPermission } = useAppPermissions(); // Access permissions
  const [location, setLocation] = useState<LocationState>({
    coords: {
      latitude: null,
      longitude: null,
      accuracy: null,
      altitude: null,
      heading: null,
      speed: null,
    },
    status: 'idle',
    isFetching: false, // Initial fetching state
    error: null,
    timestamp: null,
  });

  const locationOptions: GeoOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 10000,
    distanceFilter: 10,
    showLocationDialog: true,
    forceRequestLocation: true,
  };

  const setFetching = (fetching: boolean) => {
    setLocation(prev => ({
      ...prev,
      isFetching: fetching,
      status: fetching ? 'fetching' : prev.status,
    }));
  };

  const getCurrentPosition = useCallback(async () => {
    if (permissions.locationWhenInUse !== 'granted') {
      const result = await requestPermission('locationWhenInUse');
      if (result !== 'granted') {
        setLocation(prev => ({
          ...prev,
          status: 'error',
          error: 'Location permission is required to fetch location.',
        }));
        return;
      }
    }

    setFetching(true);
    setLocation(prev => ({ ...prev, error: null }));

    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        setLocation({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
          },
          status: 'success',
          isFetching: false,
          error: null,
          timestamp: position.timestamp,
        });
      },
      (error: GeoError) => {
        setLocation(prev => ({
          ...prev,
          status: 'error',
          isFetching: false,
          error: getErrorMessage(error.code),
        }));
      },
      locationOptions
    );
  }, [permissions.locationWhenInUse, requestPermission]);

  useEffect(() => {
    let watchId: number | null = null;

    const handleWatchPosition = (position: GeoPosition) => {
      setLocation({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
        },
        status: 'success',
        isFetching: false,
        error: null,
        timestamp: position.timestamp,
      });
    };

    const handleWatchError = (error: GeoError) => {
      setLocation(prev => ({
        ...prev,
        status: 'error',
        isFetching: false,
        error: getErrorMessage(error.code),
      }));
    };

    const startWatching = async () => {
      if (permissions.locationWhenInUse !== 'granted') {
        const result = await requestPermission('locationWhenInUse');
        if (result !== 'granted') {
          setLocation(prev => ({
            ...prev,
            status: 'error',
            error: 'Location permission is required to watch location.',
          }));
          return;
        }
      }

      setFetching(true);
      watchId = Geolocation.watchPosition(
        handleWatchPosition,
        handleWatchError,
        locationOptions
      );
    };

    if (watch) {
      startWatching();
    }

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [watch, permissions.locationWhenInUse, requestPermission]);

  const getErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return 'Location permission denied. Please enable permissions in settings.';
      case 2:
        return 'Unable to determine location. Please check your network/GPS.';
      case 3:
        return 'Location request timed out. Please try again.';
      default:
        return 'Failed to get location. Please try again.';
    }
  };

  const resetLocation = useCallback(() => {
    setLocation({
      coords: {
        latitude: null,
        longitude: null,
        accuracy: null,
        altitude: null,
        heading: null,
        speed: null,
      },
      status: 'idle',
      isFetching: false,
      error: null,
      timestamp: null,
    });
  }, []);

  return {
    location,
    getCurrentPosition,
    resetLocation,
    isFetching: location.isFetching, // Direct access to fetching state
    hasError: location.status === 'error',
    isSuccess: location.status === 'success',
  };
};

export default useLocationTracker;