import React, { useState } from 'react';
import MenuBlank from '../components/Menu-blank';
import granjero from '../images/Granjero.png';
import conf from '../conf';
import { Link, useNavigate } from 'react-router-dom';

function Registro() {
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [psw, setPsw] = useState("");
    const [pswDos, setPswDos] = useState("");
    const [tipo, setTipo] = useState("propietario");
    const navigate = useNavigate();
    
    const limpiarCampos = () => {
        setNombre('');
        setApellidos('');
        setCorreo('');
        setPsw('');
        setPswDos('');
    }

    const registroUsuario = async () => {

        if(!nombre || !apellidos || !correo || !psw || !pswDos) {
            alert("Porfavor, complete todos los campos");
        } else {
            if (psw === pswDos) {
                const formData = new FormData();
                formData.append('nombre', nombre);
                formData.append('apellidos', apellidos);
                formData.append('correo', correo);
                formData.append('psw', psw);
                formData.append('tipo', tipo);
        
                try {
                    const response = await fetch( conf.url + '/registroUsuario', {
                      method: 'POST',
                      body: formData,
                    });
              
                    const dataResponse = await response.json();
                    console.log(dataResponse);
        
                    limpiarCampos();
                    alert(dataResponse.mensaje);
                    navigate("/inicio");
        
                } catch (error) {
                console.error('Error al registrar usuario:', error);
                alert('Error al registrar usuario. Por favor, inténtalo de nuevo.');
                }
            } else {
                alert("Las contraseñas no coinicden");
            }
        }
    }

    return (
        <div style={{ background: '#f2f2f2' }} className="h-100 overflow-hidden">
            <MenuBlank />
            <div className='container-fluid h-100'>
                <div className='row justify-content-center align-items-center h-100'>
                    <div className='col-md-6'>
                        <div className="text-center" style={{ marginTop: '50px' }}>
                            <img src={granjero} alt="Simap" className="img-fluid" style={{ maxWidth: '85px' }} />
                        </div>
                            <div className='rounded-lg border-3 p-4' style={{ borderRadius: '15px', borderColor: "#ABBF15", borderWidth: '3px', borderStyle: 'solid' }}>
                                <div className='form-group py-2'>
                                    <label htmlFor='nombre'>Nombre(s)</label>
                                    <input onChange={(e) => setNombre(e.target.value)} placeholder='Nombre(s)' type='text' className='form-control border-dark border-2' id='nombre' />
                                </div>
                                <div className='form-group py-2'>
                                    <label htmlFor='apellidos'>Apellidos</label>
                                    <input onChange={(e) => setApellidos(e.target.value)} placeholder='Apellidos' type='text' className='form-control border-dark border-2' id='apellidos' />
                                </div>
                                <div className='form-group py-2'>
                                    <label htmlFor='correo'>Correo</label>
                                    <input onChange={(e) => setCorreo(e.target.value)} placeholder='Correo' type='email' className='form-control border-dark border-2' id='correo' />
                                </div>
                                <div className='form-group row py-2'>
                                    <div className='col'>
                                        <label htmlFor='password1'>Contraseña</label>
                                        <input minLength={8} onChange={(e) => setPsw(e.target.value)} placeholder='Contraseña' type='password' className='form-control border-dark border-2' id='password1' />
                                    </div>
                                    <div className='col'>
                                        <label htmlFor='password2'>Confirmar Contraseña</label>
                                        <input minLength={8} onChange={(e) => setPswDos(e.target.value)} placeholder='Contraseña' type='password' className='form-control border-dark border-2' id='password2' />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-3 py-1">
                                <Link onClick={registroUsuario} type='submit' className='btn text-white' style={{ backgroundColor:'#ABBF15'}}>Registrarse</Link>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registro;
