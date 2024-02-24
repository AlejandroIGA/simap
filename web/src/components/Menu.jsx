import 'bootstrap/dist/css/bootstrap.min.css';
import granjero from '../images/Granjero.png';
import { Link, useNavigate } from 'react-router-dom';

function Menu(){
return(
    <div className='container-fluid p-0'>
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
                                <Link type='button' to='/' className='nav-link'>
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
                            <li className="nav-item">
                                <Link type='button' to='/cuenta'>
                                    <img src={granjero} style={{ maxHeight: '50px' }} alt="Granjero" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >
    </div>
    
)
}
export default Menu;
