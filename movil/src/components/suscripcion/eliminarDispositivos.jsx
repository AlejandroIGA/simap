import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Platform, ScrollView} from 'react-native';
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import conf from '../../data/conf';
import { useFocusEffect } from '@react-navigation/native';

const EliminarDispositivos = ({ visible, onClose}) => {
  const [dispositivos, setDispositivos] = useState([]);
  const [dispositivosEsclavo, setDispositivosEsclavo] = useState([]);
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [idUsuario, setIdUsuario] = useState(0);
  const [selectedDispositivos, setSelectedDispositivos] = useState([]);
  const [selectedDispositivosEsclavo, setSelectedDispositivosEsclavo] = useState([]);

  // Función para manejar la selección de dispositivos
  const handleDeviceSelection = (id_dispositivo) => {
    setSelectedDispositivos((prevSelected) => {
      if (prevSelected.includes(id_dispositivo)) {
        return prevSelected.filter((id) => id !== id_dispositivo);
      } else {
        return [...prevSelected, id_dispositivo];
      }
    });
  };

  const handleDeviceSelectionEsclavo = (id_dispositivo) => {
    setSelectedDispositivosEsclavo((prevSelected) => {
      if (prevSelected.includes(id_dispositivo)) {
        return prevSelected.filter((id) => id !== id_dispositivo);
      } else {
        return [...prevSelected, id_dispositivo];
      }
    });
  };


  const getUserData = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');
      if (userDataJSON) {
        const userData = JSON.parse(userDataJSON);
        const tipo = userData.tipo_usuario;
        const id_usuario = userData.id_usuario;
        setTipoUsuario(tipo);
        setIdUsuario(id_usuario);
      }
    } catch (error) {
      console.log(error);
    }
  };

     //OBTENER TODOS LOS DISPOSITIVOS DEL USUARIO
  const getDispositivosMaestro = async () => {
    try {
        const userDataString = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        let id_usuario = userData.id_usuario;
        const formData = new FormData();
        formData.append('id_usuario', id_usuario);

        const response = await fetch(conf.url + '/dispositivosMaestrosSuscripcion', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDispositivos(data.dispositivosMaestro);
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  };

  const getDispositivosEsclavo = async () => {
    try {
        const userDataString = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        let id_usuario = userData.id_usuario;
        const formData = new FormData();
        formData.append('id_usuario', id_usuario);

        const response = await fetch(conf.url + '/dispositivosEsclavosSuscripcion', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDispositivosEsclavo(data.dispositivosEsclavo);
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  };

  useEffect(() => {
    getUserData();
    getDispositivosMaestro();
    getDispositivosEsclavo();
  }, []);

  const handleSubmit = async () => {
    try {
      //ELIMINAR DISPOSITIVOS MAESTRO SELECCIONADOS
      for (const id_dispositivo of selectedDispositivos) {
        const formData = new FormData();
        formData.append('id_dispositivo', id_dispositivo);

        const response = await fetch(conf.url + '/borrarDispositivoSuscripcion', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log(data.mensaje);
      }

      //ELIMINAR DISPOSITIVOS ESCLAVO SELECCIONADOS
      for (const id_dispositivo of selectedDispositivosEsclavo) {
        const formData = new FormData();
        formData.append('id_dispositivo', id_dispositivo);

        const response = await fetch(conf.url + '/borrarDispositivoSuscripcion', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        alert(data.mensaje);
        console.log(data.mensaje);
      }
      
      console.log("Eliminar los: " + selectedDispositivos);
      alert("Dispositivos eliminados exitosamente");
      onClose();
    } catch (error) {
      console.error('Error al eliminar dispositivos:', error);
      alert('Error al eliminar dispositivos. Por favor, inténtalo de nuevo.');
    }
  };

  const closeModal = async (props) => {
    props.onClose();
  };


  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose} onTouchOutside={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

          <Text style={styles.title}>Tu suscripción ha caducado</Text> 
          {
            dispositivos && dispositivos.length > 1 ? (
              <>
                <Text style={styles.text}>Tienes que eliminar ({dispositivos.length - selectedDispositivos.length - 1}) dispositivos maestro </Text>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                  {dispositivos.map(dispositivo => (
                    <TouchableOpacity key={dispositivo.id_dispositivo} style={styles.itemContainer} onPress={() => handleDeviceSelection(dispositivo.id_dispositivo)}>
                      <View style={styles.checkboxContainer}>
                        <Text style={styles.checkbox}>{selectedDispositivos.includes(dispositivo.id_dispositivo) ? '✓' : ''}</Text>
                      </View>
                      <Text style={styles.deviceName}>{dispositivo.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <>
              </>
            )
          }
          {
            dispositivosEsclavo && dispositivosEsclavo.length > 2 ? (
              <>
                <Text style={styles.text}>Tienes que eliminar ({dispositivosEsclavo.length - selectedDispositivosEsclavo.length - 2}) dispositivos esclavo</Text>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                  {dispositivosEsclavo.map(dispositivo => (
                    <TouchableOpacity key={dispositivo.id_dispositivo} style={styles.itemContainer} onPress={() => handleDeviceSelectionEsclavo(dispositivo.id_dispositivo)}>
                      <View style={styles.checkboxContainer}>
                        <Text style={styles.checkbox}>{selectedDispositivosEsclavo.includes(dispositivo.id_dispositivo) ? '✓' : ''}</Text>
                      </View>
                      <Text style={styles.deviceName}>{dispositivo.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <>
              </>
            )
          }

          {dispositivos && dispositivos.length !== 0 && dispositivosEsclavo && dispositivosEsclavo.length !== 0 && (
            <TouchableOpacity disabled={dispositivos.length - selectedDispositivos.length !== 1 || dispositivosEsclavo.length - selectedDispositivosEsclavo.length !== 2} style={styles.button} onPress={() => handleSubmit({ onClose })} >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          )}
          {dispositivos && dispositivos.length !== 0 && dispositivosEsclavo&& dispositivosEsclavo.length === 0 && (
            <TouchableOpacity disabled={dispositivos.length - selectedDispositivos.length !== 1 } style={styles.button} onPress={() => handleSubmit({ onClose })} >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          )}
          {dispositivos && dispositivos.length === 0 && dispositivosEsclavo && dispositivosEsclavo.length !== 0 && (
              <TouchableOpacity disabled={dispositivosEsclavo.length - selectedDispositivosEsclavo.length !== 2} style={styles.button} onPress={() => handleSubmit({ onClose })} >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
          )}
          

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: '#658C7A',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 300,
    borderColor: "black",
    borderWidth: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  text: {
    fontSize: 15,
    marginBottom: 5,
    textAlign: "left",
    color: "white",
  },
  pickerContainer: {
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: Platform.OS === 'ios' ? 60 : 30,
    justifyContent: 'center'
  },
  input: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    height: 30,
    paddingLeft: 15
  },
  button: {
    backgroundColor: '#ABBF15',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 25,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    fontSize: 20,
  },
  deviceName: {
    fontSize: 16,
    color: 'white',
  },
});

export default EliminarDispositivos;
