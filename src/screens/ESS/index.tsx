import React, { useCallback, useEffect, useRef, useState } from 'react';

import { View, ActivityIndicator, StyleSheet, Dimensions, BackHandler, Alert ,Button} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../colors/Color';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch } from '../../redux/hook/';
import { hideDialog, showDialog } from '../../redux/slices/dialogSlice';
// import messaging from '@react-native-firebase/messaging';
// import { displayNotification } from '../utils/notificationManager';

const { width, height } = Dimensions.get('window');
const ESSLayout = () => {

  const [webViewUrl, setWebViewUrl] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const webViewRef = useRef(null);
 

  const homeUrl = webViewUrl; // This will represent the home URL for comparison

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [webViewLoading, setWebViewLoading] = useState(false); // Track WebView loading state

  const getUserData = useCallback(async () => {
    try {
      const response = await AsyncStorage.getItem('userData');
      if (response) {
        return JSON.parse(response); // Parse and return the user data
      }
      return null;
    } catch (error) {
      console.error('Error getting user data from AsyncStorage:', error);
      return null;
    }
  }, []);
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Show loader while fetching data
     
      const res = await getUserData();
      if (res) {
        console.log('User data fetched:', res);
        const baseUrl = 'http://115.124.123.180/Login/Login1';
        const url = `${baseUrl}?ESSCustomerCode=${res.customerCode}&ESSLoginID=${res.loginId}&ESSPassword=${res.password}`;
        setWebViewUrl(url);

      }
      setLoading(false); // Hide loader after fetching data
    };

    fetchUserData(); // Fetch user data on component mount
  }, [getUserData]);






  // Custom back action handler
  const handleBackButtonPress = () => {
    if (
      canGoBack &&
      currentUrl !== 'http://115.124.123.180/Mobile/MobileDashboard/MobileDashboard'
    ) {
      webViewRef.current.goBack();
      return true; // Prevent default back action
    } else {

      dispatch(
           showDialog({
             title: 'Exit App',
             content: 'Are you sure you want to exit?',
             onConfirm: () => {
               dispatch(hideDialog());
               BackHandler.exitApp();
             },
           }),
         );
      
      return true; // Prevent default back action to show the alert

      
    }
  };


  // Use focus effect to attach/detach the BackHandler only when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );

      return () => backHandler.remove();
    }, [canGoBack, currentUrl, homeUrl]), // Dependencies include the state values
  );

  const handleSessionStateChange = useCallback((url) => {
    setTimeout(() => {
      if (url && url.includes('Dashboard')) {
        setWebViewUrl('http://115.124.123.180/Mobile/MobileDashboard/MobileDashboard');
      } 
    }, 0); // Wait for 2 seconds
  }, []);


  // Handle WebView navigation state changes
  interface NavigationState {
    url: string;
    canGoBack: boolean;
    canGoForward?: boolean;
    loading?: boolean;
    title?: string;
  }

  const handleNavigationStateChange = (navState: NavigationState): void => {
    console.log('navState', navState);
    const { url } = navState;
    handleSessionStateChange(url);
    setCanGoBack(navState.canGoBack); // Tracks if we can go back
    setCurrentUrl(navState.url); // Track the current URL for comparison
  };


  // console.log('webViewUrl', webViewUrl)
  // console.log('sessionEstablished', sessionEstablished)
  // console.log('currentUrl', currentUrl)

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color='pink'/>
      </View>
    );
  }

  // const handleshownotification = () => {
  //  displayNotification('title', 'body');
  // };

  return (
    <View style={styles.Maincontainer}>
      {webViewLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color='green' />
        </View>
      )}
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={ { uri: webViewUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => setWebViewLoading(true)} // Show loader when WebView starts loading
          onLoadEnd={() => setWebViewLoading(false)} // Hide loader when WebView finishes loading
          onError={() => setWebViewLoading(false)} // Hide loader on error
          style={{ flex: 1 }}
          allowsBackForwardNavigationGestures={true}
        />
        {/* <Button title='show notification' onPress={handleshownotification} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  Maincontainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
});

export default ESSLayout;
