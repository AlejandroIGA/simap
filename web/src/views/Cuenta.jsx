import 'bootstrap/dist/css/bootstrap.min.css';


import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import agricultor from '../images/Granjero.png';
import conf from '../conf';

function Cuenta() {
    const [responseData, setResponseData] = useState({});
    const navigate = useNavigate();

    let tipo_usuario = sessionStorage.getItem('tipo_usuario'); 
    let id_usuario = sessionStorage.getItem('id_usuario');

    //logout
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

    const msg = () =>{
      alert("La suscripción cambiara a Free cuando finalice el tiempo de la suscripción Pro")
    }

    //peticion post
    const getUsuario = async () => {
        try {
            //const userData = JSON.parse(userDataJSON);
            //const id_usuario = userData.id_usuario;
            //onst tipo = userData.tipo_usuario;
            //setTipo(userData.tipo_usuario);
            const formData = new FormData();
            formData.append("id_usuario", id_usuario);
            formData.append("tipo_usuario", tipo_usuario)

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
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    };


    useEffect(() => {
        if (!id_usuario) {
            alert("Debes iniciar sesión primero");
            navigate('/login');
          } else if (id_usuario) {
            navigate('/cuenta');
            getUsuario();
        }
    }, [])
    
    return (
        <div className="container-fluid p-0 m-0" style={{ background: '#f2f2f2', height: '100vh' }}>
            <nav className="navbar navbar-expand-lg nav">
        <div className="container">
          <a className="navbar-brand" href="#inicio">SIMAP</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
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
                    <Dropdown.Item href='/cuenta'>Perfil</Dropdown.Item>
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
                            tipo_usuario === "propietario" ?
                                <>
                                    {
                                        responseData.data.tipo === "Pro" ?
                                            <div className='col'>
                                                <button className='btn btn-warning' onClick={()=>msg}>Cambiar suscripción</button>

                                            </div>
                                            :


                                            <div className='col'>
                                                <Link type="button" to="/paypal" className='btn btn-warning'>Mejorar suscripción</Link>

                                            </div>
                                    }
                                    <div className='col'>
                                        <button className='btn btn-danger' onClick={()=>handleLogout}>Cerrar sesión</button>

                                    </div>
                                </>

                                :

                                <>
                                    <div className='col'>
                                        <button className='btn btn-danger' onClick={()=>handleLogout}>Cerrar sesión</button>

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