// App.js
import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { Dispositivos } from './src/screens/Dispositivos';
import { Login } from './src/screens/Login';
import { Notificaciones } from './src/screens/Notificaciones';
import Perfil from './src/screens/Cuenta.jsx';
import Cultivos from './src/screens/Cultivos.jsx';
import conf from './src/data/conf.js';
import mainAdmin from './src/screens/mainAdmin.js';
import mainColaborador from './src/screens/mainColaborador.js';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tipo, setTipo] = useState('');

  // Función para iniciar sesión
  const login = async () => {
    const userDataJSON = await AsyncStorage.getItem('userData');
    if (userDataJSON) {
      const userData = JSON.parse(userDataJSON);
      setTipo(userData.tipo_usuario);
    }
    setIsLoggedIn(true);
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      //hacer la petición de logout para borrar el token
      const userDataJSON = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userDataJSON);
      const id_usuario = userData.id_usuario;
      const formData = new FormData();
      formData.append('id_usuario', id_usuario);

      const response = await fetch(conf.url + '/logout/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('ERROR:', error.message);
    }

    await AsyncStorage.removeItem('userData');
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <StatusBar backgroundColor='#658C7A' />
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name='Main' options={{ headerShown: false }}>
            {() => (
              <>
                {tipo === 'propietario' ? (
                  <Drawer.Navigator
                    screenOptions={{
                      headerStyle: {
                        backgroundColor: '#658C7A',
                      },
                      headerTintColor: '#FFFFFF',
                    }}
                  >
                    <Drawer.Screen name='Inicio' component={mainAdmin} />
                    <Drawer.Screen name='Cultivos' component={Cultivos} />
                    <Drawer.Screen
                      name='Dispositivos'
                      component={Dispositivos}
                    />
                    <Drawer.Screen
                      name='Notificaciones'
                      component={Notificaciones}
                    />
                    <Drawer.Screen name='Perfil'>
                      {() => <Perfil onLogout={logout} />}
                    </Drawer.Screen>
                  </Drawer.Navigator>
                ) : (
                  <Drawer.Navigator
                    screenOptions={{
                      headerStyle: {
                        backgroundColor: '#658C7A',
                      },
                      headerTintColor: '#FFFFFF',
                    }}
                  >
                    <Drawer.Screen name='Inicio' component={mainColaborador} />
                    <Drawer.Screen
                      name='Dispositivos'
                      component={Dispositivos}
                    />
                    <Drawer.Screen
                      name='Notificaciones'
                      component={Notificaciones}
                    />
                    <Drawer.Screen name='Perfil'>
                      {() => <Perfil onLogout={logout} />}
                    </Drawer.Screen>
                  </Drawer.Navigator>
                )}
              </>
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name='Login' options={{ headerShown: false }}>
            {() => <Login onLogin={login} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
