import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Modal, Button, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker";
import theme from '../../theme';
import Constants from 'expo-constants';
import conf from '../../data/conf';

const FormularioFinalizar = ({ visible, onClose, onCambio, id }) => {

    const [fecha_fin, setFecha] = useState(new Date());
    const [cosechado, setCosechado] = useState(null);
    const [plaga, setPlaga] = useState(0);
    const [metodo, setMetodo] = useState(null);
    const [efectivo, setEfectivo] = useState("Si");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [plagas, setPlagas] = useState([]);
    const [metodos, setMetodos] = useState([]);


    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (date) => {
        setFecha(date);
        setShowDatePicker(false);
    };

    const cerrar = () => {
        onClose();
        borrarDatos();
    }

    const borrarDatos = () => {
        setFecha(new Date());
        setCosechado(null);
        setPlaga(0);
        setMetodo(null);
        setEfectivo("Si");
        setShowDatePicker(false);
        setPlagas([]);
        setMetodos([]);
    }

    //Mandar a llamar las plagas
    const getPlagas = async () => {
        try {
            const response = await fetch(conf.url + `/getPlagas/${id}`, {
                method: 'GET'
            });
            const data = await response.json();
            console.log("plagas", data);
            if (data.resultado === true) {
                setPlagas(data.data);
            } else {
                console.error("Error en la respuesta del servidor:", data.mensaje);
            }
        } catch (error) {
            console.error("Error al obtener las plagas:", error);
        }
    }

    //Mandar a llamar los métodos de combate
    const getMetodos = async () => {
        try {
            const response = await fetch(conf.url + `/getMetodos/`, {
                method: 'GET'
            });
            const data = await response.json();
            console.log("metodos", data.data)
            setMetodos(data.data)
        } catch (error) {
            console.error("ERORR metodos:", error.message);
        }
    }
    //Mandar a llamar la función para finalizar el cultivo
    const endCultivo = async () => {
        if (fecha_fin === null || cosechado === null) {
            alert("No se permiten campos vacios");
        } 
        else {
            try {
                const formData = new FormData();
                formData.append("id_cosecha", id);
                //Se debe mandar en string para que no salte error de red
                const fechaLocal = new Date(fecha_fin.getTime() - (fecha_fin.getTimezoneOffset() * 60000));
                const fechaISO = fechaLocal.toISOString();

                formData.append("fecha_fin", fechaISO);
                formData.append("cant_cosecha", cosechado);
                formData.append("combate", metodo);
                formData.append("combate_efectivo", efectivo);
                formData.append("plaga", plaga);
                console.log(formData);
                const response = await fetch(conf.url + "/endCultivo/", {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                console.log("end: ", data);
                if (data.resultado === true) {
                    alert(data.mensaje);
                    borrarDatos();
                    onCambio();
                    onClose();
                }
            } catch (error) {
                console.error("ERROR end:", error.message);
            }
        }
    }

    useEffect(() => {
        if (visible) {
            getPlagas();
            getMetodos();
        }
    }, [visible])

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={style.container} flexDirection="column">
                <Text style={style.sectionHeader} alignSelf="center">Finalizar cultivo</Text>
                <View>
                    <Text style={style.label}>Fecha de cosecha:</Text>
                    <View flexDirection="row">
                        <TextInput
                            style={[style.input, { flex: 1 }]}
                            value={fecha_fin.toLocaleDateString()}
                            editable={false}
                        />
                        <TouchableOpacity onPress={showDatepicker}>
                            <Icon name="calendar" size={25} color={theme.colors.header} />
                        </TouchableOpacity>
                    </View>
                    {showDatePicker && (
                        <DateTimePicker
                            value={fecha_fin}
                            mode="date"
                            onChange={(event, date) => handleDateChange(date)}
                        />
                    )}
                </View>
                <View>
                    <Text style={style.label}>Cantidad cosechada:</Text>
                    <TextInput
                        style={style.input}
                        value={cosechado}
                        onChangeText={(text) => setCosechado(text)}
                        inputMode="decimal"
                        keyboardType="decimal-pad"
                    />
                </View>
                <View flexDirection="row">
                    <Text style={style.label}>Plaga:</Text>
                    <Picker
                        style={[style.picker, style.pickerInput]}
                        selectedValue={plaga}
                        onValueChange={(itemValue) => { getPlagas(); setPlaga(itemValue); }}>
                        <Picker.Item key={0} label={"Sin plaga"} value={null} />
                        {
                            plagas.map((plaga) => (
                                <Picker.Item key={plaga.id_plaga} label={plaga.plaga} value={plaga.plaga} />
                            ))
                        }

                    </Picker>
                </View>
                {
                    plaga != 0 ?
                        <>
                            <View flexDirection="row">
                                <Text style={style.label}>Método:</Text>
                                <Picker
                                    style={[style.picker, style.pickerInput]}
                                    selectedValue={metodo}
                                    onValueChange={(itemValue) => { getMetodos(); setMetodo(itemValue); }}>
                                    {
                                        metodos.map((metodo) => (
                                            <Picker.Item key={metodo} label={metodo} value={metodo} />
                                        ))
                                    }

                                </Picker>
                            </View>
                            <View flexDirection="row">
                                <Text style={style.label}>Efectividad:</Text>
                                <Picker
                                    style={[style.picker, style.pickerInput]}
                                    selectedValue={efectivo}
                                    onValueChange={(itemValue) => { setEfectivo(itemValue); }}>
                                    <Picker.Item key={"Si"} label={"Si"} value={"Si"} />
                                    <Picker.Item key={"No"} label={"No"} value={"No"} />
                                </Picker>
                            </View>
                        </>
                        :
                        <></>
                }
                <View flexDirection='row' style={style.botones}>
                    <Button color={theme.button.danger} style={style.boton} title="Cancelar" onPress={cerrar} />
                    <Button color={theme.button.success} title="Guardar" onPress={endCultivo} />
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
        marginBottom: 15
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
        justifyContent: "space-around",
        marginTop: 20
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
        marginBottom: 15
    },
    pickerInput: {
        backgroundColor: theme.colors.backgroundPrimary,
        borderColor: theme.colors.backgroundPrimary,
    },
});

export default FormularioFinalizar;