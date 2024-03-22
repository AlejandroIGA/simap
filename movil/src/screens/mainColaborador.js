import React, { useState, useEffect } from 'react';
import conf from '../data/conf';
import { useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

const MainColaborador = () => {
  const [dispositivos, setDispositivos] = useState([]);
  const [mostrarTarjeta, setMostrarTarjeta] = useState(false);

  const getDatos = async () => {
    try {
      const userDataJson = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userDataJson);
      const id_usuario = userData.id_usuario;
      const formData = new FormData();
      formData.append('id_usuario', id_usuario);

      const response = await fetch(conf.url + '/datosDispositivo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del dispositivo');
      }

      const dataResponse = await response.json();
      setDispositivos(dataResponse['Datos del Dispositivo']);
      setMostrarTarjeta(
        dataResponse['Datos del Dispositivo'] !== null &&
          dataResponse['Datos del Dispositivo'].length > 0
      );
    } catch (error) {
      console.error('Error al obtener los datos del dispositivo:', error);
    }
  };

  //Manda a llamar a un metodo cuando se hace navegación por el menú
  useFocusEffect(
    React.useCallback(() => {
      getDatos();
      console.log('use focus');
    }, [])
  );

  useEffect(() => {
    if (dispositivos && dispositivos.length > 0) {
      setMostrarTarjeta(true);
    } else {
      setMostrarTarjeta(false);
    }
  }, [dispositivos]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.textLogin}>Información del cultivo</Text>
          {mostrarTarjeta && dispositivos ? (
            dispositivos.map((dispositivo, index) => (
              <View style={styles.formContainer} key={index}>
                <Text style={styles.label}>Dispositivo {index + 1}</Text>
                <Text style={styles.label}>Mac: {dispositivo.mac}</Text>
                <Text style={styles.label}>
                  Nombre de red: {dispositivo.ssid}
                </Text>
                <Text style={styles.label}>Cultivo: {dispositivo.nombre}</Text>
                <Text style={styles.label}>Temperatura: {}</Text>
                <Text style={styles.label}>Humedad/suelo: {}</Text>
                <Text style={styles.label}>Humedad/ambiente: {}</Text>
              </View>
            ))
          ) : (
            <Text>No se encontraron dispositivos</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    backgroundColor: '#658C7A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownButton: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 18,
    color: '#ABBF15',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    marginTop: 30,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#ABBF15',
    borderRadius: 10,
    padding: 10,
    width: 300,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  textLogin: {
    color: 'black',
    fontSize: 26,
    marginBottom: 20,
  },
});

export default MainColaborador;
