import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../views/style.css';
import conf from '../conf';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import agricultor from '../images/Granjero.png';

function MainAdmin() {

  const [id_usuario, setId_usuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [psw, setPsw] = useState('');
  const [tipo_login] = useState('Sistema');
  const [tipo_usuario, setTipo_usuario] = useState('');
  const [empleadosList, setEmpleadosList] = useState(null);
  const [editar, setEditar] = useState(false);
  const navigate = useNavigate();
  const storedSession = sessionStorage.getItem('id_usuario');
  const sesion = JSON.parse(storedSession);



  useEffect(() => {
    if (!sessionStorage.getItem('id_usuario')) {
      alert("Debes iniciar sesión primero");
      navigate('/login');
    }
    getEmpleados();
  }, []);


  const handleLogout = async () => {
    const id_usuario = sessionStorage.getItem('id_usuario');
    const formData = new FormData();
    formData.append('id_usuario', id_usuario);
    try {
      const response = await fetch(conf.url + '/logout', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        sessionStorage.clear()
        console.log("Sesión terminada, id_usuario: " + id_usuario)
        alert("¡Cerraste sesión!");
        navigate("/");
      } else {
        console.error('Error al cerrar sesión:', response.statusText);
        alert('Error al cerrar sesión. Por favor, inténtalo de nuevo más tarde.');
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Por favor, inténtalo de nuevo más tarde.");
    }
  };



  const add = async () => {
    const cuenta_main = sessionStorage.getItem('id_usuario');
    if (!nombre || !apellidos || !correo || !psw || !tipo_usuario) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor completa todos los campos.'
      });
      return;
    }

    const formData2 = new FormData();
    formData2.append("cuenta_main", cuenta_main );
    formData2.append("tipo_usuario", tipo_usuario.toLowerCase());
    const response = await fetch(conf.url + '/getCantidadUsuarios',{
      method: 'POST',
      body: formData2,
    })

    const dataResponse = await response.json()
    console.log("cantidad: ", tipo_usuario, dataResponse.cantidad, tipo_usuario.toLowerCase() === "propietario", dataResponse.cantidad >= 2)

    if(tipo_usuario.toLowerCase() === "colaborador" && dataResponse.cantidad >= 8){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Solo se puedan dar de alta 8 usuarios colaborador"
      });
    }else if(tipo_usuario.toLowerCase() === "propietario" && dataResponse.cantidad >= 2){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Solo se puedan dar de alta 2 usuarios propietarios"
      });
    }else{
      const formData = new FormData();
    formData.append('cuenta_main', cuenta_main);
    formData.append('nombre', nombre);
    formData.append('apellidos', apellidos);
    formData.append('correo', correo);
    formData.append('psw', psw);
    formData.append('tipo_login', tipo_login);
    formData.append('tipo_usuario', tipo_usuario);

    try {
      const response = await fetch(conf.url + '/insertUser', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const dataResponse = await response.json();
        console.log(dataResponse);

        if (dataResponse.resultado) {
          Swal.fire({
            title: "<strong>¡Registro exitoso!</strong>",
            html: "<i>El empleado <strong>" + nombre + "</strong> fue registrado con éxito</i>",
            icon: 'success',
            timer: 3000
          },
            getEmpleados(),
            limpiarCampos());
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: dataResponse.mensaje
          });
        }
      } else {
        console.error('Error al insertar usuario: ', response.statusText);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al insertar usuario'
        });
      }
    } catch (error) {
      console.error('Error: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al insertar usuario'
      });
    }
    }
    
    
  };

  const update = async () => {
    const cuenta_main = sessionStorage.getItem('id_usuario');

    if (!nombre || !apellidos || !correo || !psw || !tipo_usuario) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor completa todos los campos.'
      });
      return;
    }

    const formData2 = new FormData();
    formData2.append("cuenta_main", cuenta_main );
    formData2.append("tipo_usuario", tipo_usuario.toLowerCase());
    const response = await fetch(conf.url + '/getCantidadUsuarios',{
      method: 'POST',
      body: formData2,
    })

    const dataResponse = await response.json()
    console.log("cantidad: ", tipo_usuario, dataResponse.cantidad, tipo_usuario.toLowerCase() === "propietario", dataResponse.cantidad >= 2)

    if(tipo_usuario.toLowerCase() === "colaborador" && dataResponse.cantidad >= 8){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Solo se puedan dar de alta 8 usuarios colaborador"
      });
    }else if(tipo_usuario.toLowerCase() === "propietario" && dataResponse.cantidad >= 2){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Solo se puedan dar de alta 2 usuarios propietarios"
      });
    }else{
    const formData = new FormData();
    formData.append('id_usuario', id_usuario);
    formData.append('nombre', nombre);
    formData.append('apellidos', apellidos);
    formData.append('correo', correo);
    formData.append('psw', psw);
    formData.append('tipo_usuario', tipo_usuario);

    try {
      const response = await fetch(conf.url + '/updateUser', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const dataResponse = await response.json();
        console.log(dataResponse);

        if (dataResponse.resultado) {
          Swal.fire({
            title: "<strong>¡Actualización exitosa!</strong>",
            html: "<i>El empleado <strong>" + nombre + "</strong> fue actualizado con éxito</i>",
            icon: 'success',
            timer: 3000
          },
            getEmpleados(),
            limpiarCampos());
          setEditar(false);
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Sin cambios',
            text: dataResponse.mensaje
          });
        }
      } else {
        console.error('Error al actualizar usuario: ', response.statusText);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar usuario'
        });
      }
    } catch (error) {
      console.error('Error: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar usuario'
      });
    }
  }
  };

  const deleteEmple = async (val) => {
    const formData = new FormData();
    formData.append('id_usuario', val.id_usuario);
    console.log(val.id_usuario);

    const result = await Swal.fire({
      title: 'Confirmar eliminación',
      html: "<i>¿Realmente deseas eliminar a <strong>" + val.nombre + "</strong>?</i>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡Eliminarlo!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(conf.url + '/deleteUser', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const dataResponse = await response.json();
          console.log(dataResponse);

          if (dataResponse.resultado) {
            Swal.fire({
              text: val.nombre + ' fue eliminado',
              icon: 'success',
              timer: 3000
            });
            getEmpleados();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: dataResponse.mensaje
            });
          }
        } else {
          console.error('Error al eliminar usuario: ', response.statusText);
          Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: '¡Antes de eliminar al propietario, debes eliminar los dispositivos y cosechas asociados!'
          });
        }
      } catch (error) {
        console.error('Error: ', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar usuario'
        });
      }
    }
  };

  const limpiarCampos = () => {
    setNombre('');
    setApellidos('');
    setCorreo('');
    setPsw('');
    setTipo_usuario('');
  };

  const editarEmpleado = (val) => {
    setEditar(true);
    setId_usuario(val.id_usuario);
    setNombre(val.nombre);
    setApellidos(val.apellidos);
    setCorreo(val.correo);
    setPsw(val.psw);
    setTipo_usuario(val.tipo_usuario);
  };

  const getEmpleados = async () => {
    const id_usuario = sessionStorage.getItem('id_usuario');
    const formData = new FormData();
    formData.append('id_usuario', id_usuario);
    console.log("id usuario: " + id_usuario);
    try {
      const response = await fetch(conf.url + '/getEmpleados', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const dataResponse = await response.json();
        console.log(dataResponse);
        // Accede a la clave "data" para obtener los detalles de los empleados
        const empleadosData = dataResponse.data;
        setEmpleadosList(empleadosData);
        
      } else {
        console.error('Error al obtener empleados: ', response.statusText);
      }
    } catch (error) {
      console.error('Error: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al obtener empleados'
      });
    }
  };


  return (
    <div className='container-fluid p-0' style={{ background: '#f2f2f2', height:"100vh" }}>
      <nav className="navbar navbar-expand-lg nav">
        <div className="container">
          <a className="navbar-brand" href="#inicio">SIMAP</a>
          <button style={{ zIndex: 1000 }} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div style={{ zIndex: 1000, backgroundColor: '#658C7A', paddingLeft:10 }} className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link type='button' to='/inicio' className='nav-link'>
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link type='button' to='/mainAdmin' className='nav-link'>
                  Usuarios
                </Link>
              </li>
              <li className="nav-item">
                <Link type='button' to='/dispositivos' className='nav-link'>
                  Dispositivos
                </Link>
              </li>
              <li className="nav-item">
                <Link type='button' to='/cultivos' className='nav-link'>
                  Cultivos
                </Link>
              </li>
              <div className='ml-auto'>
                <Dropdown>
                  <Dropdown.Toggle variant='link' id='dropdown-basic'>
                    <img
                      className='mx-4'
                      src={agricultor}
                      style={{ width: '50px' }}
                      alt='Usuario'
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ backgroundColor: '#658C7A', boxShadow: 'none' }}>
                    <Dropdown.Item onClick={()=>navigate('/cuenta')}>Perfil</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </ul>
          </div>
        </div>
      </nav>
      <div>
        <div className='container'>
          <div className='card text-white bg-success mb-3 mt-4'>
            <div className='navbar-box'>
              <div className='mt-2 d-flex justify-content-center'>
                <h3>GESTIÓN DE USUARIOS</h3>
              </div>
            </div>
            <div className='box card-body'>
              <div className='input-group mb-3'>
                <span className='input-group-text' id='basic-addon1'>
                  Nombre:
                </span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Ingrese nombre'
                  aria-label='Username'
                  aria-describedby='basic-addon1'
                  value={nombre}
                  onChange={(event) => {
                    setNombre(event.target.value);
                  }}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text' id='basic-addon1'>
                  Apellidos:
                </span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Ingrese apellidos'
                  aria-label='Username'
                  aria-describedby='basic-addon1'
                  value={apellidos}
                  onChange={(event) => {
                    setApellidos(event.target.value);
                  }}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text' id='basic-addon1'>
                  Correo:
                </span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Ingrese correo'
                  aria-label='Username'
                  aria-describedby='basic-addon1'
                  value={correo}
                  onChange={(event) => {
                    setCorreo(event.target.value);
                  }}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text' id='basic-addon1'>
                  Contraseña:
                </span>
                <input
                  maxLength={10}
                  type='password'
                  className='form-control'
                  placeholder='Ingrese contraseña'
                  aria-label='Username'
                  aria-describedby='basic-addon1'
                  value={psw}
                  onChange={(event) => {
                    setPsw(event.target.value);
                  }}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text' id='basic-addon1'>
                  Tipo de usuario:
                </span>
                <select
                  className='form-control'
                  aria-label='Tipo de usuario'
                  aria-describedby='basic-addon1'
                  value={tipo_usuario}
                  onChange={(event) => {
                    setTipo_usuario(event.target.value);
                  }}
                >
                  <option value=''>Seleccione tipo de usuario</option>
                  <option value='Propietario'>Propietario</option>
                  <option value='Colaborador'>Colaborador</option>
                </select>
              </div>
              <div className='mx-4'>
                {editar ? (
                  <div>
                    <button className='btn btn-warning m-2 text-white' onClick={update}>
                      Actualizar
                    </button>
                    <button
                      className='btn btn-info m-2 text-white'
                      onClick={() => {
                        limpiarCampos();
                        setEditar(false);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button className='btn btn-success' onClick={add}>
                    Registrar
                  </button>
                )}
              </div>
            </div>
          </div>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Nombre</th>
                <th scope='col'>Apellidos</th>
                <th scope='col'>Correo</th>
                <th scope='col'>Contraseña</th>
                <th scope='col'>Tipo usuario</th>
                <th scope='col'>Acciones</th>
              </tr>
            </thead>
            <tbody>
            {empleadosList ? (
  empleadosList.map((val, key) => (
    <tr key={key}>
      <td>{val.id_usuario}</td>
      <td>{val.nombre}</td>
      <td>{val.apellidos}</td>
      <td>{val.correo}</td>
      <td>{val.psw}</td>
      <td>{val.tipo_usuario}</td>
      <td>
        <div className='btn-group' role='group' aria-label='Basic example'>
          <button
            type='button'
            className='btn btn-danger text-white'
            onClick={() => {
              deleteEmple(val);
            }}
          >
            Eliminar
          </button>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => {
              editarEmpleado(val);
            }}
          >
            Editar
          </button>
        </div>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="7">No hay empleados disponibles</td>
  </tr>
)}

            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default MainAdmin;