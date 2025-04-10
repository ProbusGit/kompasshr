import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import SwipeButton from 'rn-swipe-button';
import Colors from '../../colors/Color';

import Icon from 'react-native-vector-icons/Ionicons';

import { isIos } from '../../components/helper/utility';
import { screenNames } from '../../types/navigationType';
import { useAppSelector } from '../../redux/hook';
const { width, height } = Dimensions.get('window'); // Get window dimensions

const SlideToEnterScreen = ({ navigation }: { navigation: any }) => {

const {user} = useAppSelector(state => state.auth);
 

  const handleSwipeSuccess = () => {
    navigation.replace(screenNames.MainTab); // Navigate to the main app
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome </Text>
      <Text style={styles.subtitle}>{user?.employeeName }</Text>
      <SwipeButton
        thumbIconBackgroundColor={Colors.white}
        thumbIconBorderColor={Colors.white}
        height={height * 0.08}
        railBackgroundColor="#000"
        railBorderColor={Colors.primary}
        railFillBackgroundColor={Colors.primary}
        railFillBorderColor={Colors.primary}
        title="Swipe me"
        titleColor={Colors.white}
        titleFontSize={20}
        onSwipeSuccess={handleSwipeSuccess}
        containerStyles={styles.swipeButton}
        shouldResetAfterSuccess={true} // Reset after success
        swipeSuccessThreshold={70} // Set swipe threshold to 70%
        // finishRemainingSwipeAnimationDuration={0.01} // Finish animation in 0.2 seconds
        thumbIconComponent={() => (
          <View style={styles.thumbIcon}>
            <Icon
              name='arrow-forward-circle'
              size={70} // Adjusted size to fit within the button
              color={Colors.primary}
            />
          </View>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 30,
  },
  swipeButton: {

    width: width * 0.9, // 90% of screen width
    bottom: isIos ? -height * 0.28 : -height * 0.30, // Adjusted for iOS
    borderRadius: 40,

    overflow: 'hidden', // Ensure content stays within bounds
  },
  thumbIcon: {
    width: 70, // Match the size of the icon
    height: 70,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  thumbText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
});

export default SlideToEnterScreen;

