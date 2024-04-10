import React, { useState, useEffect } from 'react';
import { Modal, ListGroup } from 'react-bootstrap';
import conf from '../conf';

function AsignarMaestros ({ visible, onClose }) {
  let idUsuario = sessionStorage.getItem('id_usuario');
  let tipo = sessionStorage.getItem('tipo');
  const [dispositivos, setDispositivos] = useState([]);
  const [dispositivosMaestros, setDispositivosMaestros] = useState([]);
  const [maestro, setMaestro] = useState(0);
  const [id_cosecha, setCosecha] = useState(0);

  const asignarMaestros = async () => {
    try {

        const formData = new FormData();
        formData.append('id_usuario', idUsuario);

        const response = await fetch(conf.url + '/dispositivosSinMaestro', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        setDispositivos(data.dispositivos);
      
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  }

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

  useEffect(() => {
    asignarMaestros();
    getDispositivosMaestros();
  }, []);

  const handleSubmit = async () => {
    try {
      //ACTUALIZAR DISPOSITIVOS DE MAESTROS
        const dispositivosJSON = JSON.stringify(dispositivos);
        const formData = new FormData();
        formData.append('maestro', maestro);
        formData.append('id_cosecha', id_cosecha);
        formData.append('dispositivos', dispositivosJSON);

        const response = await fetch(conf.url + '/actualizarMaestroDispositivo', {
          method: 'POST',
          body: formData,
        });

        const dataResponse = await response.json();
        alert(dataResponse.mensaje);
        onClose();
    } catch (error) {
      console.error('Error al actualizar dispositivos:', error);
      alert('Error al actualizar dispositivos. Por favor, inténtalo de nuevo.');
    }
  };

  const closeModal = async () => {
    onClose();
  };

  return (
    <Modal show={visible} onHide={onClose} animation={false}>
      <Modal.Body>
        <h3>Dispositivos sin Maestro asignado</h3>
        
        { dispositivos && dispositivos.length > 1 ? (
          <>
            <p>Debes asignar un dispositivo maestro a los siguientes dispositivos</p>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <ListGroup>
                <ListGroup.Item style={{ border: '1px solid black', margin: '5px 0', padding: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: '1', marginRight: '10px' }}>
                    {dispositivos.map((dispositivo, index) => (
                      <>
                        <p><strong>Nombre:</strong> {dispositivo.nombre}</p>
                      </>
                    ))}
                    </div>
                    <div style={{ flex: '1' }}>
                      <select value={maestro} 
                      onChange={(e) => {
                        setMaestro(e.target.value);
                        setCosecha(e.target.selectedOptions[0].getAttribute('data-cosecha'))
                        }}>
                        <option value={0}>Seleccionar...</option>
                        {
                          dispositivosMaestros.map((maestro) => (
                              <option className='text-black' value={maestro.id_dispositivo} data-cosecha={maestro.id_cosecha} key={maestro.dispositivo}> {maestro.nombre} </option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                </ListGroup.Item>
              
            </ListGroup>
            </div>
          </>
        ) : (
          <>
          </>
        )}
        <button disabled={maestro === 0} onClick={handleSubmit}>Confirmar</button>

      </Modal.Body>
    </Modal>
  );
};

export default AsignarMaestros;
