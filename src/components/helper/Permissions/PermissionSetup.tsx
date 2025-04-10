import {useEffect, useState} from 'react';
import {Platform, Alert} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

type PermissionStatus =
  | 'unavailable'
  | 'denied'
  | 'blocked'
  | 'granted'
  | 'limited';

interface PermissionState {
  camera: PermissionStatus;
  locationWhenInUse: PermissionStatus;
  locationAlways: PermissionStatus;
  locationAccuracy: PermissionStatus;
  mediaLibrary: PermissionStatus;
}

const useAppPermissions = () => {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: 'denied',
    locationWhenInUse: 'denied',
    locationAlways: 'denied',
    locationAccuracy: 'denied',
    mediaLibrary: 'denied',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Define platform-specific permissions
  const cameraPermission = Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  });

  const locationWhenInUsePermission = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  });

  const locationAlwaysPermission = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  });

  const mediaLibraryPermission = Platform.select({
    ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  });

  const checkAllPermissions = async () => {
    try {
      const results = await Promise.all([
        check(cameraPermission!),
        check(locationWhenInUsePermission!),
        check(locationAlwaysPermission!),
        // Location accuracy is handled differently on iOS
        Platform.OS === 'ios'
          ? check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          : Promise.resolve('unavailable'),
        check(mediaLibraryPermission!),
      ]);

      setPermissions({
        camera: results[0] as PermissionStatus,
        locationWhenInUse: results[1] as PermissionStatus,
        locationAlways: results[2] as PermissionStatus,
        locationAccuracy: results[3] as PermissionStatus,
        mediaLibrary: results[4] as PermissionStatus,
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async (permissionType: keyof PermissionState) => {
    try {
      let permissionToRequest;
      let result: PermissionStatus = 'denied';

      switch (permissionType) {
        case 'camera':
          permissionToRequest = cameraPermission;
          break;
        case 'locationWhenInUse':
          permissionToRequest = locationWhenInUsePermission;
          break;
        case 'locationAlways':
          permissionToRequest = locationAlwaysPermission;
          break;
        case 'locationAccuracy':
          if (Platform.OS === 'ios') {
            // On iOS, request temporary full accuracy authorization
            // Note: This is a simplified approach - you might need to use native code for full implementation
            permissionToRequest = locationWhenInUsePermission;
          } else {
            // Android doesn't have a direct equivalent
            return 'unavailable';
          }
          break;
        case 'mediaLibrary':
          permissionToRequest = mediaLibraryPermission;
          break;

        default:
          return 'unavailable';
      }

      if (permissionToRequest) {
        result = (await request(permissionToRequest)) as PermissionStatus;
      }

      // Update the specific permission status
      setPermissions(prev => ({
        ...prev,
        [permissionType]: result,
      }));

      return result;
    } catch (error) {
      console.error(`Error requesting ${permissionType} permission:`, error);
      return 'denied';
    }
  };

  const showPermissionRationale = (permissionType: keyof PermissionState) => {
    const messages = {
      camera:
        'We need access to your camera to capture your photo for attendance tracking.',
      locationWhenInUse:
        'Your location is needed to verify your attendance based on your current location.',
      locationAlways:
        'Your location is required to ensure accurate attendance tracking, even when the app is in the background.',
      locationAccuracy:
        'We need precise location access to ensure accurate attendance tracking.',
      mediaLibrary:
        'We need access to your media library to allow you to upload photos for attendance purposes.',
    };

    Alert.alert(
      'Permission Required',
      messages[permissionType],
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => requestPermission(permissionType),
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    checkAllPermissions();
  }, []);

  return {
    permissions,
    isLoading,
    requestPermission,
    checkAllPermissions,
    showPermissionRationale,
  };
};

export default useAppPermissions;
