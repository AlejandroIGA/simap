import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from '../components/Menu';
import conf from '../conf';

function Cuenta() {
    const [responseData, setResponseData] = useState({});
    const [tipoUsuario, setTipo] = useState("propietario");
    const [tipoCuenta, setCuenta] = useState("");

    //peticion post
    const getUsuario = async () => {
        try {
            //const userData = JSON.parse(userDataJSON);
            //const id_usuario = userData.id_usuario;
            //onst tipo = userData.tipo_usuario;
            //setTipo(userData.tipo_usuario);
            const formData = new FormData();
            formData.append("id_usuario", 1);
            formData.append("tipo_usuario", "propietario")

            const response = await fetch(conf.url + "/usuario/", {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("RESPONSE",data)
            setResponseData(data);
            setCuenta(data.data.tipo)
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    };


    useEffect(() => {
        getUsuario();
    }, [])
    
    return (
        <div className="container-fluid p-0 m-0" style={{ background: '#f2f2f2', height: '100vh' }}>
            <Menu />
            <div className='container pt-3 pb-3'>
                <div className='row'>
                    <div className='col-6'>
                        <h2 style={{ fontWeight: "bold" }}>Cuenta</h2>
                    </div>
                </div>
                {
                    responseData.data ? 
                    <>
                    <div className='container p-0 pb-5'>
                    <div className='row pt-3' style={{ fontSize: 25 }}>
                        <div className='col'>
                            <p><span style={{ fontWeight: "bold" }}>Nombre: </span>{responseData.data.nombre} {responseData.data.apellidos}</p>
                        </div>
                        <div className='col'>
                            <p><span style={{ fontWeight: "bold" }}>Correo: </span>{responseData.data.correo}</p>

                        </div>
                        <div className='col'>
                            <p><span style={{ fontWeight: "bold" }}>Suscripción: </span>{responseData.data.tipo}</p>

                        </div>
                    </div>
                    <div className='row pt-3' style={{ fontSize: 25 }}>
                        <div className='col-4'>
                            <p><span style={{ fontWeight: "bold" }}>Fecha de inicio: </span>{responseData.data.fecha_inicio}</p>

                        </div>
                        <div className='col-4'>
                            <p><span style={{ fontWeight: "bold" }}>Fecha fin: </span>{responseData.data.fecha_fin}</p>
                        </div>
                    </div>
                    <div className='row text-center pt-3'>
                        {
                            tipoUsuario === "propietario" ?
                                <>
                                    {
                                        responseData.data.tipo === "Pro" ?
                                            <div className='col'>
                                                <button className='btn btn-warning'>Cambiar suscripción</button>

                                            </div>
                                            :


                                            <div className='col'>
                                                <Link type="button" to="/paypal" className='btn btn-warning'>Mejorar suscripción</Link>

                                            </div>
                                    }
                                    <div className='col'>
                                        <button className='btn btn-danger'>Cerrar sesión</button>

                                    </div>
                                </>

                                :

                                <>
                                    <div className='col'>
                                        <button className='btn btn-danger'>Cerrar sesión</button>

                                    </div>
                                </>
                        }
                    </div>
                </div>
                    </>
                    
                    :
<>
<p>Cargando...</p>
</>
                }
               
            </div>
        </div >
    )

}

export default Cuenta;