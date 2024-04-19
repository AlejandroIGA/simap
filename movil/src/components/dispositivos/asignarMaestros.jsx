import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import {Picker} from "@react-native-picker/picker";
import conf from '../../data/conf';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AsignarMaestros ({ visible, onClose }) {
  const [dispositivos, setDispositivos] = useState([]);
  const [dispositivosMaestros, setDispositivosMaestros] = useState([]);
  const [maestro, setMaestro] = useState(0);
  const [id_cosecha, setCosecha] = useState(0);
  const [idUsuario, setIdUsuario] = useState(0);
  const [selectedValue, setSelectedValue] = useState(0);


  const getDatos = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString !== null) {
        const userData = JSON.parse(userDataString);
        setIdUsuario(userData.id_usuario);
      } 
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
    }
  };

  const asignarMaestros = async () => {
    try {
        const userDataString = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        let id_usuario = userData.id_usuario;

        const formData = new FormData();
        formData.append('id_usuario', id_usuario);

        const response = await fetch(conf.url + '/dispositivosSinMaestro', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log("Disp: " +  JSON.stringify(data.dispositivos));
        setDispositivos(data.dispositivos);
      
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  }

  const getDispositivosMaestros = async () => {

    try {
      const userDataString = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userDataString);
      let id_usuario = userData.id_usuario;
      const formData = new FormData();
      formData.append('id_usuario', id_usuario);

      const response = await fetch(conf.url + '/dispositivosMaestros', {
        method: 'POST',
        body: formData,
      });

      const dataResponse = await response.json();
      setDispositivosMaestros(dataResponse.dispositivosMaestro);
    } catch (error) {
      console.error('Error al obtener dispositivos maestros del usuario :' + idUsuario + error);
    }
  };

  useEffect(() => {
    asignarMaestros();
    getDispositivosMaestros();
    getDatos();
  }, []);

  const handleSubmit = async () => {
    try {
      //ACTUALIZAR DISPOSITIVOS DE MAESTROS
        const dispositivosJSON = JSON.stringify(dispositivos);
        const formData = new FormData();
        formData.append('maestro', maestro);
        formData.append('id_cosecha', id_cosecha);
        formData.append('dispositivos', dispositivosJSON);

        const response = await fetch(conf.url + '/actualizarMaestroDispositivo', {
          method: 'POST',
          body: formData,
        });

        const dataResponse = await response.json();
        alert(dataResponse.mensaje);
        onClose();
    } catch (error) {
      console.error('Error al actualizar dispositivos:', error);
      alert('Error al actualizar dispositivos. Por favor, inténtalo de nuevo.');
    }
  };

  const closeModal = async () => {
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" >
      <View style={styles.Container}>
        <View style={styles.Content}>
        <Text style={styles.title}>Dispositivos sin Maestro asignado</Text>
        {dispositivos !== null ? (
          <View>
            <Text>Debes asignar un dispositivo maestro a los siguientes dispositivos:</Text>
            <ScrollView>
              {dispositivos.map((dispositivo, index) => (
                <View key={index} style={styles.deviceContainer}>
                  <Text>
                    Nombre: {dispositivo.nombre}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <Picker
              style={styles.Picker}
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) => {
                let maestro = dispositivosMaestros.find(maestro => maestro.id_dispositivo === itemValue);
                if (maestro) {
                  setMaestro(maestro.id_dispositivo);
                  setCosecha(maestro.id_cosecha);
                  setSelectedValue(itemValue);
                }
              }}
            >
              <Picker.Item label='Seleccione el Dispositivo' value={0}/>
              {dispositivosMaestros.map((maestro, index) => (
                <Picker.Item
                  key={index}
                  label={maestro.nombre}
                  value={maestro.id_dispositivo}
                />
              ))}
            </Picker>
          </View>
        ) : (
          <Text>No hay dispositivos sin maestro asignado.</Text>
        )}
        <TouchableOpacity
          disabled={maestro === 0}
          onPress={handleSubmit}
          style={[
            styles.confirmButton,
            { backgroundColor: maestro === 0 ? 'gray' : 'green' },
          ]}
        >
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  Content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 300,
    borderColor: "black",
    borderWidth: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceContainer: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 5,
    padding: 10,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  confirmButtonText: {
    color: 'white',
  },
  Picker: {
    height: Platform.OS === 'ios' ? 100 : 30,
    overflow: 'hidden',
    justifyContent: 'center'
  },
});

export default AsignarMaestros;