import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export function Notificaciones() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      <ScrollView style={styles.scrollView}>
        <Notification/>
        <Notification/>
        <Notification/>
        <Notification/>
        <Notification/>
        <Notification/>
        <Notification/>
        <Notification/>
        <Notification/>
        <Notification/>
      </ScrollView>
    </View>
  );
}

const Notification = () => {
    return (
        <View style={styles.notification}>
        <View style={styles.notificationHeader}>
          <View>
            <Text style={styles.notificationTitle}>Notificación 1</Text>
            <Text style={styles.notificationData}>08/02/2024</Text>
          </View>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#FF0000' }]}>
          <Icon name="trash" size={20} color="white" />
        </TouchableOpacity>
        </View>
        <View style={styles.notificationData}>
          <Text>Información de la notificación</Text>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  notification: {
    borderWidth: 3,
    borderColor: '#658C7A',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationTitle: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  notificationData: {
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#ABBF15',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
});
