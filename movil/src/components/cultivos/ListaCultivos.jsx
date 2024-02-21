import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import FormularioEditar from '../cultivos/FormularioEditar.jsx'
import theme from "../../theme";
import conf from "../../data/conf";
import FormularioFinalizar from "./FormularioFinalizar.jsx";

const ListaCultivos = ({ cultivos, filtro, onCambio }) => {
    const [formulariosVisibles, setFormulariosVisibles] = useState({});
    const toggleFormulario = (idCultivo, formulario) => {
        setFormulariosVisibles(prevState => ({
            ...prevState,
            [idCultivo]: {
                ...prevState[idCultivo],
                [formulario]: !prevState[idCultivo]?.[formulario]
            }
        }));
    };

    const cultivosFiltrados = filtro
        ? cultivos.filter(cultivo =>
            cultivo.nombre.toLowerCase().includes(filtro.toLowerCase())
        )
        : cultivos;

    //Eliminar un cultivo/cosecha
    const deleteCultivo = async ($id_cultivo) => {
        try {
            const response = await fetch(conf.url + `/deleteCultivo/${$id_cultivo}`, {
                method: 'GET',
            });
            const data = await response.json();
            console.log("eliminar: ",data)
            if(data.resultado){
                alert(data.mensaje);
                onCambio();
            }else{
                alert(data.mensaje);
            }
            
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    }

    //Abrir o cerrar formulario editar
    const editarCultivo = (id_cultivo) => {
        setFormulariosVisibles(prevState => ({
            ...prevState,
            [id_cultivo]: {
                ...prevState[id_cultivo],
                editar: !prevState[id_cultivo]?.editar
            }
        }));
    };
    
    const finalizarCultivo = (id_cultivo) => {
        setFormulariosVisibles(prevState => ({
            ...prevState,
            [id_cultivo]: {
                ...prevState[id_cultivo],
                finalizar: !prevState[id_cultivo]?.finalizar
            }
        }));
    };

    return (
        <FlatList
            data={cultivosFiltrados}
            ItemSeparatorComponent={() => <Text></Text>}
            renderItem={({ item: cultivo }) => {
                const { id_cosecha: idCultivo } = cultivo;
                const formulariosCultivo = formulariosVisibles[idCultivo] || {};
                return (
                    <View style={style.container} flexDirection='column' key={cultivo.id_cosecha}>
                        <Text style={style.header} alignSelf="center" >{cultivo.nombre}</Text>
                        <View style={style.linea}></View>
                        <View flexDirection='row' >
                            <View style={style.column}>
                                <Text style={style.infoFocus}>Especie:</Text>
                                <Text style={style.info}>{cultivo.planta}</Text>
                            </View>
                            <View style={style.column} justifyContent="flex-start">
                                <Text style={style.infoFocus}>Fecha de inicio:</Text>
                                <Text style={style.info}>{cultivo.fecha_inicio}</Text>
                            </View>
                        </View>
                        <View flexDirection='row' >
                            <View style={style.column}>
                                <Text style={style.infoFocus}>Temperatura ambiente:</Text>
                                <Text style={style.info}>{cultivo.temp_amb_min}°C - {cultivo.temp_amb_max}°C</Text>
                            </View>
                            <View style={style.column} justifyContent="flex-start">
                                <Text style={style.infoFocus}>Cantidad sembrada:</Text>
                                <Text style={style.info}>{cultivo.cant_siembra} Kg</Text>
                            </View>
                        </View>
                        <View flexDirection='row' >
                            <View style={style.column}>
                                <Text style={style.infoFocus}>Humedad ambiente:</Text>
                                <Text style={style.info}>{cultivo.hum_amb_min}% - {cultivo.hum_amb_max}%</Text>
                            </View>
                            <View style={style.column} justifyContent="flex-start">
                                <Text style={style.infoFocus}>Fecha de cosecha:</Text>
                                <Text style={style.info}>{cultivo.fecha_fin}</Text>
                            </View>
                        </View>
                        <View flexDirection='row' >
                            <View style={style.column}>
                                <Text style={style.infoFocus}>Humedad suelo:</Text>
                                <Text style={style.info}>{cultivo.hum_sue_min}% - {cultivo.hum_sue_max}%</Text>
                            </View>
                            <View style={style.column} justifyContent="flex-start">
                                <Text style={style.infoFocus}>Cantidad cosechada:</Text>
                                <Text style={style.info}>{cultivo.cant_cosecha} Kg</Text>
                            </View>
                        </View>
                        <View flexDirection='row' style={style.botones}>
                            <Button color={theme.button.warnign} title="Editar" onPress={()=>editarCultivo(cultivo.id_cosecha)}/>
                            <Button color={theme.button.success} title="Finalizar" onPress={()=>finalizarCultivo(cultivo.id_cosecha)}/>
                            <Button color={theme.button.danger} title="Eliminar" onPress={()=>deleteCultivo(cultivo.id_cosecha)}/>
                        </View>
                        {formulariosCultivo.editar && <FormularioEditar visible={true} onClose={() => toggleFormulario(idCultivo, 'editar')} onCambio={onCambio} id={idCultivo}/>}
                        {formulariosCultivo.finalizar && <FormularioFinalizar visible={true} onClose={() => toggleFormulario(idCultivo, 'finalizar')} onCambio={onCambio} id={idCultivo}/>}
                    </View>
                )
            }}
        />
    );
};

const style = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.backgroundPrimary,
        margin: 15,
        flexDirection: 'row',
        borderWidth: 3,
        borderColor: theme.colors.background,
        borderRadius: 10,
        padding: 8,
    },
    header: {
        fontSize: theme.fontSize.infoHeader,
        fontWeight: theme.fontWeights.bold,
        marginBottom: 10
    },
    infoFocus: {
        fontSize: theme.fontSize.info,
        fontWeight: theme.fontWeights.bold
    },
    info: {
        fontSize: theme.fontSize.info,
        fontWeight: theme.fontWeights.normal,
    },
    column: {
        maxWidth: 175,
        width: 175,
        padding: 5
    },
    botones: {
        justifyContent: "space-between"
    },
    linea: {
        borderWidth: 2,
        borderColor: theme.colors.background,
        marginBottom: 10
    },
    sectionHeader: {
        fontSize: theme.fontSize.sectionHeader,
        fontWeight: theme.fontWeights.bold,
        marginBottom: 10,
        marginTop: 10
    },
})


export default ListaCultivos;