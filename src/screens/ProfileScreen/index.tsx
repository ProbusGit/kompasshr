import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../colors/Color';
import {useUserData} from '../../hook/useLocalStorage';
import {useUpdateUserProfileMutation} from '../../redux/services/Profile/ProfileApiSlice';
import DeviceInfo from 'react-native-device-info';
import {useAppDispatch, useAppSelector} from '../../redux/hook';
import {showSnackbar} from '../../redux/slices/snackbarSlice';
import {updateUserData} from '../../redux/slices/authSlice';
import { isIos } from '../../components/helper/utility';

const {width, height} = Dimensions.get('window');

const ProfileScreen = ({navigation}: any) => {
  // const [profilePic, setProfilePic] = useState<string | null>(null);
  const {user} = useAppSelector(state => state.auth);

  interface EmployeeData {
      customerCode: string;
      employeeId: number;
      employeeName: string;
      departmentName: string;
      designationName: string;
      profilePic: string | null;
   
  }

  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const {getUserData} = useUserData();
  const [updateUserProfile, updateUserProfileResult] =
    useUpdateUserProfileMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        if (data) {
          
          setEmployeeData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

console.log('User data:', user?.profilePic);
  const selectImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        const imageUri = response.uri || response.assets?.[0]?.uri;
       console.log('Image URI:', imageUri);
        // setProfilePic(imageUri);

        if (employeeData && imageUri) {
          const fileName = `profile_pic_${employeeData?.employeeId}.jpg`;
          const fileType = `image/${fileName?.split('.').pop()}`;
          const deviceName = await DeviceInfo.getDeviceName();

          const payload = {
            MachineName: deviceName || 'Unknown Device',
            file: {
              uri:  imageUri ,
              name: fileName,
              filename: fileName,
              type: fileType,
            },
            employeeId: employeeData?.employeeId.toString(),
            CustomerCode: employeeData?.customerCode,
          };

          try {
            console.log('Payload:', payload);
            await updateUserProfile(payload).unwrap();
            dispatch(updateUserData({profilePic: imageUri}));
          
          } catch (err) {
            console.error('Error updating profile picture:', err);
          }
        }
      }
    });
  };

  useEffect(() => {
    if (updateUserProfileResult.isSuccess) {
      dispatch(
        showSnackbar({
          message: 'Profile picture updated successfully',
          severity: 'success',
        }),
      );

      console.log('Profile picture updated successfully');
    } else if (updateUserProfileResult.isError) {
      dispatch(
        showSnackbar({
          message: 'Failed to update profile picture. Please try again.',
          severity: 'error',
        }),
      );

    }
  }, [updateUserProfileResult]);

  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: user?.profilePic ? user?.profilePic : 'https://example.com/default-profile-pic.jpg',
          }}
          style={styles.profilePic}
        />

        <TouchableOpacity
          style={styles.editButton}
          onPress={selectImage}
          disabled={updateUserProfileResult.isLoading}>
          {updateUserProfileResult.isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.editButtonText}>Edit Profile</Text>
              <MaterialCommunityIcons
                name="account-edit-outline"
                size={width * 0.06}
                color="#fff"
              />
            </>
          )}
        </TouchableOpacity>

        {employeeData && (
          <View style={styles.employeeDetails}>
            <Text style={styles.employeeDetail}>
              Employee Name: {employeeData?.employeeName}
            </Text>
            <Text style={styles.employeeDetail}>
              Employee ID: {employeeData?.employeeId}
            </Text>
            <Text style={styles.employeeDetail}>
              Department: {employeeData?.departmentName}
            </Text>
            <Text style={styles.employeeDetail}>
              Designation: {employeeData?.designationName}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flex: 1,
    backgroundColor: Colors.primary,
    width: '100%',
    height: height * 0.15,
  },
  profileContainer: {
    position: 'absolute',
    top: height * 0.2,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopStartRadius: width * 0.1,
    borderTopEndRadius: width * 0.1,
  },
  profilePic: {
    top: -height * 0.1,
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    borderWidth: 3,
    borderColor: 'lightgrey',
  },
  editButton: {
    marginTop: -height * 0.02,
    flexDirection: 'row',
    gap: width * 0.02,
    padding: width * 0.03,
    alignItems: 'center',
    backgroundColor: '#ff4444',
    borderRadius: width * 0.02,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  employeeDetails: {
    padding: width * 0.05,
    marginTop: height * 0.02,
  },
  employeeDetail: {
    fontSize: width * 0.045,
    color: '#333',
    marginBottom: height * 0.01,
  },
});

export default ProfileScreen;
