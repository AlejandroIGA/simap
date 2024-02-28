import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Menu from '../components/Menu';

function Dispositivos() {
    const [tipoDispositivo, setTipoDispositivo] = useState('maestro');
    const [dispositivoMaestro, setDispositivoMaestro] = useState('');
    const [nombre, setNombre] = useState('');
    const [direccionMAC, setDireccionMAC] = useState('');
    const [nombreRed, setNombreRed] = useState('');
    const [contraseña, setContraseña] = useState('');

    return (
        <div style={{ background: '#f2f2f2' }}>
            <Menu />
            <div className='container-fluid p-4'>
                <div className="border rounded p-4" style={{background : '#658C7A'}}>
                    <h2 className='text-white'>Nuevo Dispositivo</h2>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="tipoDispositivo" className="form-label text-white">Tipo de Dispositivo:</label>
                            <select id="tipoDispositivo" className="form-select" value={tipoDispositivo} onChange={(e) => setTipoDispositivo(e.target.value)}>
                                <option disabled value="">Seleccionar tipo dispositivo</option>
                                <option value="maestro">Maestro</option>
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
                                    <input placeholder='Dirección MAC' type="text" className="form-control" id="direccionMAC" value={direccionMAC} onChange={(e) => setDireccionMAC(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="nombreRed" className="form-label text-white">Nombre de Red:</label>
                                    <input placeholder='Nombre de ser' type="text" className="form-control" id="nombreRed" value={nombreRed} onChange={(e) => setNombreRed(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="contraseña" className="form-label text-white">Contraseña:</label>
                                    <input placeholder='Contraseña' type="password" className="form-control" id="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
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
                                    <input placeholder='Dirección Mac' type="text" className="form-control" id="direccionMAC" value={direccionMAC} onChange={(e) => setDireccionMAC(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dispositivoMaestro" className="form-label text-white">Dispositivo Maestro:</label>
                                    <select id="dispositivoMaestro" className="form-select text" value={dispositivoMaestro} onChange={(e) => setDispositivoMaestro(e.target.value)}>
                                        <option value="">Seleccionar dispositivo maestro</option>
                                    </select>
                                </div>
                            </>
                        )}
                        <button type="submit" className="btn" style={{background: '#ABBF15', color: 'white'}}>Añadir</button>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default Dispositivos;
