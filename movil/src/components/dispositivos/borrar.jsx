import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const Borrar = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.text}>¿Eliminar el dispositivo?</Text>
          <View style={styles.separator} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => onClose(true)}>
              <Text style={styles.buttonText}>Sí</Text>
            </TouchableOpacity>
            <View style={styles.separatorVertical} />
            <TouchableOpacity style={styles.button} onPress={() => onClose(false)}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'black',
    borderRadius: 10,
    width: '80%',
    maxWidth: 300,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    marginTop: 20,
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  button: {
    flex: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  separatorVertical: {
    width: 1,
    height: '100%',
    backgroundColor: 'white',
  },
});

export default Borrar;
