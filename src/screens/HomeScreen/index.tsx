import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { isIos } from '../../components/helper/utility';
import Clock from '../../components/Clock';
import Colors from '../../colors/Color';
import {screenNames} from '../../types/navigationType';
import {useAppSelector} from '../../redux/hook';
import { extractTime } from '../../utils/timeFormatter';
import useAttendanceHistory from '../../hook/useAttendanceHistory';

const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation}: any) => {
  const {status} = useAppSelector(state => state.status);

  const {history, isLoading} = useAttendanceHistory();
  const [checkInTime, setCheckInTime] = useState('N/A');
  const [checkOutTime, setCheckOutTime] = useState('N/A');
 

  const {user} = useAppSelector(state => state.auth);
  console.log('user after login', user);

  useEffect(() => {
    if ( history && history.length > 0) {
      const firstEntry = history[0];
      const lastEntry = history[history.length - 1];

      setCheckOutTime(firstEntry ? extractTime(firstEntry.CheckInOutDateTime) : 'N/A');
      setCheckInTime(lastEntry ? extractTime(lastEntry.CheckInOutDateTime) : 'N/A');
    }
  }, [history]);


 
  return (
    <>
      <View style={styles.Maincontainer}>
        <View style={styles.container}>
          <View style={[styles.container, {marginTop: 50}]}>
            <Clock />

            {/* Punch In Button */}
            <View style={styles.btncontainer}>
              {status === 'in' ? (
                <View style={styles.outerCircle}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate(screenNames.CheckInOut, {
                        type: 'checkout',
                      })
                    }>
                    <View style={styles.innerCircle}>
                      <Icon name="touch-app" size={40} color="green" />
                      <Text style={styles.label}>Check Out</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.outerCircle}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate(screenNames.CheckInOut, {
                        type: 'checkin',
                      })
                    }>
                    <View style={styles.innerCircle}>
                      <Icon name="touch-app" size={40} color="red" />
                      <Text style={styles.label}>Check In</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Punch Details Section */}
            <View style={styles.punchDetails}>
              <View style={styles.punchItem}>
                <Icon name="access-time" size={24} color="#ff0000" />
                <Text style={styles.punchText}>{checkInTime}</Text>
                <Text style={styles.punchLabel}>Check In</Text>
              </View>
              <View style={styles.punchItem}>
                <Icon name="access-time" size={24} color="#ff0000" />
                <Text style={styles.punchText}>{checkOutTime}</Text>
                <Text style={styles.punchLabel}>Check Out</Text>
              </View>
              <View style={styles.punchItem}>
                <Icon name="timer" size={24} color="#ff0000" />
                <Text style={styles.punchText}>00:00</Text>
                <Text style={styles.punchLabel}>Total Hours</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  btncontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },

  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.225,
    borderWidth: 1,
    borderColor: 'lightgrey',
    backgroundColor: 'lightgrey',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: '#fff',
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.175,
    backgroundColor: '#f7f7f7',
  },
  label: {
    marginTop: height * 0.01,
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000',
  },
  punchDetails: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-around',
    paddingVertical: height * 0.02,
    backgroundColor: Colors.white,
  },
  punchItem: {
    alignItems: 'center',
  },
  punchText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginTop: height * 0.005,
  },
  punchLabel: {
    fontSize: width * 0.03,
    color: '#888',
  },
});

export default HomeScreen;
