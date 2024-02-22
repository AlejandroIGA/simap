import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import agricultor from './css/img/agricultor.png';
import google from './css/img/google.png';
import facebbok from './css/img/facebook.png';

function Login() {

//Definición de variables
const [correo, setCorreo] = useState("");
const [psw, setPsw] = useState("");
const [tipo, setTipo] = useState("");
const navigate = useNavigate();
const storedSession = localStorage.getItem('sesion');
const sesion = JSON.parse(storedSession);

//useEffect para saber si iniciamos sesión como administrador pro o administrador basic
useEffect(() => {
  if (sesion) {
      if(sesion.tipo === "propietarioPro"){
          navigate('/mainAdmin');
      } else if (sesion.tipo === "propietarioBasic"){
              navigate('/mainAdminBasic');
          }else{
            alert("Usuario y/o contraseña no corresponten");
          }
      }
  }, [sesion, navigate]);

//Llamada de la API en el servidor para verificar que los datos ingresados sean correctos
const login = (e) => {
  e.preventDefault();
  axios.post('http://127.0.0.1/simap/webservice/loginWeb/', { correo: correo, psw: psw })
    .then((response) => {
      const data = response.data;
      if (data.resultado) {
        // Inicio de sesión exitoso, redirigir al usuario a la página correspondiente
        if (data.data.tipo_usuario === "Pro") {
          navigate('/mainAdmin');
        } else if (data.data.tipo_usuario === "Basic") {
          navigate('/mainAdminBasic');
        }
      } else {
        // Error en el inicio de sesión, mostrar mensaje de error
        alert(data.mensaje);
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Hubo un error al iniciar sesión");
    });
};


  return (
    <div>
      <nav className="navbar">
        <div>
          <h1 className="text-white mx-4">SIMAP</h1>
        </div>
        <div>

        </div>
      </nav>
      <div className="d-flex justify-content-center mt-4">
        <img src={agricultor} style={{ width: '150px' }} alt="Imagen agricultor" />
      </div>
      <div className="d-flex justify-content-center mt-4">
        <div>
          <h3>Correo
            <input className="mx-3" placeholder="Ingresa correo" value={correo} onChange={(event) => {setCorreo(event.target.value);}} />
          </h3>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <h3 style={{ marginRight: '56px' }}>Contraseña
          <input className="mx-3" placeholder="Ingresa contraseña" value={psw} onChange={(event) => {setPsw(event.target.value);}}/>
        </h3>
      </div>
      <div className="d-flex justify-content-center mt-2">
        <Link to="/mainAdmin" className="btn btn-primary">Iniciar Sesión</Link>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <p>¿No tienes cuenta? Crea una
          <a href="#"> aquí</a>
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