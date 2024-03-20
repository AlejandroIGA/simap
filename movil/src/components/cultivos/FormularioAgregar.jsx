import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, Button, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../theme';
import Constants from 'expo-constants';
import conf from '../../data/conf';

const FormularioAgregar = ({ visible, onClose, onCambio }) => {

    const [nombre, setNombre] = useState("");
    const [planta, setPlanta] = useState(1);
    const [siembra, setSiembra] = useState("");
    const [temp_amb_min, setTempAmbMin] = useState("");
    const [temp_amb_max, setTempAmbMax] = useState("");
    const [hum_amb_min, setHumAmbMin] = useState("");
    const [hum_amb_max, setHumAmbMax] = useState("");
    const [hum_sue_min, setHumSueMin] = useState("");
    const [hum_sue_max, setHumSueMax] = useState("");
    const [fecha_inicio, setFechaInicio] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [plantasData, setPlantasData] = useState([]);


    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (date) => {
        setFechaInicio(date);
        setShowDatePicker(false);
    };

    const cerrar = () => {
        onClose();
        borrarDatos();
        
    }

    const borrarDatos = () => {
        setNombre("");
        setPlanta(1);
        setSiembra("");
        setTempAmbMin("");
        setTempAmbMax("");
        setHumAmbMin("");
        setHumAmbMax("");
        setHumSueMin("");
        setHumSueMax("");
        setFechaInicio(new Date());
        setShowDatePicker(false);
        setPlantasData([]);
    }

    //Mandar a llamar plantas para tener los valores en el dropdown
    const getPlantas = async () => {
        try {
            const response = await fetch(conf.url + "/getPlantas/", {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setPlantasData(data.data)
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    };

    //Mandar a llamar los valores de una planta en especifico para hacer sugerencia
    const getPlanta = async () => {
        try {
            const response = await fetch(conf.url + `/getPlanta/${planta}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setTempAmbMin(data.data[0].temp_amb_min);
            setTempAmbMax(data.data[0].temp_amb_max);
            setHumAmbMin(data.data[0].hum_amb_min);
            setHumAmbMax(data.data[0].hum_amb_max);
            setHumSueMin(data.data[0].hum_sue_min);
            setHumSueMax(data.data[0].hum_sue_max);
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    };

    //Mandar los datos a la BD
    const addCultivo = async () => {
        //Validación campos vacios
        if (planta === "" || nombre === "" || siembra === "" || temp_amb_min === "" || temp_amb_max === "" || hum_amb_min === "" || hum_amb_max === "" || hum_sue_min === "" || hum_sue_max === "") {
            alert("No se permiten campos vacios");
        } else {
            try {
                const userDataJSON = await AsyncStorage.getItem('userData');
                if (userDataJSON) {
                    const userData = JSON.parse(userDataJSON);
                    const id_usuario = userData.id_usuario;

                    const formData = new FormData();
                    formData.append("id_usuario", id_usuario);
                    formData.append("id_planta", planta);
                    formData.append("nombre", nombre);
                    //Se debe mandar en string para que no salte error de red
                    const fechaLocal = new Date(fecha_inicio.getTime() - (fecha_inicio.getTimezoneOffset() * 60000));
                const fechaISO = fechaLocal.toISOString();
                    formData.append("fecha_inicio", fechaISO);
                    formData.append("cant_siembra", siembra);
                    formData.append("temp_amb_min", temp_amb_min);
                    formData.append("temp_amb_max", temp_amb_max);
                    formData.append("hum_amb_min", hum_amb_min);
                    formData.append("hum_amb_max", hum_amb_max);
                    formData.append("hum_sue_min", hum_sue_min);
                    formData.append("hum_sue_max", hum_sue_max);

                    const response = await fetch(conf.url + "/addCultivo/", {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();

                    if (data.resultado === true) {
                        borrarDatos();
                        onCambio();
                        onClose();
                        alert(data.mensaje);
                    }else if(data.resultado === false){
                        borrarDatos();
                        onCambio();
                        onClose();
                        alert(data.mensaje);
                    }

                }
            } catch (error) {
                console.error("ERROR:", error.message);
            }
        }
        getPlantas();
    }
    
    useEffect(() => {
        getPlantas();
        getPlanta();
    }, [planta,visible])

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={style.container} flexDirection="column">
                <Text style={style.sectionHeader} alignSelf="center">Añadir cultivo</Text>
                <View>
                    <Text style={style.label}>Nombre</Text>
                    <TextInput
                        style={style.input}
                        value={nombre}
                        onChangeText={(text) => setNombre(text)}
                    />
                </View>
                <View>
                    <View flexDirection="row" justifyContent="space-between">
                        <Text style={style.label}>Planta:</Text>
                        <Text style={style.label}>Cantidad sembrada kg :</Text>
                    </View>
                    <View flexDirection="row">
                        <Picker
                            style={[style.picker, style.pickerInput]}
                            selectedValue={planta}
                            onValueChange={(itemValue) => {setPlanta(itemValue)}}>
                            {
                                plantasData.map((planta) => (
                                    <Picker.Item key={planta.id_planta} label={planta.nombre} value={planta.id_planta} />
                                ))
                            }

                        </Picker>
                        <TextInput
                            style={style.input2}
                            value={siembra}
                            onChangeText={(text) => setSiembra(text)}
                            inputMode="decimal"
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>
                <View>
                    <Text style={style.label}>Temperatura ambiente minima:</Text>
                    <TextInput
                        style={style.input}
                        value={temp_amb_min}
                        onChangeText={(text) => setTempAmbMin(text)}
                        inputMode="decimal"
                        keyboardType="decimal-pad"
                    />
                </View>
                <View>
                    <Text style={style.label}>Temperatura ambiente maxima:</Text>
                    <TextInput
                        style={style.input}
                        value={temp_amb_max}
                        onChangeText={(text) => setTempAmbMax(text)}
                        inputMode="decimal"
                        keyboardType="decimal-pad"
                    />
                </View>
                <View>
                    <Text style={style.label}>Humedad ambiente minima:</Text>
                    <TextInput
                        style={style.input}
                        value={hum_amb_min}
                        onChangeText={(text) => setHumAmbMin(text)}
                        inputMode="decimal"
                        keyboardType="decimal-pad"
                    />
                </View>
                <View>
                    <Text style={style.label}>Humedad ambiente maxima:</Text>
                    <TextInput
                        style={style.input}
                        value={hum_amb_max}
                        onChangeText={(text) => setHumAmbMax(text)}
                        inputMode="decimal"
                        keyboardType="decimal-pad"
                    />
                </View>
                <View>
                    <Text style={style.label}>Humedad suelo minima:</Text>
                    <TextInput
                        style={style.input}
                        value={hum_sue_min}
                        onChangeText={(text) => setHumSueMin(text)}
                        inputMode="decimal"
                        keyboardType="decimal-pad"
                    />
                </View>
                <View>
                    <Text style={style.label}>Humedad suelo maxima:</Text>
                    <TextInput
                        style={style.input}
                        value={hum_sue_max}
                        onChangeText={(text) => setHumSueMax(text)}
                        inputMode="decimal"
                        keyboardType="decimal-pad"
                    />
                </View>
                <View>
                    <Text style={style.label}>Fecha de inicio:</Text>
                    <View flexDirection="row">
                        <TextInput
                            style={[style.input, { flex: 1 }]}
                            value={fecha_inicio.toLocaleDateString()}
                            editable={false}
                        />
                        <TouchableOpacity onPress={showDatepicker}>
                            <Icon name="calendar" size={25} color={theme.colors.header} />
                        </TouchableOpacity>
                    </View>
                    {showDatePicker && (
                        <DateTimePicker
                            value={fecha_inicio}
                            mode="date"
                            onChange={(event, date) => handleDateChange(date)}
                        />
                    )}
                </View>
                <View flexDirection='row' style={style.botones}>
                    <Button color={theme.button.danger} style={style.boton} title="Cancelar" onPress={cerrar} />
                    <Button color={theme.button.success} title="Guardar" onPress={addCultivo} />
                </View>
            </View>
        </Modal>

    )

}

const style = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        marginHorizontal: 15,
        flexDirection: 'row',
        borderWidth: 3,
        borderColor: theme.colors.background,
        borderRadius: 10,
        padding: 8,
        flex: 1,
        marginTop: Constants.statusBarHeight + 30,
        marginBottom: 10,
    },
    sectionHeader: {
        fontSize: theme.fontSize.sectionHeader,
        fontWeight: theme.fontWeights.bold,
        marginBottom: 3,
        marginTop: 3,
        color: "#fff"
    },
    label: {
        fontSize: theme.fontSize.info,
        fontWeight: theme.fontWeights.bold,
        color: "#fff",
        marginBottom: 5
    },
    input: {
        fontSize: theme.fontSize.info,
        fontWeight: theme.fontWeights.normal,
        backgroundColor: theme.colors.backgroundPrimary,
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 5
    },
    input2: {
        fontSize: theme.fontSize.info,
        fontWeight: theme.fontWeights.normal,
        backgroundColor: theme.colors.backgroundPrimary,
        marginBottom: 10,
        borderRadius: 5,
        marginLeft: 10,
        width: 130,
        maxWidth: 130,
    },
    botones: {
        justifyContent: "space-around"
    },
    boton: {
        borderRadius: 20
    },
    column: {
        maxWidth: 175,
        width: 175,
        padding: 5
    },
    picker: {
        backgroundColor: theme.colors.backgroundPrimary,
        borderColor: theme.colors.backgroundPrimary,
        borderRadius: 10,
        maxWidth: 200,
        width: 200,
    },
    pickerInput: {
        backgroundColor: theme.colors.backgroundPrimary,
        borderColor: theme.colors.backgroundPrimary,
        borderRadius: 10,
    },
});

export default FormularioAgregar;
