import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../views/style.css';
import conf from '../conf';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import agricultor from '../images/Granjero.png';

function MainAdminFree() {

    const [id_usuario, setId_usuario] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [tel, setTel] = useState('');
    const [tipoLogin, setTipoLogin] = useState('');
    const [empleadosList, setEmpleados] = useState([]);
    const [editar, setEditar] = useState(false);
    const navigate = useNavigate();
    const storedSession = localStorage.getItem('id_usuario');
    const sesion = JSON.parse(storedSession);

    useEffect(() => {
        if (!sesion) {
            alert("Debes iniciar sesión primero");
            navigate('/login');
        } else if (sesion) {
            navigate('/mainAdminFree');
        }
    }, [sesion, navigate]);


    const handleLogout = async () => {
        const id_usuario = localStorage.getItem('id_usuario');
        const formData = new FormData();
        formData.append('id_usuario', id_usuario);

        try {
            const response = await fetch(conf.url + '/logout', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                localStorage.removeItem('id_usuario');
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

    const add = () => {

    };

    const update = () => {

    };

    const deleteEmple = (val) => {

    };

    const limpiarCampos = () => {
        setNombre('');
        setCorreo('');
        setTel('');
        setTipoLogin('');
    };

    const editarEmpleado = (val) => {
        setEditar(true);
        setNombre(val.nombre);
        setCorreo(val.correo);
        setTipoLogin(val.tipoLogin);
    };

    const filterEmpleados = () => {
        return empleadosList.filter((empleado) => {
            return (
                empleado.nombre === '' ||
                empleado.correo === '' ||
                empleado.tel === '' ||
                empleado.tipoLogin === ''
            );
        });
    };

    const empleadosConCamposVacios = filterEmpleados();


    return (
        <div className='container-fluid p-0' style={{ background: '#f2f2f2' }}>
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
                                <Link type='button' to='/mainAdminFree' className='nav-link'>
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
                                    Nombre completo:
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
                                    Tel.:
                                </span>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Ingrese número'
                                    aria-label='Username'
                                    aria-describedby='basic-addon1'
                                    value={tel}
                                    onChange={(event) => {
                                        setTel(event.target.value);
                                    }}
                                />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text' id='basic-addon1'>
                                    Tipo de login:
                                </span>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Ingrese tipo de login'
                                    aria-label='Username'
                                    aria-describedby='basic-addon1'
                                    value={tipoLogin}
                                    onChange={(event) => {
                                        setTipoLogin(event.target.value);
                                    }}
                                />
                            </div>

                            <div className='mx-4'>
                                {editar ? (
                                    <div>
                                        <button className='btn btn-warning m-2' onClick={update}>
                                            Actualizar
                                        </button>
                                        <button
                                            className='btn btn-info m-2'
                                            onClick={limpiarCampos}
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
                                <th scope='col'>Correo</th>
                                <th scope='col'>Tel.</th>
                                <th scope='col'>Tipo login</th>
                                <th scope='col'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleadosConCamposVacios.map((val, key) => (
                                <tr key={val.idUsuario}>
                                    <td>{val.nombre}</td>
                                    <td>{val.correo}</td>
                                    <td>{val.tel}</td>
                                    <td>{val.tipoLogin}</td>
                                    <td>
                                        <div
                                            className='btn-group'
                                            role='group'
                                            aria-label='Basic example'
                                        >
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MainAdminFree;