import React, { useState, useEffect } from 'react';
import { Modal, ListGroup } from 'react-bootstrap';
import conf from '../conf';

function EliminarDispositivos ({ visible, onClose }) {
  let idUsuario = sessionStorage.getItem('id_usuario');
  let tipo = sessionStorage.getItem('tipo');
  const [dispositivos, setDispositivos] = useState([]);
  const [selectedDispositivos, setSelectedDispositivos] = useState([]);

  // Función para manejar la selección de dispositivos
  const handleDeviceSelection = (id_dispositivo) => {
    setSelectedDispositivos((prevSelected) => {
      if (prevSelected.includes(id_dispositivo)) {
        return prevSelected.filter((id) => id !== id_dispositivo);
      } else {
        return [...prevSelected, id_dispositivo];
      }
    });
  };


  //OBTENER TODOS LOS DISPOSITIVOS DEL USUARIO
  const getDispositivos = async () => {
    try {
        const id_usuario = idUsuario;
        const formData = new FormData();
        formData.append('id_usuario', id_usuario);

        const response = await fetch(conf.url + '/dispositivos', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDispositivos(data.dispositivos);
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  };

  useEffect(() => {
    getDispositivos();
  }, []);

  const handleSubmit = async () => {
    try {
      for (const id_dispositivo of selectedDispositivos) {
        const formData = new FormData();
        formData.append('id_dispositivo', id_dispositivo);

        const response = await fetch(conf.url + '/borrarDispositivoSuscripcion', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        alert(data.mensaje);
        console.log(data.mensaje);
      }

      console.log("Eliminar los: " + selectedDispositivos);
      alert("Dispositivos eliminados exitosamente");
      onClose();
    } catch (error) {
      console.error('Error al eliminar dispositivos:', error);
      alert('Error al eliminar dispositivos. Por favor, inténtalo de nuevo.');
    }
  };

  const closeModal = async () => {
    onClose();
  };

  return (
    <Modal show={visible} onHide={onClose} animation={false}>
      <Modal.Body>
        <h3>Tu suscripción ha caducado</h3>
        <p>Selecciona los dispositivos que deseas eliminar ({dispositivos.length - selectedDispositivos.length - 3} restantes)</p>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <ListGroup>
            {dispositivos.map((dispositivo) => (
              <ListGroup.Item key={dispositivo.id_dispositivo} onClick={() => handleDeviceSelection(dispositivo.id_dispositivo)}>
                <input type="checkbox" checked={selectedDispositivos.includes(dispositivo.id_dispositivo)} />
                <label>{dispositivo.nombre}</label>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        <button disabled={dispositivos.length - selectedDispositivos.length !== 3} onClick={handleSubmit}>Confirmar</button>
      </Modal.Body>
    </Modal>
  );
};

export default EliminarDispositivos;
