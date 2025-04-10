import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import Colors from '../../colors/Color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Offline = () => {




  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="wifi-off"
        size={100}
        color={Colors.primary}
        style={styles.icon}
      />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.message}>
        Please check your internet connection and try again.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});

export default Offline;