import React, { useState, useEffect } from 'react';
import conf from '../data/conf';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import EliminarDispositivos from '../components/suscripcion/eliminarDispositivos.jsx';

const MainAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [dispositivos, setDispositivos] = useState([]);
  const [tarjeta, setTarjeta] = useState(false);

  const eliminarDispositivos = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');

      if (userDataJSON) {
        const userData = JSON.parse(userDataJSON);
        const id_usuario = userData.id_usuario;
        const tipo = userData.tipo;
        const formData = new FormData();
        formData.append('id_usuario', id_usuario);

        const response = await fetch(conf.url + '/dispositivos', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.dispositivos.length > 3 && tipo === 'Free') {
          openModal();
        }
      }
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  };

  const openModal = async () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleColor = (index) => {
    setDispositivos((prevState) => {
      const updatedDispositivos = [...prevState];
      updatedDispositivos[index].conectado =
        !updatedDispositivos[index].conectado;
      return updatedDispositivos;
    });
  };

  const handleColorBomb = (index) => {
    setDispositivos((prevState) => {
      const updatedDispositivos = [...prevState];
      updatedDispositivos[index].conectadoBomb =
        !updatedDispositivos[index].conectadoBomb;
      // Desactivar el automatizado si se activa la bomba
      updatedDispositivos[index].conectadoAuto = false;
      return updatedDispositivos;
    });
  };

  const handleColorAuto = (index) => {
    setDispositivos((prevState) => {
      const updatedDispositivos = [...prevState];
      updatedDispositivos[index].conectadoAuto =
        !updatedDispositivos[index].conectadoAuto;
      // Desactivar la bomba si se activa el automatizado
      updatedDispositivos[index].conectadoBomb = false;
      return updatedDispositivos;
    });
  };

  const getDatos = async () => {
    try {
      const userDataJson = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userDataJson);
      const id_usuario = userData.id_usuario;
      const formData = new FormData();
      formData.append('id_usuario', id_usuario);

      const response = await fetch(conf.url + '/dispositivos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del dispositivo');
      }

      const dataResponse = await response.json();
      // Mapea sobre los dispositivos y convierte el campo "bomba" a booleano
      const dispositivosActualizados = dataResponse['dispositivos'].map(
        (dispositivo) => {
          dispositivo.conectadoBomb = Boolean(parseInt(dispositivo.bomba));
          dispositivo.conectadoAuto = dispositivo.automatizado === '1';
          return dispositivo;
        }
      );
      setDispositivos(dispositivosActualizados);
      setTarjeta(
        dataResponse['dispositivos'] !== null &&
          dataResponse['dispositivos'].length > 0
      );
    } catch (error) {
      console.error('Error al obtener los datos del dispositivo:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getDatos();
      console.log('use focus');
    }, [])
  );

  useEffect(() => {
    eliminarDispositivos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getDatos();
      eliminarDispositivos();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const activarBomba = async (idDispositivo, bomba) => {
    const formData = new FormData();
    formData.append('id_dispositivo', idDispositivo);
    formData.append('bomba', bomba);
    console.log('Dispositivo: ', idDispositivo);
    console.log('Estatus: ', bomba);
    try {
      const response = await fetch(conf.url + '/activarBomba', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Éxito: ', data.mensaje);
      } else {
        console.log('Error al activar bomba');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const activarAutomatizado = async (idDispositivo, automatizado) => {
    const formData = new FormData();
    formData.append('id_dispositivo', idDispositivo);
    formData.append('automatizado', automatizado);
    try {
      const response = await fetch(conf.url + '/activarAutomatizado', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        throw new Error('Error al activar automatizado');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const obtenerEstadoDispositivo = async (idDispositivo) => {
    try {
      const formData = new FormData();
      formData.append('id_dispositivo', idDispositivo);

      const response = await fetch(conf.url + '/obtenerEstadoDispositivo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al obtener el estado del dispositivo');
      }

      const dataResponse = await response.json();
      return dataResponse['Estado del bomba'];
    } catch (error) {
      console.error('Error al obtener el estado del dispositivo:', error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.mainText}>Estado dispositivos</Text>
          {tarjeta && dispositivos.length > 0 ? (
            <View>
              {dispositivos.map((dispositivo, index) =>
                dispositivo.tipo == 'maestro' ? (
                  <View style={styles.formContainer} key={index}>
                    <View
                      flexDirection={'row'}
                      alignItems={'center'}
                      justifyContent={'space-around'}
                    >
                      <View style={styles.row}>
                        <Text>Tipo: {dispositivo.tipo}</Text>
                        <Text>Cultivo: {dispositivo.cosecha}</Text>
                        <Text>Dispositivo: {dispositivo.nombre}</Text>
                        <Text>Mac: {dispositivo.mac}</Text>
                      </View>
                      <View style={styles.row}>
                        <Image
                          source={require('../../assets/bomba.png')}
                          style={styles.image}
                        />
                      </View>
                    </View>
                    <View style={[styles.bombaContainer]}>
                      <View style={styles.row}>
                        <Text style={{ textAlign: 'center' }}>
                          Estado de bomba
                        </Text>
                        <View
                          style={styles.buttonColumn}
                          justifyContent={'center'}
                        >
                          <TouchableOpacity
                            style={[
                              styles.buttonBomb,
                              {
                                backgroundColor: dispositivo.conectadoBomb
                                  ? 'red'
                                  : '#ABBF15',
                                ...(dispositivo.conectadoAuto &&
                                  styles.disabledButton),
                              },
                            ]}
                            onPress={() => {
                              activarBomba(
                                dispositivo.id_dispositivo,
                                dispositivo.conectadoBomb ? 0 : 1
                              );
                              handleColorBomb(index); // Actualizar estado de la bomba
                            }}
                            disabled={dispositivo.conectadoAuto}
                          >
                            <Text style={styles.buttonText}>
                              {dispositivo.conectadoBomb ? 'Apagar' : 'Prender'}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.buttonBomb,
                              {
                                backgroundColor: dispositivo.conectadoAuto
                                  ? 'red'
                                  : '#ABBF15',
                              },
                            ]}
                            onPress={() => {
                              activarAutomatizado(
                                dispositivo.id_dispositivo,
                                dispositivo.conectadoAuto ? 0 : 1
                              );
                              handleColorAuto(index); // Actualizar estado del automatizado
                            }}
                          >
                            <Text style={styles.buttonText}>
                              {dispositivo.conectadoAuto
                                ? 'Automatizado'
                                : 'Automatizar'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.formContainer} key={index}>
                    <View style={styles.row}>
                      <Text>Tipo: {dispositivo.tipo}</Text>
                      <Text>Cultivo: {dispositivo.cosecha}</Text>
                      <Text>Dispositivo: {dispositivo.nombre}</Text>
                      <Text>Mac: {dispositivo.mac}</Text>
                      <Text>
                        Responsable: {dispositivo.nomus} {dispositivo.appus}
                      </Text>
                    </View>
                  </View>
                )
              )}
            </View>
          ) : (
            <Text>No se encontraron dispositivos</Text>
          )}
        </View>
      </ScrollView>
      <EliminarDispositivos visible={showModal} onClose={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  bombaContainer: {
    width: 300,
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    marginHorizontal: 50,
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
    marginTop: '1%',
    borderWidth: 2,
    borderColor: '#ABBF15',
    borderRadius: 10,
    padding: 10,
    width: 350,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'column',
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
    width: 150,
  },
  buttonBomb: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    width: '50%',
    marginLeft: 20,
  },
  buttonColumn: {
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.5,
  },
});

export default MainAdmin;
