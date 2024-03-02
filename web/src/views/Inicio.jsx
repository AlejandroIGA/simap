import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import agricultor from '../images/Granjero.png';

import conf from '../conf';

function Inicio(){
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
    return(
        <div style={{ background: '#f2f2f2' }}>
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
        
    </div >
    )
}

export default Inicio;