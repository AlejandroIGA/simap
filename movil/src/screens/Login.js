import React, { useState, useRef, useEffect } from 'react';
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
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'https://10.13.13.99/simap/movil/assets/yametemela.mp3'
    });    
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: '3d8c0a6e-b84d-4c7d-a111-7ae87e1f59c2' })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(
      async (notification) => {
        setNotification(notification);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  const handleLogin = async () => {

    const formData = new FormData();
    formData.append('correo', email);
    formData.append('psw', password);
    formData.append('token', expoPushToken);

    try {
      const response = await fetch(conf.url + '/login', {
        method: 'POST',
        body: formData,
      });

      const dataResponse = await response.json();
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
            source={require('../../images/Granjero.png')}
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
