import {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import {useUserData} from '../../hook/useLocalStorage';
import {useMarkAttendanceMutation} from '../../redux/services/Attendace/attendanceApiSlice';
import {useAppDispatch} from '../../redux/hook';
import {showSnackbar} from '../../redux/slices/snackbarSlice';
import {screenNames} from '../../types/navigationType';
import {setStatus} from '../../redux/slices/statusSlice';
import {isIos} from '../../components/helper/utility';
import useLocationTracker from '../../components/helper/Location';
import useLocationDetection from '../../components/helper/Location/useLocationDetection';
import {useLazyGetLocationNamesQuery} from '../../redux/services/Location/LocationApiSlice';

interface CheckInOutDetails {
  CheckInOutLatitude: number | null;
  CheckInOutLongitude: number | null;
  CheckInOutLocationId: number | null;
  CheckInOutlocationName?: string;
  Remarks?: string;
  Image: string;
  status: string;
}

interface RouteParams {
  type: string;
}

type CheckInOutRouteProp = RouteProp<{params: RouteParams}, 'params'>;

const useCheckInOut = () => {
  const route = useRoute<CheckInOutRouteProp>();
  const btnLabel = route.params?.type;
  const {getUserData} = useUserData();

  const dispatch = useAppDispatch();

  const navigation = useNavigation();

  const [markAttendance, markAttendanceResult] = useMarkAttendanceMutation();
  const {getCurrentPosition, location , hasError} = useLocationTracker();

  const [isFetching , setIsFetching] = useState(true);
  const [
    fetchLocationNames,
    {
      data: locationNames,
      isLoading: isFetchingLocations,
      error: locationNamesError,
    },
  ] = useLazyGetLocationNamesQuery();


 
  const {
    currentLocation,
    isLoading: isDetectingLocation,
    error: locationDetectionError,
  } = useLocationDetection(
    location.coords.latitude,
    location.coords.longitude,
    locationNames?.data || [],
  );

  useEffect(() => {
    console.log('Checking location permission');
    getCurrentPosition(); // Trigger fetching the location
  }, []);

  useEffect(() => {
    if (location.coords.latitude && location.coords.longitude) {
  
      // Fetch location names after getting the current location
      getUserData().then(employeeDetailsState => {
        const CustomerCode = employeeDetailsState?.customerCode;
        if (CustomerCode) {
          // console.log(
          //   'Fetching location names for customer code:',
          //   CustomerCode,
          // );
          fetchLocationNames(CustomerCode);
        }
      });
    }
  }, [location]); // Monitor changes to the location state


  useEffect(() => {
    if (locationNames && currentLocation) {
      setIsFetching(false);
      console.log('Detected current location:', currentLocation);
      updateCheckInOutData({
        CheckInOutLatitude: currentLocation.latitude,
        CheckInOutLongitude: currentLocation.longitude,
        CheckInOutLocationId: currentLocation?.locationId,
        CheckInOutlocationName: currentLocation?.locationName,
      });

    }
  }, [locationNames, currentLocation]);

  useEffect(() => {
    if (hasError) {
      dispatch(
        showSnackbar({
          message: location.error || 'Failed to fetch location. Please try again.',
          severity: 'error',
        }),
      );
    }
  }, [hasError, dispatch]);

  useEffect(() => {
    if (locationNamesError) {
      dispatch(
        showSnackbar({
          message: locationNamesError?.data?.message || 'Failed to fetch location names. Please try again.',
          severity: 'error',
        }),
      );
    }
  }, [locationNamesError, dispatch]);

  useEffect(() => {
    if (locationDetectionError) {
      dispatch(
        showSnackbar({
          message: locationDetectionError?.data?.message || 'Failed to detect location. Please try again.',
          severity: 'error',
        }),
      );
    }
  }, [locationDetectionError, dispatch]);

  const [checkInOutData, setCheckInOutData] = useState<CheckInOutDetails>({
    CheckInOutLatitude: null,
    CheckInOutLongitude: null,
    CheckInOutLocationId: null,
    Remarks: '',
    Image: '',
    status: btnLabel.toLowerCase(),
  });


  // console.log('checkInOutData:---------->>>>>>>>>>>>>>>>>', checkInOutData);

  const generateCheckInOutPayload = async () => {
    console.log('Generating payload...');
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const timestamp = new Date().toISOString();
      const status = btnLabel.toLowerCase();
      const selfieName = `selfie_${timestamp}_${btnLabel.toLowerCase()}.jpg`;

      // Await the employee details from local storage
      const employeeDetailsState = await getUserData();
      console.log('employeeDetailsState', employeeDetailsState);
      const CustomerCode = employeeDetailsState?.customerCode;
      if (!employeeDetailsState) {
        throw new Error('Employee details not found');
      }
     
      if (!checkInOutData?.CheckInOutLongitude || !checkInOutData?.CheckInOutLongitude) {
        throw new Error('Location data is missing. Please enable location services and try again.');
      }

      const filePath = checkInOutData?.Image;

      if (!filePath) {
        throw new Error('Image path is null or undefined');
      }
      const payload: any = {
        MachineName: deviceName,
        CheckInOutDateTime: timestamp,
        CheckInOutLongitude: checkInOutData?.CheckInOutLongitude,
        CheckInOutLatitude: checkInOutData?.CheckInOutLatitude,
        CheckInOutLocationId: checkInOutData?.CheckInOutLocationId,
        Remarks: checkInOutData?.Remarks,

        file: {
          uri: isIos ? filePath : `file://${filePath}`,
          name: selfieName,
          filename: selfieName,
          type: 'image/jpeg',
        },

        CheckInOutEmployeeId: employeeDetailsState?.employeeId, // Correctly access employeeId
        CheckInOutDirection: status === 'checkin' ? 'in' : 'out',
        CustomerCode: CustomerCode,
      };

      return payload;
    } catch (err) {
      console.log(
        'Error generating payload. Please refresh location and try again.',
      );
      throw err;
    }
  };

  useEffect(() => {
    if (
      markAttendanceResult?.isSuccess &&
      markAttendanceResult?.data?.message
    ) {
      dispatch(setStatus(btnLabel.toLowerCase() === 'checkin' ? 'in' : 'out'));
      dispatch(
        showSnackbar({
          message: `Attendance Marked SuccessFully at ${ currentLocation?.locationName}`,
          severity: 'success',
        }),
      );

      navigation.replace(screenNames.MainTab);
    }

    if (markAttendanceResult?.isError && markAttendanceResult?.error) {
      if (markAttendanceResult.error.status === 500) {
        dispatch(
          showSnackbar({
            message: 'Internal Server Error',
            severity: 'error',
          }),
        );
      } else {
        dispatch(
          showSnackbar({
            message: markAttendanceResult.error.data.message ?? '',
            severity: 'error',
          }),
        );
      }
    }
  }, [markAttendanceResult, navigation, dispatch]);

  const updateCheckInOutData = (newData: Partial<CheckInOutDetails>) => {
    setCheckInOutData(prevData => {
      return {
        ...prevData,
        ...newData,
      };
    });
  };

  const onPhotoCapture = (result: string) => {
    console.log('result', result);
    updateCheckInOutData({Image: result});
  };

  const onSubmit = async () => {
    try {
      const payload = await generateCheckInOutPayload();
      console.log('Generated payload:', payload);
      const response = await markAttendance(payload).unwrap();
      console.log('API response:', response);
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error('Error submitting attendance:', error);
      dispatch(
        showSnackbar({
          message:
            typeof error === 'string'
              ? error
              : (error as Error)?.message || 'An unknown error occurred',
          severity: 'error',
        }),
      );
    }
  };

  return {
    generateCheckInOutPayload,
    setCheckInOutData,
    onPhotoCapture,
    updateCheckInOutData,
    onSubmit,
    markAttendanceResult,
    isFetchingLocations, // Expose loading state for location names
    locationNames, // Expose fetched location names
   isFetching,  // Expose loading state for location detection
  };
};

export default useCheckInOut;
