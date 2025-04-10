import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import Colors from '../../colors/Color';

const notifications = [
  { id: '1', title: 'New Update Available', message: 'Version 2.0 is now live!' },
  { id: '2', title: 'Meeting Reminder', message: 'Team meeting at 3 PM today.' },
  { id: '3', title: 'Holiday Announcement', message: 'Office will be closed on Friday.' },
];

const NotificationScreen = () => {
  const renderNotification = ({ item }: { item: { title: string; message: string } }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.Maincontainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Notifications</Text>
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.darkGrey,
  },
});
