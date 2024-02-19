import React from "react";
import { Link } from "react-router-dom";
import "./css/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import agricultor from './css/img/agricultor.png';
import google from './css/img/google.png';
import facebbok from './css/img/facebook.png';

function Login() {
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
        <img src={agricultor} style={{width: '150px'}} alt="Imagen agricultor" />
      </div>
      <div className="d-flex justify-content-center mt-4">
        <div>
          <h3>Correo
          <input className="mx-3" placeholder="Ingresa correo" />
          </h3>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4">
          <h3 style={{ marginRight: '56px' }}>Contraseña
          <input className="mx-3" placeholder="Ingresa contraseña" />
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
        <img src={google} style={{width: '40px'}} alt="Imagen agricultor" />
        <button type="button" class="btn btn-outline-danger mx-3">Inicio de sesión rápido con Google</button>
        </div>
        <div className="d-flex justify-content-center mt-3">
        <img src={facebbok} style={{width: '40px'}} alt="Imagen agricultor" />
        <button type="button" class="btn btn-outline-primary mx-3">Inicio de sesión rápido con Facebbok</button>
        </div>
    </div>
  );
}

export default Login;
