import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
/*
    emailPrueba: sb-j6o7w29614846@personal.example.com
    pswPrueba: ei}N6CP<
*/
function Paypal() {
    console.log("Rendering Paypal component");

    const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: "285",
                    },
                },
            ],
        });
    }

    async function onApprove(data, actions) {
        let order = await actions.order.capture();
        console.log(order);
        window.ReactNativeWebView &&
            window.ReactNativeWebView.postMessage(JSON.stringify(order));
        return order;
    }

    function onError(err) {
        console.log(err);
        let errObj = {
            err: err,
            status: "FAILED",
        };
        window.ReactNativeWebView &&
            window.ReactNativeWebView.postMessage(JSON.stringify(errObj));
    }

    return (
        <div className='container-fluid p-0' style={{ background: '#f2f2f2' }}>
            <nav className="navbar navbar-expand-lg nav">
                <div className="container">
                    <a className="navbar-brand" href="#inicio">SIMAP</a>
                </div>
            </nav >
            <div className="container-fluid w-100 h-100">
                <div className="container tarjeta p-0 mt-5">
                    <div className="titulo">
                        <p>Suscripción Pro</p>
                    </div>
                    <div className="row">
                        <p className="subtitulo">Beneficios:</p>
                        <ul className="ms-5 ps-3">
                            <li className="informacion">3 administradores.</li>
                            <li className="informacion">10 colaboradores.</li>
                            <li className="informacion">5 dispositivos maestro.</li>
                            <li className="informacion">30 dispositivos esclavo.</li>
                            <li className="informacion">Lectura cada 2 minutos.</li>
                            <li className="informacion">Gráficas avanzadas.</li>
                        </ul>
                    </div>
                    <div className="row" style={{ align: "center" }}>
                        <div className="col">
                            <button hidden></button>
                        </div>
                        <div className="col">
                        <PayPalButton
                                createOrder={(data, actions) => createOrder(data, actions)}
                                onApprove={(data, actions) => onApprove(data, actions)}
                                onCancel={() => onError("Canceled")}
                                onError={(err) => onError("ERROR")}
                                style={{
                                    shape: 'pill',
                                    label: 'pay',
                                    height: 40,
                                    layout: 'horizontal',
                                    align: "center",
                                }}
                            />
                        </div>
                        <div className="col">
                            <button hidden></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Paypal;