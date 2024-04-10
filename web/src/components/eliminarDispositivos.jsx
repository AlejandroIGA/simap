import React, { useState, useEffect } from 'react';
import { Modal, ListGroup } from 'react-bootstrap';
import conf from '../conf';

function EliminarDispositivos ({ visible, onClose }) {
  let idUsuario = sessionStorage.getItem('id_usuario');
  let tipo = sessionStorage.getItem('tipo');
  const [dispositivos, setDispositivos] = useState([]);
  const [dispositivosEsclavo, setDispositivosEsclavo] = useState([]);
  const [selectedDispositivos, setSelectedDispositivos] = useState([]);
  const [idMaestro, setIdMaestro] = useState([]);
  const [selectedDispositivosEsclavo, setSelectedDispositivosEsclavo] = useState([]);

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

  const handleDeviceSelectionEsclavo = (id_dispositivo) => {
    setSelectedDispositivosEsclavo((prevSelected) => {
      if (prevSelected.includes(id_dispositivo)) {
        return prevSelected.filter((id) => id !== id_dispositivo);
      } else {
        return [...prevSelected, id_dispositivo];
      }
    });
  };


  //OBTENER TODOS LOS DISPOSITIVOS DEL USUARIO
  const getDispositivosMaestro = async () => {
    try {
        const id_usuario = idUsuario;
        const formData = new FormData();
        formData.append('id_usuario', id_usuario);

        const response = await fetch(conf.url + '/dispositivosMaestrosSuscripcion', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Maestros: " + JSON.stringify(data.dispositivosMaestro));
        setDispositivos(data.dispositivosMaestro);
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  };

  const getDispositivosEsclavo = async () => {
    try {
        const id_usuario = idUsuario;
        const formData = new FormData();
        formData.append('id_usuario', id_usuario);

        const response = await fetch(conf.url + '/dispositivosEsclavosSuscripcion', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Esclavo: " + JSON.stringify(data.dispositivosEsclavo));
        setDispositivosEsclavo(data.dispositivosEsclavo);
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  };

  useEffect(() => {
    getDispositivosMaestro();
    getDispositivosEsclavo();
  }, []);

  const handleSubmit = async () => {
    try {
      //ELIMINAR DISPOSITIVOS MAESTRO SELECCIONADOS
      for (const id_dispositivo of selectedDispositivos) {
        const formData = new FormData();
        formData.append('id_dispositivo', id_dispositivo);

        const response = await fetch(conf.url + '/borrarDispositivoSuscripcion', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log(data.mensaje);
      }

      //ELIMINAR DISPOSITIVOS ESCLAVO SELECCIONADOS
      for (const id_dispositivo of selectedDispositivosEsclavo) {
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
        { dispositivos.length > 1 ? (
          <>
            <p>Tienes que eliminar ({dispositivos.length - selectedDispositivos.length - 1}) dispositivos maestro</p>
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
          </>
        ) : (
          <>
          </>
        )}
        { dispositivosEsclavo.length > 2 ? (
          <>
          <p>Tienes que eliminar ({dispositivosEsclavo.length - selectedDispositivosEsclavo.length - 2}) dispositivos esclavo</p>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <ListGroup>
              {dispositivosEsclavo.map((dispositivo) => (
                <ListGroup.Item key={dispositivo.id_dispositivo} onClick={() => handleDeviceSelectionEsclavo(dispositivo.id_dispositivo)}>
                  <input type="checkbox" checked={selectedDispositivosEsclavo.includes(dispositivo.id_dispositivo)} />
                  <label>{dispositivo.nombre}</label>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          </>
        ) : (
          <>
          </>
        )
        }
        {dispositivos.length !== 0 && dispositivosEsclavo.length !== 0 && (
            <>
              <button disabled={dispositivos.length - selectedDispositivos.length !== 1 || dispositivosEsclavo.length - selectedDispositivosEsclavo.length !== 2} onClick={handleSubmit}>Confirmar</button>
            </>
        )}
        {dispositivos.length !== 0 && dispositivosEsclavo.length === 0 && (
            <>
              <button disabled={dispositivos.length - selectedDispositivos.length !== 1} onClick={handleSubmit}>Confirmar</button>
            </>
        )}
        {dispositivos.length === 0 && dispositivosEsclavo.length !== 0 && (
            <>
              <button disabled={dispositivosEsclavo.length - selectedDispositivosEsclavo.length !== 2} onClick={handleSubmit}>Confirmar</button>
            </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EliminarDispositivos;
