import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import conf from '../conf';
import agricultor from '../images/Granjero.png';
import google from '../images/google.png';
import facebbok from '../images/facebook.png';

function Login() {

  const [correo, setCorreo] = useState("");
  const [psw, setPsw] = useState("");
  const [tipo, setTipo] = useState("propietario");
  const navigate = useNavigate();

  const login = async () => {
    if (!correo || !psw) {
      alert("Por favor, complete todos los campos");
      return;
    }
  
    const formData = new FormData();
    formData.append('correo', correo);
    formData.append('psw', psw);
    formData.append('tipo', tipo);
  
    try {
      const response = await fetch(conf.url + '/login', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const dataResponse = await response.json();
        console.log(dataResponse);
  
        if (dataResponse.resultado) {
          if (dataResponse.data.tipo === "propietario") {
            navigate('/mainAdmin');
          } else if (dataResponse.data.tipo === "Free") {
            navigate('/mainAdminFree');
          }
        } else {
          alert(dataResponse.mensaje);
        }
      } else {
        console.error('Error al iniciar sesión: ', response.statusText);
        alert('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión: ', error);
      alert('Error al iniciar sesión');
    }
  };
  

  return (
    <div>
      <nav className="navbar">
        <div>
          <h1 className="text-white mx-4">SIMAP</h1>
        </div>
      </nav>
      <div className="d-flex justify-content-center mt-4">
        <img src={agricultor} style={{ width: '150px' }} alt="Imagen agricultor" />
      </div>
      <div className="d-flex justify-content-center mt-4">
        <div>
          <h3>Correo
            <input className="mx-3" placeholder="Ingresa correo" value={correo} onChange={(event) => { setCorreo(event.target.value); }} required />
          </h3>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <h3 style={{ marginRight: '56px' }}>Contraseña
          <input className="mx-3" placeholder="Ingresa contraseña" type="password" value={psw} onChange={(event) => { setPsw(event.target.value); }} required />
        </h3>
      </div>
      <div className="d-flex justify-content-center mt-2">
        <button onClick={login} className="btn btn-primary">Iniciar Sesión</button>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <p>¿No tienes cuenta? Crea una
          <Link to="/registro"> aquí</Link>
        </p>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <img src={google} style={{ width: '40px' }} alt="Imagen agricultor" />
        <button type="button" className="btn btn-outline-danger mx-3">Inicio de sesión rápido con Google</button>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <img src={facebbok} style={{ width: '40px' }} alt="Imagen agricultor" />
        <button type="button" className="btn btn-outline-primary mx-3">Inicio de sesión rápido con Facebbok</button>
      </div>
    </div>
  );
}

export default Login;
