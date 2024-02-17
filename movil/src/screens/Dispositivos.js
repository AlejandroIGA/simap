import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../theme.js';
import Formulario from '../components/dispositivos/formulario.jsx';

export function Dispositivos() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <DeviceItem />
          <DeviceItem />
        </View>
        <View style={styles.row}>
          <DeviceItem />
          <DeviceItem />
        </View>
        <View style={styles.row}>
          <DeviceItem />
          <DeviceItem />
        </View>
        <View style={styles.row}>
          <DeviceItem />
          <DeviceItem />
        </View>
        <View style={styles.row}>
          <DeviceItem />
          <DeviceItem />
        </View>
        <View style={styles.row}>
          <DeviceItem />
          <DeviceItem />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton} onPress={openModal}>
        <Icon name='plus' size={30} color={theme.colors.backgroundPrimary} />
      </TouchableOpacity>
      <Formulario visible={showModal} onClose={closeModal} />
    </View>
  );
}

const DeviceItem = () => {
  return (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceText}>Dispositivo 1</Text>
      <Text style={styles.deviceTextInfo}>XXXX-XXXX-XXXX-XXXX</Text>
      <Text style={styles.deviceTextInfo}>Nombre Red</Text>
      <Text style={styles.deviceTextInfo}>Tipo dispositivo</Text>
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
  scrollContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deviceItem: {
    borderWidth: 3,
    borderColor: '#658C7A',
    borderRadius: 10,
    padding: 10,
    width: '48%',
  },
  deviceText: {
    fontSize: 18,
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
