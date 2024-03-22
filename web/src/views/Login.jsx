import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import conf from '../conf';
import agricultor from '../images/Granjero.png';
import google from '../images/google.png';
import facebbok from '../images/facebook.png';

function Login() {

  const [id_usuario, setId_usuario] = useState('');
  const [ nombre, setNombre ] = useState( "" );
  const [correo, setCorreo] = useState("");
  const [psw, setPsw] = useState("");
  const [cuenta, setCuenta] = useState("");
  const sesion = localStorage.setItem('id_usuario', JSON.stringify(id_usuario));
  const tipoCuenta = localStorage.setItem('cuenta', JSON.stringify(cuenta));
  const navigate = useNavigate();


  useEffect (() => {
    const start = () => {
      gapi.auth2.init({
        clientId: "191244130158-qmn4snu41sfu0tfrc0u3ktb1kdubtdjo.apps.googleusercontent.com",
      })
    }
    gapi.load("client:auth2", start)
  }, []);

  //INICIO DE SESION CON GOOGLE
  const onSuccess = async (response) => {
    console.log(response);
    // SE OBTIENEN LOS DATOS DE LA CUENTA DE GOOGLE
    const correo = response.profileObj.email;
    setCorreo(correo);
    const psw = response.googleId;
    setPsw(psw);
    const nombre = response.profileObj.givenName;
    const apellidos = response.profileObj.familyName;

    //FORMULARIO  PARA REALIZAR EL LOGIN
    const formData = new FormData();
    formData.append('correo', correo);
    formData.append('psw', psw);

    //FORMULARIO PARA REALIZAR REGISTRO
    const formData2 = new FormData();
    formData2.append('correo', correo);
    formData2.append('nombre', nombre);
    formData2.append('apellidos', apellidos);
    formData2.append('psw', psw);
    formData2.append('tipo', "propietario");
    formData2.append('tipo_login', "Google");

    try {
      //CONSULTA PARA VER SI YA EXISTE UN USUARIO CON ESTA CUENTA DE GOOGLE
      const response = await fetch(conf.url + '/loginWeb', {
        method: 'POST',
        body: formData,
      });

        const dataResponse = await response.json();
        
        if (dataResponse.data != null) {
          //REALIZAR LOGIN EN CASO DE QUE EXISTA LA CUENTA
          const tipoCuenta = dataResponse.data.tipo;
          setCuenta(tipoCuenta);
          sessionStorage.setItem('id_usuario', dataResponse.data.id_usuario);
          sessionStorage.setItem('tipo_usuario', dataResponse.data.tipo_usuario);
          if (dataResponse.data.tipo === "Pro") {
              navigate('/mainAdmin');
          } else if (dataResponse.data.tipo === "Free") {
              navigate('/mainAdminFree');
          }else if (dataResponse.data.tipo_usuario === "colaborador"){
            alert("Acceso único a usuarios propietarios");
          }
        } else {
          //REALIZAR REGISTRO DE UN ACUENTA NUEVA PARA DESPUES HACER EL LOGIN
          const response = await fetch(conf.url + '/registroUsuario', {
            method: 'POST',
            body: formData2,
          });
          const dataResponse = await response.json();
          alert(dataResponse.mensaje);
          if(dataResponse.id_usuario > 0) {
            const response = await fetch(conf.url + '/loginWeb', {
              method: 'POST',
              body: formData,
            });
            const dataResponse = await response.json();
            const tipoCuenta = dataResponse.data.tipo;
            setCuenta(tipoCuenta);
            sessionStorage.setItem('id_usuario', dataResponse.data.id_usuario);
            sessionStorage.setItem('tipo_usuario', dataResponse.data.tipo_usuario);
            if (dataResponse.data.tipo === "Pro") {
                navigate('/mainAdmin');
            } else if (dataResponse.data.tipo === "Free") {
                navigate('/mainAdminFree');
            }else if (dataResponse.data.tipo_usuario === "colaborador"){
              alert("Acceso único a usuarios propietarios");
            }
          }
          
        }

    } catch (error) {
      console.error(error.message);
      alert(error);
    }
  }

  const onFailure = (response) => {
    console.log("Error: " + response);
  }

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
  
        if (dataResponse.resultado) {
          console.log("OK: ",dataResponse);
          // Obtener el tipo de cuenta (tipo de usuario) de la respuesta
          const tipoCuenta = dataResponse.data.tipo;
          // Almacenar el tipo de cuenta en el estado cuenta
          setCuenta(tipoCuenta);
          // Almacenar el id_usuario en localStorage
          sessionStorage.setItem('id_usuario', dataResponse.data.id_usuario);
          // Almacenar tipo de usuario
          sessionStorage.setItem('tipo_usuario', dataResponse.data.tipo_usuario);
          // Redirigir según el tipo de cuenta
          if (dataResponse.data.tipo === "Pro") {
              navigate('/mainAdmin');
          } else if (dataResponse.data.tipo === "Free") {
              navigate('/mainAdminFree');
          }else if (dataResponse.data.tipo_usuario === "colaborador"){
            alert("Acceso único a usuarios propietarios");
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
      console.error('Error');
      alert('Error al iniciar sesión, intenta de nuevo');
      console.error(error.message);
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
      <GoogleLogin
          className="btn btn-outline-primary mx-3"
          clientId="191244130158-qmn4snu41sfu0tfrc0u3ktb1kdubtdjo.apps.googleusercontent.com"
          buttonText="Inicio de sesión rápido con Google"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
        />
      </div>
      <div className="d-flex justify-content-center mt-3">
        <img src={facebook} style={{ width: '40px' }} alt="Imagen facebook" />
        <FacebookLogin
          appId="745129577370445"
          autoLoad={false}
          fields="name,email"
          callback={responseFacebook}
          cssClass="btn btn-outline-primary mx-3"
          textButton="Inicio de sesión rápido con Facebook"
        />
      </div>
    </div>
  );
}

export default Login;