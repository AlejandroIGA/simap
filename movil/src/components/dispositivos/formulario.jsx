import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal} from 'react-native';
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import conf from '../../data/conf';

const Formulario = ({ visible, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [direccionMac, setDireccionMac] = useState('');
  const [tipoDispositivo, setTipoDispositivo] = useState('esclavo');
  const [nombreRed, setNombreRed] = useState('');
  const [psw, setPsw] = useState('');
  const [dispositivoMaestro, setDispositivoMaestro] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [idUsuario, setIdUsuario] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataJSON = await AsyncStorage.getItem('userData');
        if (userDataJSON) {
          const userData = JSON.parse(userDataJSON);
          const tipo = userData.tipo;
          const id_usuario = userData.id_usuario;
          setTipoUsuario(tipo);
          setIdUsuario(id_usuario);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('mac', direccionMac);
    formData.append('ssid', nombreRed);
    formData.append('psw', psw);
    formData.append('tipo', tipoDispositivo);
    formData.append('maestro', dispositivoMaestro);
    formData.append('id_usuario', idUsuario);

    try {
      const response = await fetch(conf.url + '/nuevoDispositivo', {
        method: 'POST',
        body: formData,
      });

      const dataResponse = await response.json();
      console.log(dataResponse);
      //primero comprobar que tengo algo en data, si no, ya se que no se inserto dispositivo

        if (dataResponse.resultado && dataResponse.id_dispositivo > '0') {
          alert(dataResponse.mensaje);
          console.log('Id dispositivo ingresado:', dataResponse.id_dispositivo);
        } else {
          alert(dataResponse.mensaje);
        }
    } catch (error) {
      console.error('Error al insetrtar dispositivo:', error);
      alert('Error agregar dispositivo. Por favor, inténtalo de nuevo.');
    }

    onClose();
  };

  const renderFields = () => {
    if (tipoDispositivo === 'maestro') {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre de red"
            value={nombreRed}
            onChangeText={setNombreRed}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={psw}
            onChangeText={setPsw}
          />
        </>
      );
    } else if (tipoDispositivo === "esclavo") {
      return (
        <TextInput
          style={styles.input}
          placeholder="Dispositivo Maestro"
          value={dispositivoMaestro}
          onChangeText={setDispositivoMaestro}
        />
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Agregar dispositivo</Text>

          {(tipoUsuario === 'administrador') &&
            <Picker
              style={[styles.picker, styles.input]}
              selectedValue={tipoDispositivo}
              onValueChange={(itemValue) => setTipoDispositivo(itemValue)}>
              <Picker.Item label="Dispositivo Maestro" value="maestro" />
              <Picker.Item label="Dispositivo Esclavo" value="esclavo" />
            </Picker>
          }

          <TextInput
            style={styles.input}
            placeholder="Nombre del dispositivo"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección MAC"
            value={direccionMac}
            onChangeText={setDireccionMac}
          />
          {renderFields()}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Añadir</Text>
          </TouchableOpacity>
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
  picker: {
    marginBottom: 20,
    backgroundColor: "white",
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ABBF15',
    padding: 10,
    borderRadius: 5,
    marginBottom: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Formulario;
