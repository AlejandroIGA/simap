import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import agricultor from './css/img/agricultor.png';

function MainAdmin() {

    const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };

    const [idUsuario, setIdUsuario] = ("");
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [tel, setTel] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [tipoLogin, setTipoLogin] = useState("");
    const [empleadosList, setEmpleados] = useState([]);
    const [editar, setEditar] = useState(false);
    const storedSession = localStorage.getItem('sesion');
    const sesion = JSON.parse(storedSession);
    const navigate = useNavigate();

    //useEffect para saber si iniciamos sesión como administrador pro o administrador basic
    useEffect(() => {
        if (sesion) {
            if (sesion.tipo === "Pro") {
                navigate('/mainAdmin');
            } else {
                if (sesion.tipo === "Basic") {
                    navigate('/mainAdminBasic')
                }
            }
        }
    }, [sesion, navigate]);


    const add = () => {
        axios.post("http://localhost:3001/create", {
            nombre: nombre,
            correo: correo,
            tel: tel,
            tipoUsuario: tipoUsuario,
            tipoLogin: tipoLogin
        }).then(() => {
            getEmpleados();
            limpiarCampos();
            Swal.fire({
                title: "<strong>¡Registro exitoso!</strong>",
                html: "<i>El empleado <strong>" + nombre + "</strong> fue registrado con éxito</i>",
                icon: 'success',
                timer: 3000
            });
        });
    }

    const update = () => {
        axios.put("http://localhost:3001/update", {
            idUsuario: idUsuario,
            nombre: nombre,
            correo: correo,
            tel: tel,
            tipoUsuario: tipoUsuario,
            tipoLogin: tipoLogin
        }).then(() => {
            getEmpleados();
            limpiarCampos();
            Swal.fire({
                title: "<strong>¡Actualización exitosa!</strong>",
                html: "<i>El empleado <strong>" + nombre + "</strong> fue actualizado con éxito</i>",
                icon: 'success',
                timer: 3000
            });
        });
    }


    const deleteEmple = (val) => {
        Swal.fire({
            title: 'Confirmar eliminación',
            html: "<i>¿Realmente deseas eliminar a <strong>" + val.nombre + "</strong>?</i>",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡Eliminarlo!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3001/delete/${val.Idusuario}`).then(() => {
                    getEmpleados();
                    limpiarCampos();
                    Swal.fire({
                        text: val.nombre + ' fue eliminado',
                        icon: 'success',
                        timer: 3000
                    });
                });
            }
        });
    }

    const limpiarCampos = () => {
        setNombre("");
        setCorreo("");
        setTel("");
        setTipoUsuario("");
        setTipoLogin("");
    }

    const editarEmpleado = (val) => {
        setEditar(true);
        setIdUsuario(val.idUsuario);
        setNombre(val.nombre);
        setCorreo(val.correo);
        setTipoUsuario(val.tipoUsuario);
        setTipoLogin(val.tipoLogin);
    }

    const filterEmpleados = () => {
        return empleadosList.filter((empleado) => {
            return (
                empleado.nombre === "" ||
                empleado.correo === "" ||
                empleado.tel === "" ||
                empleado.tipoUsuario === "" ||
                empleado.tipoLogin === ""
            );
        });
    };

    const empleadosConCamposVacios = filterEmpleados();

    const getEmpleados = () => {
        axios.get("http://localhost:3001/empleados").then((response) => {
            setEmpleados(response.data);
        });
    }


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
                                <Dropdown.Item href="#">Perfil</Dropdown.Item>
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
                                    className="form-control" placeholder="Ingrese nombre" aria-label="Username" aria-describedby="basic-addon1" value={nombre}
                                    onChange={(event) => { setNombre(event.target.value); }} />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Correo:</span>
                                <input type="text"
                                    className="form-control" placeholder="Ingrese correo" aria-label="Username" aria-describedby="basic-addon1" value={correo}
                                    onChange={(event) => { setCorreo(event.target.value); }} />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Tel.:</span>
                                <input type="text" className="form-control" placeholder="Ingrese número" aria-label="Username" aria-describedby="basic-addon1" value={tel}
                                    onChange={(event) => { setTel(event.target.value); }} />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Tipo de usuario:</span>
                                <input type="password" className="form-control" placeholder="Ingrese tipo (Admin/Colab)" aria-label="Username" aria-describedby="basic-addon1"
                                    value={tipoUsuario} onChange={(event) => { setTipoUsuario(event.target.value); }} />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">Tipo de login:</span>
                                <input type="text" className="form-control" placeholder="Ingrese tipo de login" aria-label="Username" aria-describedby="basic-addon1"
                                    value={tipoLogin} onChange={(event) => { setTipoLogin(event.target.value); }} />
                            </div>

                            <div className="mx-4">
                                {
                                    editar ?
                                        <div>
                                            <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
                                            <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button>
                                        </div>
                                        : <button className='btn btn-success' onClick={add}>Registrar</button>
                                }
                                <Link className='btn btn-danger mx-2 text-white' to="/">Volver</Link>
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
                                <th scope="col">Tipo usuario</th>
                                <th scope="col">Tipo login</th>
                                <th scope="col">Acciones

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleadosConCamposVacios.map((val, key) => (
                                <tr key={val.idUsuario}>
                                    <td>{val.nombre}</td>
                                    <td>{val.correo}</td>
                                    <td>{val.tel}</td>
                                    <td>{val.tipoUsuario}</td>
                                    <td>{val.tipoLogin}</td>
                                    <td>
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <button type="button" className="btn btn-danger text-white" onClick={() => {
                                                deleteEmple(val);
                                            }}>Eliminar</button>
                                            <button type="button" className="btn btn-primary" onClick={() => {
                                                editarEmpleado(val);
                                            }}>Editar</button>
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

export default MainAdmin;