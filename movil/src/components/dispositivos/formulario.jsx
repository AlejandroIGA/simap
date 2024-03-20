import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal} from 'react-native';
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import conf from '../../data/conf';
import { useFocusEffect } from '@react-navigation/native';

const Formulario = ({ visible, onClose, actualizarDispositivos, dispositivoEditar }) => {
  const [nombre, setNombre] = useState('');
  const [direccionMac, setDireccionMac] = useState('');
  const [tipoDispositivo, setTipoDispositivo] = useState('esclavo');
  const [accion, setAccion] = useState('alta');
  const [nombreRed, setNombreRed] = useState('');
  const [psw, setPsw] = useState('');
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
    setNombreRed('');
    setPsw('');
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
      setNombreRed(dispositivoEditar.ssid);
      setPsw(dispositivoEditar.psw);
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
      getDispositivosMaestros();
      getCosechas();
    }
  }, [idUsuario]);

  // Dar de alta nuevo dispositivo
  const handleSubmit = async (props) => {

      if(tipoDispositivo === "maestro") {
        if (nombre.trim() === '' || direccionMac.trim() === '' || nombreRed.trim() === '' || psw.trim() === '') {
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
          alert('La dirección MAC debe tener exactamente 12 caracteres.');
          return;
        }
        if (nombreRed.trim().length < 5) {
          alert('El nombre de la red debe tener mínimo 5 caracteres.');
          return;
        }
        if (psw.trim().length < 8) {
          alert('La contraseña debe tener mínimo 8 caracteres.');
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
          if (direccionMac.trim().length != 12) {
            alert('La dirección MAC debe tener exactamente 12 caracteres.');
            return;
          }
        
      }
  
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('mac', direccionMac);
      formData.append('ssid', nombreRed);
      formData.append('psw', psw);
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
      if (nombre.trim() === '' || direccionMac.trim() === '' || nombreRed.trim() === '' || psw.trim() === '' || idCosecha.trim() === '') {
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
    formData.append('ssid', nombreRed);
    formData.append('psw', psw);
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
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={dispositivoMaestro}
            onValueChange={(itemValue) => {
              setDispositivoMaestro(itemValue);
              const dispositivoMaestroSeleccionado = dispositivosMaestros.find(dispositivo => dispositivo.id_dispositivo === itemValue);
              if (dispositivoMaestroSeleccionado) {
                setNombreRed(dispositivoMaestroSeleccionado.ssid);
                setPsw(dispositivoMaestroSeleccionado.psw);
                setIdCosecha(dispositivoMaestroSeleccionado.id_cosecha);
              } else {
                setNombreRed('');
                setPsw('');
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
  pickerContainer: {
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 30,
  },
  input: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
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
