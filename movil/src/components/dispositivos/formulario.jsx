import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal} from 'react-native';
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Formulario = ({ visible, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [direccionMac, setDireccionMac] = useState('');
  const [tipoDispositivo, setTipoDispositivo] = useState('esclavo');
  const [nombreRed, setNombreRed] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [dispositivoMaestro, setDispositivoMaestro] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataJSON = await AsyncStorage.getItem('userData');
        if (userDataJSON) {
          const userData = JSON.parse(userDataJSON);
          const tipo = userData.tipo_usuario;
          setTipoUsuario(tipo);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, []);

  const handleSubmit = () => {
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
            value={contrasena}
            onChangeText={setContrasena}
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
              style={[styles.picker, styles.input]} // Merge styles
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
