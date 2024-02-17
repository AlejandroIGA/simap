import React from 'react';
import {View, StyleSheet, Text} from 'react-native'
import Constants from 'expo-constants'
import theme from '../theme.js'

const style = StyleSheet.create({
    container:{
        backgroundColor: theme.appBar.background,
        paddingTop: Constants.statusBarHeight,
        paddingLeft: 10,
        flexDirection: 'row'
    },
    company:{
        color:'#fff',
        fontSize: theme.fontSize.formHeader,
        fontWeight: theme.fontWeights.bold,
        alignSelf: "center"
    }
})

const AppBar = () => {
    return(
        <View style={style.container}>
            <Text style={style.company}>SIMAP</Text>
        </View>
    )
}
export default AppBar;