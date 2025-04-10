import React, {useEffect, useMemo, useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import moment from 'moment';
const Clock = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  const getCurrentDate = (): string => {
    return moment().format('MMM DD, YYYY - dddd');
  };
  const currentDate = useMemo(() => {
    return getCurrentDate();
  }, []);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const momentTime = moment().format('LT');
        // console.error('momentTime', momentTime);
        setCurrentTime(momentTime);
      } catch (error) {
        console.log('Error fetching time:', error);
      }
    };

    fetchTime();
    const interval = setInterval(fetchTime, 1000); // Update  every minute

    return () => clearInterval(interval);
  }, []);

  // const getCurrentTimeIn12HourFormat = (): string => {
  //   return moment().format('hh:mm A');
  // };

  return (
    <View style={styles.timeSection}>
      <Text style={styles.time}>{currentTime}</Text>
      <Text style={styles.date}>{currentDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timeSection: {
    alignItems: 'center',
    marginTop: -50,
  },
  time: {
    fontSize: 48,
    fontWeight: 'thin',
  },
  date: {
    fontSize: 16,
    color: '#888',
  },
});

export default Clock;
