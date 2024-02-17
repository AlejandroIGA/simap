import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import conf from '../data/conf';
import AppBar from '../components/AppBar.jsx';

export function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const formData = new FormData();
    formData.append('correo', email);
    formData.append('psw', password);

    try {
      const response = await fetch(conf.url + '/login', {
        method: 'POST',
        body: formData,
      });

      const dataResponse = await response.json();
      console.log(dataResponse);
      //primero comprobar que tengo algo en data, si no, ya se que no se encontro al usuario
      if (dataResponse.data === null) {
        alert(dataResponse.mensaje);
      } else {
        if (dataResponse.resultado && dataResponse.data.estatus === '1') {
          await AsyncStorage.setItem(
            'userData',
            JSON.stringify(dataResponse.data)
          );
          const userDataJSON = await AsyncStorage.getItem('userData');
          const userData = JSON.parse(userDataJSON);
          console.log('Datos del usuario:', userData);
          onLogin();
        } else if (
          dataResponse.resultado &&
          dataResponse.data.estatus === '0'
        ) {
          alert('Cuenta desactivada');
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <AppBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Image
            source={require('../../images/Granjero.jpg')}
            style={styles.imageLogin}
          />
          <Text style={styles.textLogin}>Iniciar sesión</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Correo electrónico:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder='Ingrese su correo electrónico'
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <Text style={styles.label}>Contraseña:</Text>
            <View style={[styles.input, styles.passwordInput]}>
              <TextInput
                style={{ flex: 1 }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder='Ingrese su contraseña'
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.icon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? 'eye' : 'eye-slash'}
                  size={20}
                  color='black'
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonGoogle} onPress={handleLogin}>
            <Image
              source={require('../../images/Google.jpg')}
              style={styles.image}
            />
            <Text style={styles.buttonTextGoogle}>
              Iniciar sesión con Google
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonFacebook} onPress={handleLogin}>
            <Image
              source={require('../../images/Facebook.jpg')}
              style={styles.image}
            />
            <Text style={styles.buttonTextFacebook}>
              Iniciar sesión con Facebook
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ABBF15',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    width: 180,
  },
  buttonGoogle: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonFacebook: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'blue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  imageLogin: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  textLogin: {
    color: 'black',
    fontSize: 26,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonTextGoogle: {
    color: 'red',
    fontSize: 16,
  },
  buttonTextFacebook: {
    color: 'blue',
    fontSize: 16,
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
});
