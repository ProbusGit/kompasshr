import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../components/Header';
import {ActivityIndicator, Button} from 'react-native-paper';
import {Camera, PhotoFile, useCameraDevice} from 'react-native-vision-camera';
import appImages from '../../assets/images';
import useAppPermissions from '../../components/helper/Permissions/PermissionSetup';
import useCheckInOut from './useCheckInOut';
import useLocationTracker from '../../components/helper/Location';
import useLocationDetection from '../../components/helper/Location/useLocationDetection';
import { isIos } from '../../components/helper/utility';
import ReportIssueModal from './ReportIssueModal';

const CheckInOut = () => {
  const {permissions, requestPermission, showPermissionRationale} =
    useAppPermissions();

    
  const [capturedImage, setCapturedImage] =useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('front');

  const {onSubmit, onPhotoCapture,markAttendanceResult , updateCheckInOutData , isFetching} = useCheckInOut();
 

  useEffect(() => {
    capturedImage &&
      setTimeout(async () => {
        await onSubmit();
      }, 100);
  }, [capturedImage]);

  useEffect(() => {
    const checkPermissionsOnMount = async () => {
      if (permissions.camera !== 'granted') {
        const status = await requestPermission('camera');
        if (status !== 'granted') {
          showPermissionRationale('camera');
        }
      }
    };
    checkPermissionsOnMount();
  }, []);

  const handleReportIssue = () => {
    setModalVisible(true);
  };

  const handleModalDismiss = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = (remark: string) => {
    updateCheckInOutData({ Remarks: remark });
    // Alert.alert('Thank you!', 'Your remark has been submitted.');
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto();
        console.log('Photo captured:', photo);

        setCapturedImage(true);

        onPhotoCapture(photo.path); // Pass captured photo data to parent component
      } catch (err) {
        console.warn('Failed to take photo', err);
        // Handle error (e.g., show an error message)
      }
    }
  };
  const handleImageClick = () => {
    console.log('Image clicked');
  };

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text>Camera not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Header /> */}
      <View style={styles.container}>
        {/* {isFetchingLocation && (
          <View
            style={{
              zIndex: 99,
              position: 'absolute',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#F5F5F5',
              opacity: 0.7,
            }}>
            <ActivityIndicator style={{flex: 1}} size="large" color="#578FCA" />
          </View>
        )} */}


        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.imagebody} onPress={handleImageClick}>
            <Image
              source={appImages.faceOutline}
              style={styles.faceOutline}
              resizeMethod="auto"
            />
            <Camera
              style={StyleSheet.absoluteFill}
              ref={cameraRef}
              device={device}
              preview={true}
              isActive={true}
              outputOrientation="device"
              photo={true}
            />
          </TouchableOpacity>
          <Text style={styles.note}>
            Make sure to upload a clear face selfie
          </Text>
        </View>

        <View style={{width: '100%', marginTop: 50}}>
          <Button
            mode="outlined"
            textColor="#fff"
            disabled={isFetching  || markAttendanceResult.isLoading}
            onPress={takePhoto}
            style={[styles.button, {backgroundColor: isFetching  || markAttendanceResult.isLoading ? '#ccc' : '#578FCA'}]}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Mark Attendance</Text>
              { markAttendanceResult.isLoading  && (
              <ActivityIndicator size="small" color="#fff" /> 
               )}  
            </View>
          </Button>
          <Text style={styles.issueText}>
            want to add remark ?{' '}
            <Text
              style={{color: '#578FCA', textDecorationLine: 'underline'}}
              onPress={handleReportIssue}
            >
              click here
            </Text>
            .
          </Text>
        </View>
      </View>
      <ReportIssueModal
        visible={isModalVisible}
        onDismiss={handleModalDismiss}
        onSubmit={handleModalSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    // marginTop: '10%',
    // paddingVertical: '20%',
    paddingVertical: 20,
    width: '100%',
    // backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  imagebody: {
    width: 340,
    height: 350,
    // backgroundColor: '#e0e0e0',
    // borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    // borderColor: '#00BFA6',
  },

  placeholderText: {
    color: '#757575',
    textAlign: 'center',
  },
  note: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    // borderRadius: 100,
  },
  faceOutline: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    width: '100%',
    padding: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  buttonText: {
    color: '#fff',
    marginRight: 8, // Add some space between the text and the loader
  },
  issueText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 10,
    textAlign: 'center',
  },
});
export default CheckInOut;
