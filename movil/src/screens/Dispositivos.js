import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../theme.js';
import Formulario from '../components/dispositivos/formulario.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import conf from "../data/conf";

export function Dispositivos() {
  const [showModal, setShowModal] = useState(false);
  const [dispositivos, setDispositivos] = useState([]);
  const screenWidth = Dimensions.get('window').width;
  const deviceItemWidth = (screenWidth - 40 - 20) / 2;

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const actualizarDispositivos = async () => {
    await getDispositivos();
  };

  const getDispositivos = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');

      if (userDataJSON) {
        const userData = JSON.parse(userDataJSON);
        const id_usuario = userData.id_usuario;
        const formData = new FormData();
        formData.append("id_usuario", id_usuario);

        const response = await fetch(conf.url+"/dispositivos", {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setDispositivos(data.dispositivos);
      }
    } catch (error) {
      console.error("ERROR:", error.message);
    }
  };

  useEffect(() => {
    getDispositivos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ScrollView contentContainerStyle={styles.column}>
          {dispositivos.map((dispositivo, index) => (
            index % 2 === 0 && (
              <DeviceItem key={dispositivo.id_dispositivo} dispositivo={dispositivo} width={deviceItemWidth} />
            )
          ))}
        </ScrollView>
        <ScrollView contentContainerStyle={styles.column}>
          {dispositivos.map((dispositivo, index) => (
            index % 2 !== 0 && (
              <DeviceItem key={dispositivo.id_dispositivo} dispositivo={dispositivo} width={deviceItemWidth} />
            )
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.floatingButton} onPress={openModal}>
        <Icon name='plus' size={30} color={theme.colors.backgroundPrimary} />
      </TouchableOpacity>
      <Formulario visible={showModal} onClose={closeModal} actualizarDispositivos={actualizarDispositivos} />
    </View>
  );
}

const DeviceItem = ({ dispositivo, width }) => {
  return (
    <View style={[styles.deviceItem, styles.deviceItemMargin, { width: width }]}>
      <Text style={styles.deviceText}>Nombre: {dispositivo.nombre}</Text>
      <Text style={styles.deviceTextInfo}>MAC: {dispositivo.mac}</Text>
      <Text style={styles.deviceTextInfo}>Red: {dispositivo.ssid}</Text>
      <Text style={styles.deviceTextInfo}>Tipo: {dispositivo.tipo}</Text>
      <View style={styles.btnCenter}>
        <TouchableOpacity style={styles.button}>
          <Icon name='edit' size={20} color='white' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF0000' }]}
        >
          <Icon name='trash' size={20} color='white' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 15,
  },
  column: {
    flexDirection: 'column',
    flexGrow: 1,
  },
  deviceItem: {
    borderWidth: 3,
    borderColor: '#658C7A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  deviceItemMargin: {
    marginRight: 10,
    marginLeft: 10,
  },
  deviceText: {
    fontSize: 14,
    marginBottom: 5,
  },
  deviceTextInfo: {
    fontSize: 10,
    marginBottom: 5,
  },
  btnCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#ABBF15',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.button.success,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    zIndex: 10,
  },
});
