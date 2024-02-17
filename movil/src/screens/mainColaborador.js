import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

const MainColaborador = () => {
  const [conectado, setConectado] = useState(false);

  const handleColor = () => {
    setConectado(!conectado);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.textLogin}>Información del cultivo</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Dispositivo 1</Text>
            <Text style={styles.label}>XXXX-XXXX-XXXX</Text>
            <Text style={styles.label}>Nombre de red: xxxxx</Text>
            <Text style={styles.label}>Cultivo: Huerto 1</Text>
            <Text style={styles.label}>temperatura: 24 C°</Text>
            <Text style={styles.label}>Humedad/suelo: 18 C°</Text>
            <Text style={styles.label}>Humedad/ambiente: 20°</Text>
          </View>
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
  header: {
    backgroundColor: '#658C7A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownButton: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 18,
    color: '#ABBF15',
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
    borderWidth: 2,
    borderColor: '#ABBF15',
    borderRadius: 10,
    padding: 10,
    width: 300,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  textLogin: {
    color: 'black',
    fontSize: 26,
    marginBottom: 20,
  },
});

export default MainColaborador;
