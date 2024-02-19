import React from "react";
import { Link } from "react-router-dom";
import "./css/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import agricultor from './css/img/agricultor.png';

function MainAdminBasic() {

    const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };


    return (
        <div>
            <nav className="navbar">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <Link className="navbar-brand text-white" to="/">
                        <h1 className="mx-3">SIMAP</h1>
                    </Link>
                    <div className="ml-auto">
                        <Dropdown>
                            <Dropdown.Toggle variant="link" id="dropdown-basic">
                                <img className="mx-4" src={agricultor} style={{ width: '50px' }} alt="Usuario" />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="/administrador">Perfil</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </nav>
            <div>
                <div className="container">
                    <div className="card text-white bg-success mb-3 mt-4">
                        <div className="navbar-box">
                        <div className="mt-2 d-flex justify-content-center">
                                <h3>GESTIÓN DE USUARIOS</h3>
                            </div>
                        </div>
                        <div className="box card-body">
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Nombre completo:</span>
                                <input type="text"
                                    className="form-control" placeholder="Ingrese nombre" aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Correo:</span>
                                <input type="text"
                                    className="form-control" placeholder="Ingrese correo" aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Tel.:</span>
                                <input type="text" className="form-control" placeholder="Ingrese número" aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Tipo de login:</span>
                                <input type="text" className="form-control" placeholder="Ingrese tipo de login" aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                
                            <div className="mx-4">
                                <button className='btn btn-success m-2 text-white'>Registrar</button>
                                <button className='btn btn-warning m-2 text-white'>Actualizar</button>
                            </div>
                        </div>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Correo</th>
                                <th scope="col">Tel.</th>
                                <th scope="col">Tipo login</th>
                                <th scope="col">Acciones
                                
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th></th>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                        <button type="button"
                                            className="btn btn-danger text-white">Eliminar</button>
                                        <button type="button" className="btn btn-primary">Editar</button>
                                    </div>
                                </td>
                                <td>
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default MainAdminBasic;