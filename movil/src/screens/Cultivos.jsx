import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../theme.js'
import ListaCultivos from "../components/cultivos/ListaCultivos.jsx";
import FiltroCultivos from "../components/cultivos/FiltroCultivos.jsx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import conf from '../data/conf.js';
import FormularioAgregar from '../components/cultivos/FormularioAgregar.jsx';

const style = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.button.success, // Color del botón
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // Sombra (Android)
        zIndex: 10, // Asegura que esté por encima de otros elementos
    },
    sectionHeader: {
        fontSize: theme.fontSize.sectionHeader,
        fontWeight: theme.fontWeights.bold,
        marginBottom: 10,
        marginTop: 10
    },
})

const Cultivos = () => {
    const [filtro, setFiltro] = useState('');
    const [responseData, setResponseData] = useState({});
    const [cambios, setCambios] = useState(false);

    const [agregar, setAgregar] = useState(false);

    const handleFilterChange = filtro => {
        setFiltro(filtro);
    };

    //Control del formulario para agregar un cultivo
    const agregarCultivo = () =>{
        setAgregar(true);
    }
    const cerrarAgregar = () =>{
        setAgregar(false);
    }

    const getCultivos = async () => {
        try {
            const userDataJSON = await AsyncStorage.getItem('userData');
            if(userDataJSON){
                const userData = JSON.parse(userDataJSON);
                const id_usuario = userData.id_usuario;
                const formData = new FormData();
                formData.append("id_usuario", id_usuario);
                const response = await fetch(conf.url+"/getCultivos/", {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data)
            setResponseData(data)
            }
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    };

    useEffect(() => {
    if (cambios) {
        getCultivos();
        setCambios(false); // Restablecer el estado cambios a false después de actualizar los cultivos
    }else{
        getCultivos();
    }
}, [cambios]);


    return (
        <View style={{ flex: 1 }}>
            <Text style={style.sectionHeader} alignSelf="center">Cultivos</Text>
            {responseData.resultado === true ? (
                <>
                    <FiltroCultivos onFilter={handleFilterChange} />
                    <ListaCultivos filtro={filtro} cultivos={responseData.data} />
                    <TouchableOpacity style={style.floatingButton} onPress={agregarCultivo}>
                        <Icon name="plus" size={30} color={theme.colors.backgroundPrimary} />
                    </TouchableOpacity>
                    <FormularioAgregar visible={agregar} onClose={cerrarAgregar} onCambio={() => setCambios(true)}/>
                </>
            ):
            <View>
                <Text alignSelf="center">No hay cultivos registrados</Text>
            </View>
            }
        </View>
    )
}

export default Cultivos;
