import 'bootstrap/dist/css/bootstrap.min.css';
import granjero from '../images/Granjero.png';
import { Link, useNavigate, navigate } from 'react-router-dom';

function MenuBlank(){
    const navigate = useNavigate();
    return(
        <div className='container-fluid p-0'>
            <nav className="navbar navbar-expand-lg nav">
                <div className="container">
                    <button style={{ color: "white" }} className="nav-link" onClick={()=>navigate("/")}>SIMAP</button>
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
