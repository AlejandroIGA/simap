import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import theme from "../../theme";

const FormularioEditar = () => {
    return (
        <View style={style.container} flexDirection="column">
            <Text style={style.sectionHeader} alignSelf="center">Editar cultivo</Text>
            <View>
                <Text style={style.label}>Nombre</Text>
                <TextInput
                    style={style.input}
                />
            </View>
            <View>
                <View flexDirection="row" justifyContent="space-between">
                <Text style={style.label}>Especie:</Text>
                <Text style={style.label}>Cantidad sembrada:</Text>
                </View>
                <View flexDirection="row" justifyContent="space-between">
                <TextInput
                    style={style.input}
                />
                <TextInput
                    style={style.input}
                /> 
                </View>
            </View>
            <View>
                <Text style={style.label}>Temperatura ambiente minima:</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    keyboardType="decimal-pad"
                />
            </View>
            <View>
                <Text style={style.label}>Temperatura ambiente maxima:</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    keyboardType="decimal-pad"
                />
            </View>
            <View>
                <Text style={style.label}>Humedad ambiente minima:</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    keyboardType="decimal-pad"
                />
            </View>
            <View>
                <Text style={style.label}>Humedad ambiente maxima:</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    keyboardType="decimal-pad"
                />
            </View>
            <View>
                <Text style={style.label}>Humedad suelo minima:</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    keyboardType="decimal-pad"
                />
            </View>
            <View>
                <Text style={style.label}>Humedad suelo maxima:</Text>
                <TextInput
                    style={style.input}
                    inputMode="decimal"
                    keyboardType="decimal-pad"
                />
            </View>
            <View>
                <Text style={style.label}>Fecha de inicio:</Text>
                <TextInput
                    style={style.input}
                />
            </View>
            <View flexDirection='row' style={style.botones}>
                <Button color={theme.button.danger} style={style.boton} title="Cancelar" />
                <Button color={theme.button.success} title="Guardar" />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        margin: 15,
        flexDirection: 'row',
        borderWidth: 3,
        borderColor: theme.colors.background,
        borderRadius: 10,
        padding: 8,
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
    botones: {
        justifyContent: "space-around"
    },
    boton:{
        borderRadius:20
    },
    column: {
        maxWidth: 175,
        width: 175,
        padding: 5
    },

})

export default FormularioEditar;