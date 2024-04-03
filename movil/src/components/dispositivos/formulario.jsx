import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Platform} from 'react-native';
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import conf from '../../data/conf';
import { useFocusEffect } from '@react-navigation/native';

const Formulario = ({ visible, onClose, actualizarDispositivos, dispositivoEditar }) => {
  const [nombre, setNombre] = useState('');
  const [direccionMac, setDireccionMac] = useState('');
  const [tipoDispositivo, setTipoDispositivo] = useState('esclavo');
  const [accion, setAccion] = useState('alta');
  const [idCosecha, setIdCosecha] = useState(0);
  const [dispositivoMaestro, setDispositivoMaestro] = useState('');
  const [dispositivosMaestros, setDispositivosMaestros] = useState([]);
  const [cosechas, setCosechas] = useState([]);
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [idUsuario, setIdUsuario] = useState(0);
  const [idDispositivo, setIdDispositivo] = useState(0);

  // LIMPIAR CAMPODS DEL FORMULARIO
  const limpiarCampos = () => {
    setNombre('');
    setDireccionMac('');
    setDispositivoMaestro('');
    setIdDispositivo(0);
    setIdCosecha(0);
  }

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

  // Obtener dispositivos maestros 
  const getDispositivosMaestros = async () => {
    const formData = new FormData();
    formData.append('id_usuario', idUsuario);

    try {
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

  // Obtener cosechas
  const getCosechas = async () => {
    const formData = new FormData();
    formData.append('id_usuario', idUsuario);

    try {
      const response = await fetch(conf.url + '/getCultivos', {
        method: 'POST',
        body: formData,
      });

      const dataResponse = await response.json();
      setCosechas(dataResponse.data);
    } catch (error) {
      console.error('Error al obtener dispositivos maestros del usuario :' + idUsuario + error);
    }
  };

  useEffect(() => {
    getUserData();
    if (dispositivoEditar) {
      setNombre(dispositivoEditar.nombre);
      setDireccionMac(dispositivoEditar.mac);
      setTipoDispositivo(dispositivoEditar.tipo);
      setDispositivoMaestro(dispositivoEditar.maestro === null ? ' ' : dispositivoEditar.maestro);
      setIdDispositivo(dispositivoEditar.id_dispositivo);
      setIdCosecha(dispositivoEditar.id_cosecha);
      setAccion('editar');
    }
  }, [dispositivoEditar]);

  useFocusEffect(
    React.useCallback(() => {
      getCosechas();
      console.log('use focus');
    }, [])
  );

  useEffect(() => {
    if (idUsuario !== 0) {
      const intervalId = setInterval(() => {
        getDispositivosMaestros();
        getCosechas();
      }, 60000);
      getDispositivosMaestros();
      getCosechas();
  
      return () => clearInterval(intervalId);
    }
  }, [idUsuario]); 
  

  // Dar de alta nuevo dispositivo
  const handleSubmit = async (props) => {

      if(tipoDispositivo === "maestro") {
        if (nombre.trim() === '' || direccionMac.trim() === '') {
          alert('Por favor completa todos los campos.');
          return;
        }
        if (idCosecha.trim() === '') {
          alert('Debe dar de alta una cosecha o seleccionar una existente.');
          return;
        }
        if (nombre.trim().length < 5) {
          alert('El nombre debe tener mínimo 5 caracteres.');
          return;
        }
        if (direccionMac.trim().length > 12 || direccionMac.trim().length < 8) {
          alert('La dirección MAC debe tener entre 8 y 12 caracteres.');
          return;
        }
      } else if(tipoDispositivo === "esclavo") {
          if (nombre.trim() === '' || direccionMac.trim() === '') {
            alert('Por favor completa todos los campos.');
            return;
          }
          if (dispositivoMaestro.trim()  === '') {
            alert('Debe seleccionar un dispositivo maestro o dar uno de alta.');
            return;
          }
          if (nombre.trim().length < 5) {
            alert('El nombre debe tener mínimo 5 caracteres.');
            return;
          }
          if (direccionMac.trim().length > 12 || direccionMac.trim().length < 8) {
            alert('La dirección MAC debe tener entre 8 y 12 caracteres.');
            return;
          }
        
      }
  
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('mac', direccionMac);
      formData.append('tipo', tipoDispositivo);
      formData.append('maestro', dispositivoMaestro);
      formData.append('id_usuario', idUsuario);
      formData.append('id_cosecha', idCosecha);
  
      try {
        const response = await fetch(conf.url + '/nuevoDispositivo', {
          method: 'POST',
          body: formData,
        });
  
        const dataResponse = await response.json();
        //primero comprobar que tengo algo en data, si no, ya se que no se inserto dispositivo
  
          if (dataResponse.resultado && dataResponse.id_dispositivo > '0') {
            alert(dataResponse.mensaje);
          } else {
            alert(dataResponse.mensaje);
          }
      } catch (error) {
        console.error('Error al insetrtar dispositivo:', error);
        alert('Error agregar dispositivo. Por favor, inténtalo de nuevo.');
      }
      props.onClose();
      props.actualizarDispositivos();
      getDispositivosMaestros();
      limpiarCampos();

    
  };
  
  // Editar dispositivo
  const handleEdit = async (props) => {

    if(tipoDispositivo === "maestro") {
      if (nombre.trim() === '' || direccionMac.trim() === '' || idCosecha.trim() === '') {
        alert('Por favor completa todos los campos.');
        return;
      }
    } else if(tipoDispositivo === "esclavo") {
      if (nombre.trim() === '' || direccionMac.trim() === '' || dispositivoMaestro.trim()  === '' ) {
        alert('Por favor completa todos los campos.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('mac', direccionMac);
    formData.append('tipo', tipoDispositivo);
    formData.append('maestro', dispositivoMaestro);
    formData.append('id_usuario', idUsuario);
    formData.append('id_dispositivo', idDispositivo);
    formData.append('id_cosecha', idCosecha);

    try {
      const response = await fetch(conf.url + '/editarDispositivo', {
        method: 'POST',
        body: formData,
      });

      const dataResponse = await response.json();

        if (dataResponse.resultado && dataResponse.id_dispositivo > '0') {
          alert(dataResponse.mensaje);
        } else {
          alert(dataResponse.mensaje);
        }
    } catch (error) {
      alert('Error al editar dispositivo. Por favor, inténtalo de nuevo.');
    }
    props.onClose();
    props.actualizarDispositivos();
    getDispositivosMaestros();
    limpiarCampos();
  };


  const closeModal = async (props) => {
    props.onClose();
    limpiarCampos();
    setAccion('alta');
  };

  const renderFields = () => {
    if (tipoDispositivo === 'maestro') {
      return (
        <>
          <Text style={styles.text}>Cosecha</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={idCosecha}
              onValueChange={(itemValue) => {
                setIdCosecha(itemValue);
              }}>
                <Picker.Item label="Seleccione una cosecha" value={''} />
                {cosechas != null ? (
                  cosechas.map((cosecha) => (
                  <Picker.Item key={cosecha.id_cosecha} label={cosecha.nombre} value={cosecha.id_cosecha} />
                ))
              ) : (
                <Picker.Item label="No hay cosechas dadas de alta" value="" />
              )}
            </Picker>
          </View>
        </>
      );
    } else if (tipoDispositivo === "esclavo") {
      return (
        <>
        <Text style={styles.text}>Dispositivo Maestro</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={dispositivoMaestro}
            onValueChange={(itemValue) => {
              setDispositivoMaestro(itemValue);
              const dispositivoMaestroSeleccionado = dispositivosMaestros.find(dispositivo => dispositivo.id_dispositivo === itemValue);
              if (dispositivoMaestroSeleccionado) {
                setIdCosecha(dispositivoMaestroSeleccionado.id_cosecha);
              } else {
                setIdCosecha(0);
              }
            }}>
              <Picker.Item label="Seleccione un dispositivo maestro" value={''} />
              {dispositivosMaestros != null ? (
                dispositivosMaestros.map((dispositivo) => (
                <Picker.Item key={dispositivo.id_dispositivo} label={dispositivo.nombre} value={dispositivo.id_dispositivo} />
              ))
            ) : (
              <Picker.Item label="No hay dispositivos maestros dados de alta" value="" />
            )}
          </Picker>
        </View>
        </>
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose} onTouchOutside={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {
            accion === "alta" ? (
              <Text style={styles.title}>Agregar dispositivo</Text>
            ) : (
              <Text style={styles.title}>Editar dispositivo</Text>
            )
          }
          
          {(tipoUsuario === 'propietario') &&
            <Text style={styles.text}>Tipo de dispositivo</Text>
          }
          {(tipoUsuario === 'propietario') &&
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={tipoDispositivo}
                onValueChange={(itemValue) => setTipoDispositivo(itemValue)}>
                <Picker.Item label="Dispositivo Maestro" value="maestro" />
                <Picker.Item label="Dispositivo Esclavo" value="esclavo" />
              </Picker>
            </View>
          }

          <Text style={styles.text}>Nombre de dispositivo</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del dispositivo"
            value={nombre}
            onChangeText={setNombre}
          />
          <Text style={styles.text}>Dirección MAC</Text>
          <TextInput
            style={styles.input}
            placeholder="Dirección MAC"
            value={direccionMac}
            onChangeText={text => setDireccionMac(text.toUpperCase())}
          />
          {renderFields()}
          {
            accion === "alta" ? (
              <TouchableOpacity style={styles.button} onPress={() => handleSubmit({ onClose, actualizarDispositivos })}>
                <Text style={styles.buttonText}>Añadir</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={() => handleEdit({ onClose, actualizarDispositivos })}>
                <Text style={styles.buttonText}>Confirmar cambios</Text>
              </TouchableOpacity>
            )
          }
          <TouchableOpacity style={styles.buttonClose} onPress={() => closeModal({onClose})}>
            <Text style={styles.buttonText}>Cancelar</Text>
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
    overflow: Platform.OS === 'hidden' ? 60 : '',
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
});

export default Formulario;
