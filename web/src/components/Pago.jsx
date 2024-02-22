import React, { useState, useEffect, useRef } from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";


function Pago() {
    
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const toggleMostrarFormulario = () => {
        setMostrarFormulario((prevMostrarFormulario) => !prevMostrarFormulario);
    };
    const mostrarFormularioRef = useRef(mostrarFormulario);
    mostrarFormularioRef.current = mostrarFormulario;

    const [isPayPalScriptLoaded, setPayPalScriptLoaded] = useState(false);

    useEffect(() => {
        const loadPayPalScript = async () => {
            try {
                const script = document.createElement("script");
                script.src = "https://www.paypal.com/sdk/js?client-id=AWk7jmFRVhzTfhuINn8vq23LQd91KASa6vDuXvxpzQFTeaA4g3hBy0HunSO4QpedGu5iZwve38zaxREj&currency=USD";
                script.async = true;
                script.onload = () => setPayPalScriptLoaded(true);
                document.body.appendChild(script);
            } catch (error) {
                console.error("Error al cargar el script de PayPal:", error);
            }
        };

        loadPayPalScript();
    }, []);

    return (
        <>
            <section className="py-5 mt-5">
                <div className="container">
                    <div className="col-md-6 p-3">
                        <div className="py-1 text-center">
                            <h1 className="text-primary">Datos de compra</h1>
                        </div>
                        <div className="py-1 text-center">
                            <PayPalScriptProvider options={{ "client-id": "Adg2w8GVLBfeD8yfOpHi_EVcEVhtJxDVtM4PH7Zj6nsePkUyzLSmFGr2VBp2yQh6-CmaggA3jjuOUhsj" }}>
                                {isPayPalScriptLoaded && (
                                    <PayPalButtons
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [{
                                                    amount: {
                                                        value: 30,
                                                    }
                                                }]
                                            });
                                        }}
                                        onApprove={(data, actions) => {
                                            console.log('Pago realizado');
                                        }}
                                        onCancel={(data) => {
                                            console.log('Pago cancelado');
                                        }}
                                    />
                                )}
                            </PayPalScriptProvider>
                        </div>
                    </div>
                </div>
        </section >
        </>
    );
}

export default Pago;