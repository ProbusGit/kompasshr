import React, { useState } from 'react';
import useLocationTracker from './helper/Location';
import { TouchableOpacity ,View} from 'react-native';

import { Text } from 'react-native-paper';

const LocationDisplay = () => {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number | null; lon: number | null }>({
    lat: null,
    lon: null,
  });

  const { getCurrentPosition, location, isFetching, hasError } = useLocationTracker();

  const handleGetLocation = () => {
    getCurrentPosition();
    if (location.coords.latitude && location.coords.longitude) {
      setCurrentPosition({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });
    }
  };

  return (
    <View style={{ padding: 80 }}>
      <TouchableOpacity
        onPress={handleGetLocation}
        disabled={isFetching}
        style={{
          backgroundColor: isFetching ? '#ccc' : '#007BFF',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Get Current Location</Text>
      </TouchableOpacity>
      {hasError && <Text style={{ color: 'red', marginTop: 10 }}>Error: {location.error}</Text>}
      <Text style={{ marginTop: 10 }}>Latitude: {location.coords.latitude}</Text>
      <Text>Longitude: {location.coords.longitude}</Text>
    </View>
  );
};

export default LocationDisplay;
