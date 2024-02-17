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
          <Text style={styles.mainText}>Información del cultivo</Text>
          <View style={styles.formContainer}>
            <View style={styles.column}>
              <Text>Nombre de red: Alumnos_UTEQ</Text>
              <Text>Dispositivo 1</Text>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: conectado ? 'red' : '#ABBF15' },
                ]}
                onPress={handleColor}
              >
                <Text style={styles.buttonText}>
                  {conectado ? 'Desconectar' : 'Conectar'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.column}>
              <Text> Estado de bomba</Text>
              <Image
                source={require('../../assets/bomba.png')}
                style={styles.image}
              />
            </View>
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
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    marginHorizontal: 50,
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
    width: 350,
    marginBottom: 20,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  mainText: {
    color: 'black',
    fontSize: 26,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    width: 100,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MainColaborador;
