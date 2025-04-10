import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/hook/';
import appImages from '../../assets/images';
import {screenNames} from '../../types/navigationType';
import {checkAuthStatus, updateUserData} from '../../redux/slices/authSlice';
import {useLazyLatestStatusQuery} from '../../redux/services/Attendace/attendanceApiSlice';
import {setStatus} from '../../redux/slices/statusSlice';
import {useUserData} from '../../hook/useLocalStorage';
import { useLazyGetUserProfileQuery } from '../../redux/services/Profile/ProfileApiSlice';


const SplashScreen = () => {
  const [fetchLatestStatus] = useLazyLatestStatusQuery();
  const [triggerGetUserProfile] = useLazyGetUserProfileQuery();

 
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.auth);
  const navigation = useNavigation();
  const {isAuthenticated} = useAppSelector(state => state.auth);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const {getUserData} = useUserData();


  useEffect(() => {
    const checkAuthentication = async () => {
      await dispatch(checkAuthStatus());
      setIsAuthChecked(true);

      if (isAuthenticated) {
        try {
          const employeeDetailsState = await getUserData();
          console.log('Employee Details: at slpashscreen for checkibng latestststus', employeeDetailsState);
          const employeeId = employeeDetailsState?.employeeId;
          const CustomerCode = employeeDetailsState?.customerCode;
          const response = await fetchLatestStatus({employeeId , CustomerCode}).unwrap();
          const data = await triggerGetUserProfile({
            employeeId: employeeDetailsState?.employeeId,
            CustomerCode: employeeDetailsState?.customerCode,
          }).unwrap();
          console.log('Fetched user profile data:', data?.profilePic);
      
          // Update profilePic in the user data
          // dispatch(updateUserData({ profilePic: data?.profilePic }));
          if (response?.checkInOutDirection) {
            dispatch(setStatus(response.checkInOutDirection)); // Update the global status
          }
        } catch (error) {
          console.error('Error fetching latest status:', error);
        }
      }
    };

    checkAuthentication();
  }, [dispatch, isAuthenticated, fetchLatestStatus]);



  useEffect(() => {
    if (isAuthChecked) {
      console.log('user:', user);
      setTimeout(() => {
        isAuthenticated
          ? navigation.replace(screenNames.SlideToEnter)
          : navigation.replace(screenNames.Login);
      }, 1000); // Add 1-second delay
    }
  }, [isAuthChecked, isAuthenticated, navigation]);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  const rotateStyle = {
    transform: [
      {
        rotate: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={appImages.logo}
        style={[styles.image1, rotateStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image1: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;
