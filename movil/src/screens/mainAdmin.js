import React, { useState, useEffect } from 'react';
import conf from '../data/conf';
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
  const [conectado, setConectado] = useState(false);
  const [conectadoBomb, setConectadoBomb] = useState(false);
  const [tarjeta, setTarjeta] = useState(false);

  const handleColor = () => {
    setConectado(!conectado);
  };

  const handleColorBomb = () => {
    setConectadoBomb(!conectadoBomb);
  };

  const getDatos = async () => {
    try {
      const userDataJson = await AsyncStorage.getItem("userData");
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
      setTarjeta(dataResponse['Datos del Dispositivo'] !== null && dataResponse['Datos del Dispositivo'].length > 0);
      console.log(dataResponse);
    } catch (error) {
      console.error('Error al obtener los datos del dispositivo:', error);
    }
  };
  
  useEffect(() => {
    getDatos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getDatos();
    }, 20000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.mainText}>Información del cultivo</Text>
          {tarjeta && dispositivos && dispositivos.length > 0 ? (
            <View style={styles.formContainer}>
              {dispositivos.map((dispositivo, index) => (
                <View style={styles.column} key={index}>
                  <Text>Master {index + 1}</Text>
                  <Text>Mac: {dispositivo.mac}</Text>
                  <Text>Nombre de red: {dispositivo.ssid}</Text>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { backgroundColor: conectado ? 'red' : '#ABBF15' },
                    ]}
                    onPress={handleColor}
                  >
                    <Text style={styles.buttonText}>
                      {conectado ? 'Desconectar' : 'Conectar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.column}>
                <Text style={{ textAlign: 'center' }}>Estado de bomba</Text>
                <Image
                  source={require('../../assets/bomba.png')}
                  style={styles.image}
                />
                <TouchableOpacity
                  style={[
                    styles.buttonBomb,
                    { backgroundColor: conectadoBomb ? 'red' : '#ABBF15' },
                  ]}
                  onPress={handleColorBomb}
                >
                  <Text style={styles.buttonText}>
                    {conectadoBomb ? 'Apagar' : 'Prender'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    marginHorizontal: 50,
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
    width: 350,
    marginBottom: 20,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  mainText: {
    color: 'black',
    fontSize: 26,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    width: 120,
  },
  buttonBomb: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    width: 100,
    marginLeft: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MainColaborador;
