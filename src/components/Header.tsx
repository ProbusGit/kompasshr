import React from 'react';
import { View, StyleSheet, StatusBar, Image, Text, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '../redux/hook/';
import { hideDialog, showDialog } from '../redux/slices/dialogSlice';
import Colors from '../colors/Color';
import { screenNames } from '../types/navigationType';
import { useLogin } from '../screens/LoginScreen/useLogin';
import { useUserData } from '../hook/useLocalStorage';

const { width, height } = Dimensions.get('window');
const Header = () => {

  const { logout } = useLogin();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(
      showDialog({
        title: 'Logout',
        content: 'Are you sure you want to logout?',
        onConfirm: () => {
          dispatch(hideDialog());
          logout();

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: screenNames.Login }],
            })
          );
        },
      }),
    );
  };

  const handleBuzzerPress = () => {
    dispatch(
      showDialog({
        title: 'Buzzer Alert',
        content: 'This is a buzzer notification.',
      }),
    );
  };

  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const {user} = useAppSelector(state => state.auth);
 
  return (
    <>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <View style={{ backgroundColor: Colors.primary }}>
        <Appbar.Header style={styles.header}>
          {/* <IconButton
            icon="menu"
            size={24}
            // Explicitly opens the drawer
            iconColor={Colors.white}
          /> */}
          <View style={styles.userInfo}>
            <TouchableWithoutFeedback>
              <Image
                style={styles.userImage}
                source={{
                  uri: user?.profilePic ? user?.profilePic : 'https://avatar.iran.liara.run/public/boy?username=pawan'
                }}
              />
            </TouchableWithoutFeedback>
            <View>
              <Text style={styles.userName}>
                <Text style={{ fontWeight: '300' }}>{getGreetingMessage()}</Text>
              </Text>
              <Text style={styles.userId}>{user?.employeeName || 'Guest'}</Text> {/* Display employeeName */}
            </View>
          </View>
          <View style={styles.iconContainer}>
            <IconButton
              icon="bullhorn-outline"
              size={24}
              onPress={handleBuzzerPress}
              iconColor={Colors.white}
            />


            <IconButton
              icon="power"
              size={26}
              onPress={handleLogout}
              iconColor={Colors.white}
            />
          </View>
        </Appbar.Header>
       
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: height * 0.08,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  greetingContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
    color: '#fff',
  },
  userId: {
    color: '#fff',
    fontSize: width * 0.035,
  },
});

export default Header;
