import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import conf from '../data/conf';

export function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);

  //OBTENER NOTIFICACIONES
  const getNotificaciones = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');

      if (userDataJSON) {
        const userData = JSON.parse(userDataJSON);
        const id_usuario = userData.id_usuario;
        const formData = new FormData();
        formData.append('id_usuario', id_usuario);

        const response = await fetch(conf.url + '/notificaciones', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setNotificaciones(data.notificaciones);
      }
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  };

  //ELIMINAR DISPOSITIVO
  const deleteNotificacion = async (id_notificacion) => {
    try {
      const formData = new FormData();
      formData.append('id_notificacion', id_notificacion);

      const response = await fetch(conf.url + '/borrarNotificacion', {
        method: 'POST',
        body: formData,
      });

      const dataResponse = await response.json();
      alert(dataResponse.mensaje);

      getNotificaciones();
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  };

  //Manda a llamar a un metodo cuando se hace navegación por el menú
  useFocusEffect(
    React.useCallback(() => {
      getNotificaciones();
      console.log('use focus');
    }, [])
  );

  useEffect(() => {
    getNotificaciones();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      <ScrollView style={styles.scrollView}>
        {notificaciones != null ? (
          notificaciones &&
          notificaciones.map((notificacion, index) => (
            <Notification
              key={notificacion.id_notificacion}
              onDelete={deleteNotificacion}
              notificacion={notificacion}
            />
          ))
        ) : (
          <Text style={styles.noDevicesText}>No hay ninguna notificación</Text>
        )}
      </ScrollView>
    </View>
  );
}

const Notification = ({ notificacion, onDelete }) => {
  const handleDelete = () => {
    onDelete(notificacion.id_notificacion);
  };

  return (
    <View style={styles.notification}>
      <View style={styles.notificationHeader}>
        <View>
          <Text style={styles.notificationData}>
            Fecha: {notificacion.fecha}{' '}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleDelete}
          style={[styles.button, { backgroundColor: '#FF0000' }]}
        >
          <Icon name='trash' size={20} color='white' />
        </TouchableOpacity>
      </View>
      <View style={styles.notificationData}>
        <Text>{notificacion.informacion}</Text>
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
  noDevicesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
