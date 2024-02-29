import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import {useFocusEffect} from '@react-navigation/native';
 
import theme from "../theme";
//import usuario from "../data/usuario";
import AsyncStorage from '@react-native-async-storage/async-storage';
import conf from "../data/conf";
import Paypal from "../components/Paypal";

const style = StyleSheet.create({
    fila: {
        marginBottom: 15,
        flexDirection: 'row',
        padding: 8,
    },
    sectionHeader: {
        fontSize: theme.fontSize.sectionHeader,
        fontWeight: theme.fontWeights.bold,
        marginBottom: 10,
        marginTop: 10
    },
    infoFocus: {
        fontSize: theme.fontSize.info,
        fontWeight: theme.fontWeights.bold
    },
    info: {
        fontSize: theme.fontSize.info,
        fontWeight: theme.fontWeights.normal,
    },
    boton: {
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 10,
    }
})

const Cuenta = ({ onLogout }) => {
    //guardar respuesta de servidor
    const [responseData, setResponseData] = useState({});
    const [tipoUsuario, setTipo] = useState("");
    const [tipoCuenta, setCuenta] = useState("");
    const [cambios, setCambios] = useState(false);

    //peticion post
    const getUsuario = async () => {
        try {
            const userDataJSON = await AsyncStorage.getItem('userData');

            if (userDataJSON) {

                const userData = JSON.parse(userDataJSON);
                const id_usuario = userData.id_usuario;
                const tipo = userData.tipo_usuario;
                setTipo(userData.tipo_usuario);
                const formData = new FormData();
                formData.append("id_usuario", id_usuario);
                formData.append("tipo_usuario", tipo)
        

                const response = await fetch(conf.url+"/usuario/", {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                //console.log(data)
                setResponseData(data);
                setCuenta(data.data.tipo)
            }
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    };

    //Cambiar suscripcion
    const cambiarSus = () =>{
        alert("Su sucripción cambiara a Free cuando termine el periodo de la suscripción actual");
    }
    //Cambiar de suscripción Pro a Free.
    
    //Manda a llamar a un metodo cuando se hace navegación por el menú
    useFocusEffect(
        React.useCallback(() => {
            getUsuario();
            console.log("use focus");
        }, [])
    );

    useEffect(() => {
        if(cambios){
            getUsuario();
            console.log("cambios", cambios)
        }
        getUsuario();
    }, [cambios])


    return (
        <View style={{ flex: 1 }}>
            <Text style={style.sectionHeader} alignSelf="center">Cuenta</Text>
            {responseData.resultado === true && (
                <>
                    <View style={style.fila}>
                        <Text style={style.infoFocus}>Nombre: </Text>
                        <Text style={style.info}>{responseData.data.nombre} {responseData.data.apellidos}</Text>
                    </View>
                    <View style={style.fila}>
                        <Text style={style.infoFocus}>Correo: </Text>
                        <Text style={style.info}>{responseData.data.correo}</Text>
                    </View>
                    <View style={style.fila}>
                        <Text style={style.infoFocus}>Suscripcion: </Text>
                        <Text style={style.info}>{responseData.data.tipo}</Text>
                    </View>
                    <View style={style.fila}>
                        <Text style={style.infoFocus}>Fecha inicio: </Text>
                        <Text style={style.info}>{responseData.data.fecha_inicio}</Text>
                    </View>
                    <View style={style.fila}>
                        <Text style={style.infoFocus}>Fecha fin: </Text>
                        <Text style={style.info}>{responseData.data.fecha_fin}</Text>
                    </View>
                </>
            )}
            {
                tipoUsuario === "propietario" ?
                    (
                        <>
                            
                            {
                                tipoCuenta === "Pro" ? 
                                <View style={style.boton}>
                                <Button color={theme.button.warnign} onPress={cambiarSus} title="Cambiar suscripción" />
                                </View>
                                :
                                <View style={style.boton}>
                                <Paypal onCambio={() => setCambios(true)}/>
                                </View>
                            }
                            <View style={style.boton}>
                                <Button color={theme.button.danger} title="Cerrar sesión" onPress={onLogout}/>
                            </View>
                        </>
                    )
                    :
                    <>
                        <View style={style.boton}>
                            <Button color={theme.button.danger} title="Cerrar sesión" onPress={onLogout}/>
                        </View>
                    </>
            }
        </View>

    )

}

export default Cuenta;