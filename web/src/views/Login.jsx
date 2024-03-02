import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import conf from '../conf';
import agricultor from '../images/Granjero.png';
import google from '../images/google.png';
import facebbok from '../images/facebook.png';

function Login() {

  const [id_usuario, setId_usuario] = useState('');
  const [correo, setCorreo] = useState("");
  const [psw, setPsw] = useState("");
  const [cuenta, setCuenta] = useState("");
  const sesion = localStorage.setItem('id_usuario', JSON.stringify(id_usuario));
  const tipoCuenta = localStorage.setItem('cuenta', JSON.stringify(cuenta));
  const navigate = useNavigate();


  const login = async () => {
    if (!correo || !psw) {
      alert("Por favor, complete todos los campos");
      return;
    }
  
    const formData = new FormData();
    formData.append('correo', correo);
    formData.append('psw', psw);
  
    try {
      const response = await fetch(conf.url + '/loginWeb', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const dataResponse = await response.json();
        console.log(dataResponse);
  
        if (dataResponse.resultado) {
          // Obtener el tipo de cuenta (tipo de usuario) de la respuesta
          const tipoCuenta = dataResponse.data.tipo;
          // Almacenar el tipo de cuenta en el estado cuenta
          setCuenta(tipoCuenta);
          // Almacenar el id_usuario en localStorage
          localStorage.setItem('id_usuario', dataResponse.data.id_usuario);
          // Redirigir según el tipo de cuenta
          if (tipoCuenta === "Pro") {
              navigate('/mainAdmin');
          } else if (tipoCuenta === "Free") {
              navigate('/mainAdminFree');
          }
      }
       else {
          alert(dataResponse.mensaje);
        }
      } else {
        console.error('Error al iniciar sesión: ', response.statusText);
        alert('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Sesión activa');
      alert('Ya existe una cuenta iniciada con este usuario');
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
      <div className="d-flex justify-content-center mt-2 ">
        <Link className="btn btn-danger" to="/">Volver</Link>
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