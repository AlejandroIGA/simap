import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import conf from '../conf';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Dropdown } from 'react-bootstrap';
import agricultor from '../images/Granjero.png';

function ConfirmarEliminacion({ onConfirmar, onCancel }) {
  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'transparent', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-dialog" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className="modal-content" style={{ backgroundColor: 'black' }}>
          <div className="modal-body">
              <h3 className='text-white'>¿Eliminar dispositivo?</h3>
          </div>
          <div className="modal-footer d-flex justify-content-between align-items-stretch">
              <button type="button" className="btn text-white" onClick={onConfirmar}>Si</button>
              <div className="bg-white" style={{ width: '1px' }}></div>
              <button type="button" className="btn text-white" onClick={onCancel}>No</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dispositivos() {
    const [showConfirmarEliminacion, setShowConfirmarEliminacion] = useState(false);
    const [tipoDispositivo, setTipoDispositivo] = useState('maestro');
    const [accion, setAccion] = useState('alta');
    const [nombre, setNombre] = useState('');
    const [direccionMAC, setDireccionMAC] = useState('');
    const [dispositivoMaestro, setDispositivoMaestro] = useState('');
    const [idCosecha, setIdCosecha] = useState(0);
    let idUsuario = sessionStorage.getItem('id_usuario');
    let tipo = sessionStorage.getItem('tipo');
    const [id_dispositivo, setIdDispositivo] = useState(0);
    const [dispositivos, setDispositivos] = useState([]);
    const [cosechas, setCosechas] = useState([]);
    const [dispositivosMaestro, setDispositivosMaestros] = useState([]);

    const navigate = useNavigate();

    //Logout
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

      //OBTENER TODOS LOS DISPOSITIVOS DEL USUARIO
    const getDispositivos = async () => {
        try {
            const formData = new FormData();
            formData.append("id_usuario", idUsuario);

            const response = await fetch(conf.url+"/dispositivos", {
            method: 'POST',
            body: formData
            });

            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setDispositivos(data.dispositivos);
        } catch (error) {
        console.error("ERROR:", error.message);
        }
    };

    // Obtener cosechas
    const getCosechas = async () => {
      const formData = new FormData();
      formData.append('id_usuario', idUsuario);

      try {
        const response = await fetch(conf.url + '/getCultivos', {
          method: 'POST',
          body: formData,
        });

        const dataResponse = await response.json();
        setCosechas(dataResponse.data);
      } catch (error) {
        console.error('Error al obtener dispositivos maestros del usuario :' + idUsuario + error);
      }
    };

    //OBTENER DISPOSITIVOS MAESTRO
    const getDispositivosMaestros = async () => {
        const formData = new FormData();
        formData.append('id_usuario', idUsuario);
    
        try {
          const response = await fetch(conf.url + '/dispositivosMaestros', {
            method: 'POST',
            body: formData,
          });
    
          const dataResponse = await response.json();
          setDispositivosMaestros(dataResponse.dispositivosMaestro);
        } catch (error) {
          console.error('Error al obtener dispositivos maestros del usuario :' + idUsuario + error);
        }
      };

    const handleSubmit = async () => {
        if (tipo === "Free" && dispositivos.length === 3) {
          alert("No puede dar de alta más dispositivos");
        } else if (tipo === "Pro" && dispositivos.length === 10) {
          alert("Máximo de dispositivos alcanzados")
        } else {
          if(cosechas != null) {
            if(tipoDispositivo === "maestro"){
              if (!nombre || !direccionMAC || !idCosecha) {
                  alert('Por favor completa todos los campos.');
                  return;
                }
                if (nombre.length < 5) {
                  alert('El nombre debe tener mínimo 5 caracteres.');
                  return;
                }
                if (direccionMAC.length < 8 || direccionMAC.length > 12) {
                  alert('La dirección MAC debe tener entre 8 y 12 caracteres.');
                  return;
                }
          } else if (tipoDispositivo === "esclavo") {
              if (!nombre || !direccionMAC || !dispositivoMaestro) {
                  alert('Por favor completa todos los campos.');
                  return;
                }
                if (nombre.length < 5) {
                  alert('El nombre debe tener mínimo 5 caracteres.');
                  return;
                }
                if (direccionMAC.length < 0) {
                  alert('La dirección MAC debe tener exactamente 12 caracteres.');
                  return;
                }       
          }
            
      
          const formData = new FormData();
          formData.append('nombre', nombre);
          formData.append('mac', direccionMAC);
          formData.append('tipo', tipoDispositivo);
          formData.append('maestro', dispositivoMaestro);
          formData.append('id_usuario', idUsuario);
          formData.append('id_cosecha', idCosecha);
      
          try {
            const response = await fetch(conf.url + '/nuevoDispositivo', {
              method: 'POST',
              body: formData,
            });
      
            const dataResponse = await response.json();
      
              if (dataResponse.resultado && dataResponse.id_dispositivo > '0') {
                alert(dataResponse.mensaje);
              } else {
                alert(dataResponse.mensaje);
              }
          } catch (error) {
            alert('Error agregar dispositivo. Por favor, inténtalo de nuevo.');
          }
          getDispositivos();
          getDispositivosMaestros();
          limpiarCampos();
          } else {
            alert("Primero debes de dar de alta una cosecha")
          }
        }
      };

      const limpiarCampos = () => {
        setNombre('');
        setDireccionMAC('');
        setTipoDispositivo('maestro');
        setIdCosecha(0);
        setDispositivoMaestro(0);
      }

    // CONFIRMACION ELIMINACION
    const handleEliminarClick = (id_dispositivo) => {
        setShowConfirmarEliminacion(true);
        setIdDispositivo(id_dispositivo);
    };

    // ELIMINAR DISPOSITIVO
    const handleConfirmarEliminar = async () => {
      try {

        const formData = new FormData();
        formData.append("id_dispositivo", id_dispositivo);
  
  
        const response = await fetch(conf.url+"/borrarDispositivo", {
          method: 'POST',
          body: formData,
        });
  
        const dataResponse = await response.json();
        console.log(dataResponse);
  
        alert(dataResponse.mensaje);
  
        getDispositivos();
        getDispositivosMaestros();
        setShowConfirmarEliminacion(false);
      } catch (error) {
        console.error("ERROR:", error.message);
      }
    };

    //CANCELAR ELIMINACION
    const handleCancelarEliminar = () => {
        setShowConfirmarEliminacion(false);
    };

    // CAMPOS DISPOSITIVO EDITAR
    const dispositivoEditar = (dispositivoEditar) => {
      setNombre(dispositivoEditar.nombre);
      setDireccionMAC(dispositivoEditar.mac);
      setTipoDispositivo(dispositivoEditar.tipo)
      setDispositivoMaestro(dispositivoEditar.maestro === null ? ' ' : dispositivoEditar.maestro);
      setIdDispositivo(dispositivoEditar.id_dispositivo);
      setIdCosecha(dispositivoEditar.id_cosecha);
      setAccion('editar');
    }

    //EDITAR DISPOSITIVO
  const handleEdit = async () => {

    if(tipoDispositivo === "maestro") {
      if (!nombre || !direccionMAC || !idCosecha) {
        alert('Por favor completa todos los campos.');
        return;
      }
      if (nombre.length < 5) {
        alert('El nombre debe tener mínimo 5 caracteres.');
        return;
      }
      if (direccionMAC.length < 8 || direccionMAC.length > 12) {
        alert('La dirección MAC debe tener entre 8 y 12 caracteres.');
        return;
      }
    } else if(tipoDispositivo === "esclavo") {
      if (!nombre || !direccionMAC || !dispositivoMaestro) {
        alert('Por favor completa todos los campos.');
        return;
      }
      if (nombre.length < 5) {
        alert('El nombre debe tener mínimo 5 caracteres.');
        return;
      }
      if (direccionMAC.length !== 12) {
        alert('La dirección MAC debe tener exactamente 12 caracteres.');
        return;
      }  
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('mac', direccionMAC);
    formData.append('tipo', tipoDispositivo);
    formData.append('maestro', dispositivoMaestro);
    formData.append('id_usuario', idUsuario);
    formData.append('id_dispositivo', id_dispositivo);
    formData.append('id_cosecha', idCosecha);

    try {
      const response = await fetch(conf.url + '/editarDispositivo', {
        method: 'POST',
        body: formData,
      });

      const dataResponse = await response.json();

        if (dataResponse.resultado && dataResponse.id_dispositivo > '0') {
          alert(dataResponse.mensaje);
        } else {
          alert(dataResponse.mensaje);
        }
    } catch (error) {
      alert('Error al editar dispositivo. Por favor, inténtalo de nuevo.');
    }
    getDispositivos();
    getDispositivosMaestros();
    limpiarCampos();
    setAccion("alta");
  };

  useEffect(() => {
      getDispositivos();
      getDispositivosMaestros();
      getCosechas();
  },[]);


    return (
        <div style={{ background: '#f2f2f2', height:"100vh" }}>
                       <nav className="navbar navbar-expand-lg nav">
        <div className="container">
          <a className="navbar-brand" href="#inicio">SIMAP</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
            <div className='container-fluid p-4'>
                <div className="row">
                    <div className="col-md-6" style={{ position: 'sticky', top: '0' }}>
                        <div className="border rounded p-4" style={{ background: '#658C7A' }}>
                          {accion === 'alta' ? (
                            <h2 className='text-white'>Nuevo Dispositivo</h2>
                          ) : (
                            <h2 className='text-white'>Modificar Dispositivo</h2>
                          )
                          }
                                <div className="mb-3">
                                    <label htmlFor="tipoDispositivo" className="form-label text-white">Tipo de Dispositivo:</label>
                                    <select id="tipoDispositivo" className="form-select" value={tipoDispositivo} onChange={(e) => setTipoDispositivo(e.target.value)}>
                                        <option selected value="maestro">Maestro</option>
                                        <option value="esclavo">Esclavo</option>
                                    </select>
                                </div>
                                {tipoDispositivo === 'maestro' && (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="nombre" className="form-label text-white">Nombre:</label>
                                            <input placeholder='Nombre' type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="direccionMAC" className="form-label text-white">Dirección MAC:</label>
                                            <input placeholder='Dirección MAC' minLength={12} maxLength={12} type="text" className="form-control" id="direccionMAC" value={direccionMAC} onChange={(e) => setDireccionMAC(e.target.value.toUpperCase())} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="idCosecha" className="form-label text-white">Cosecha:</label>
                                            <select id="idCosecha" className="form-select text" value={idCosecha} 
                                            onChange={(e) => {
                                                setIdCosecha(e.target.value);
                                                }}>
                                            <option value="">Seleccionar cosecha</option>
                                                {
                                                    cosechas != null ? (
                                                        cosechas.map((cosecha) => (
                                                            <option className='text-black' value={cosecha.id_cosecha} key={cosecha.id_cosecha}> {cosecha.nombre} </option>
                                                        ))
                                                    ) : (
                                                        <option value="">No hay cosechas </option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </>
                                )}
                                {tipoDispositivo === 'esclavo' && (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="nombre" className="form-label text-white">Nombre:</label>
                                            <input placeholder='Nombre' type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="direccionMAC" className="form-label text-white">Dirección MAC:</label>
                                            <input placeholder='Dirección Mac' minLength={12} maxLength={12} type="text" className="form-control" id="direccionMAC" value={direccionMAC} onChange={(e) => setDireccionMAC(e.target.value.toUpperCase())} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dispositivoMaestro" className="form-label text-white">Dispositivo Maestro:</label>
                                            <select id="dispositivoMaestro" className="form-select text" value={dispositivoMaestro} 
                                            onChange={(e) => {
                                                const selectedOption = e.target.options[e.target.selectedIndex];
                                                setDispositivoMaestro(e.target.value);
                                                setIdCosecha(selectedOption.getAttribute("id_cosecha"));
                                                }}>
                                            <option value="">Seleccionar dispositivo maestro</option>
                                                {
                                                    dispositivosMaestro != null ? (
                                                        dispositivosMaestro.map((maestro) => (
                                                            <option className='text-black' id_cosecha={maestro.id_cosecha} psw={maestro.psw} ssid={maestro.ssid} value={maestro.id_dispositivo} key={maestro.id_dispositivo}> {maestro.nombre} </option>
                                                        ))
                                                    ) : (
                                                        <option value="">No hay dispositivos maestro </option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </>
                                )}
                                <div className="text-end mb-2">
                                {accion === 'alta' ? (
                                   <button onClick={handleSubmit} type="submit" className="btn btn-lg" style={{ background: '#ABBF15', color: 'white' }}>Añadir</button>
                                ) : (
                                  <>
                                  <button onClick={handleEdit} type="submit" className="btn btn-lg m-3" style={{ background: '#ABBF15', color: 'white' }}>Guardar</button>
                                  <button onClick={() => {setAccion('alta'); limpiarCampos();}} type="submit" className="btn btn-lg" style={{ background: 'red', color: 'white' }}>Cancelar</button>
                                  </>
                                )
                                }
                                </div> 
                        </div>
                    </div>
                    <div className="col-md-6" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                        {dispositivos.length > 0 ? (
                            dispositivos.map((dispositivo, index) => (
                              <div key={index} className="border rounded p-3 m-2 d-flex justify-content-between align-items-center" style={{ background: '#658C7A' }}>
                                <div>
                                    <h4 className='text-white'>Dispositivo: {dispositivo.nombre} </h4>
                                    <p className='text-white'>MAC: {dispositivo.mac} </p>
                                    <p className='text-white'>Tipo de dispositivo: {dispositivo.tipo} </p>
                                    <p className='text-white'>Cosecha: {dispositivo.cosecha} </p>
                                </div>
                                <div>
                                  <div className='m-3'>
                                      <button className="btn" style={{ backgroundColor: '#ABBF15' }} onClick={() => dispositivoEditar(dispositivo)}>
                                          <i className="bi bi-pencil-square"></i>
                                      </button>
                                  </div>
                                  <div className='m-3'>
                                  <button className="btn" style={{ backgroundColor: 'red' }} onClick={() => handleEliminarClick(dispositivo.id_dispositivo)}>
                                    <i className="bi bi-trash"></i>
                                  </button>
                                      {showConfirmarEliminacion && <ConfirmarEliminacion onConfirmar={handleConfirmarEliminar} onCancel={handleCancelarEliminar} />}
                                  </div>
                                </div>
                              </div>
                            ))  
                        ) : (
                            <p>No hay dispositivos dados de alta</p>
                        )
                            
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Dispositivos;
