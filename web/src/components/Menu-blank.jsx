import 'bootstrap/dist/css/bootstrap.min.css';
import granjero from '../images/Granjero.png';
import { Link, useNavigate } from 'react-router-dom';

function MenuBlank(){

    return(
        <div className='container-fluid p-0'>
            <nav className="navbar navbar-expand-lg nav">
                <div className="container">
                    <a className="navbar-brand" href="#inicio"><h1>SIMAP</h1> </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <h1 className="fw-light">Registro</h1>
                    </div>
                </div>
            </nav>
        </div>
    )
}
export default MenuBlank;
