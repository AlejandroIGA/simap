import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import conf from '../data/conf';
import theme from '../theme';

const Paypal = ({onCambio}) => {
    /*
    emailPrueba: sb-j6o7w29614846@personal.example.com
    pswPrueba: ei}N6CP<
*/
    const [showGateway, setShowGateway] = useState(false);
    const [prog, setProg] = useState(false);
    const [progClr, setProgClr] = useState('#000');
    const [responseData, setResponseData] = useState("");
 
    const suscribirse = async () =>{
        try{
            const userDataJSON = await AsyncStorage.getItem('userData');
            const userData = JSON.parse(userDataJSON);
            const id_usuario = userData.id_usuario;
    
            const formData = new FormData();
            formData.append("id_usuario", id_usuario);
    
            const response = await fetch(conf.url + "/suscribirse/", {
                method: 'POST',
                body: formData
            });
    
            const data = await response.json();
            console.log(data.mensaje);
            setResponseData(data);
    
        }catch(error){
            console.error("ERROR PAYPAL: ", error.message);
        }
    }

    function onMessage(e) {
        let data = e.nativeEvent.data;
        setShowGateway(true);
        console.log(data);
        let payment = JSON.parse(data);
        if (payment.status === 'COMPLETED') {
            //Se hace llamado a API para cambiar el tipo de suscripción
            suscribirse();
            setShowGateway(false);
            onCambio();
          alert("Suscripción actualizada");
        } else {
                alert("No se realizo el pago")
        }
      }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.btnCon}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => setShowGateway(true)}>
                        <Text style={styles.btnTxt}>Mejorar suscripción</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {showGateway ? (
                <Modal
                    visible={showGateway}
                    onDismiss={() => setShowGateway(false)}
                    onRequestClose={() => setShowGateway(false)}
                    animationType={"fade"}
                    transparent>
                    <View style={styles.webViewCon}>
                        <View style={styles.wbHead}>
                            <TouchableOpacity
                                style={{ padding: 13 }}
                                onPress={() => setShowGateway(false)}>
                                <Feather name={'x'} size={24} />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: '#00457C',
                                }}>
                                Pago con PayPal
                            </Text>
                            <View style={{ padding: 13, opacity: prog ? 1 : 0 }}>
                                <ActivityIndicator size={24} color={progClr} />
                            </View>
                        </View>
                        <WebView
                            source={{ uri: conf.paypalGateway }}
                            onMessage={onMessage}
                            style={{ flex: 1 }}
                            onLoadStart={() => {
                                setProg(true);
                                setProgClr('#000');
                            }}
                            onLoadProgress={() => {
                                setProg(true);
                                setProgClr('#00457C');
                            }}
                            onLoadEnd={() => {
                                setProg(false);
                            }}
                            onLoad={() => {
                                setProg(false);
                            }}
                        />
                    </View>
                </Modal>
            ) : null}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    btnCon: {
        height: 40,
        width: '100%',
        elevation: 1,
        backgroundColor: theme.button.warnign,
        borderRadius: 3,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnTxt: {
        color: '#fff',
        fontSize: 18,
    },
    webViewCon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    wbHead: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        zIndex: 25,
        elevation: 2,
    },
});
export default Paypal;