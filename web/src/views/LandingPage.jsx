import 'bootstrap/dist/css/bootstrap.min.css';
import fondo from '../images/fondo.jpg';
import { Link, useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();
    return (
        <div style={{ background: '#f2f2f2' }}>
            <nav className="navbar navbar-expand-lg nav fixed-top">
                <div className="container">
                <button style={{ color: "white" }} className="nav-link" onClick={()=>navigate("/")}>SIMAP</button>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button style={{ color: "white" }} className="nav-link" onClick={()=>navigate("/login")}>Ingresar</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className='container-fluid p-0' id="home">
                <img src={fondo} className="img-fluid m-0 p-0" />
            </div>
            <div className='container pt-3 pb-3' id="nosotros" style={{ fontSize: 25, background: '#f2f2f2' }}>
                <h2 style={{fontWeight:"bold"}}>Nosotros</h2>
                <p>
                    La agricultura de precisión ha emergido como una estrategia innovadora que busca
                    optimizar la producción agrícola al tener en cuenta las particularidades de los cultivos,
                    el estado del suelo y los factores climáticos, alejándose así de métodos más
                    tradicionales y uniformes. Su objetivo principal es mejorar la eficiencia de la producción,
                    lo que a su vez promueve la sostenibilidad, reduce el impacto ambiental y maximiza los
                    rendimientos.
                </p>
                <p>
                    En México, la agricultura desempeña un papel crucial en la economía nacional, con
                    cinco estados: Jalisco, Veracruz, Oaxaca, Chihuahua y Sinaloa, liderando en la
                    producción agrícola a lo largo del territorio nacional. Para el año 2022, el país destinó
                    24.6 millones de hectáreas para la agricultura, obteniendo una producción total de
                    268.6 millones de toneladas, situándonos en el puesto número 11 en producción de
                    cultivos agrícolas.
                </p>
                <p>
                    Sin embargo, a pesar de estos logros, la producción agrícola mundial enfrenta desafíos
                    significativos, como las pérdidas de hasta un 40% debido a plagas y enfermedades que
                    afectan la calidad y el desarrollo de los cultivos, según datos presentados por la FAO.
                    Estas pérdidas tienen un impacto considerable en el sector agrícola, lo que subraya la
                    necesidad de adoptar soluciones innovadoras y tecnológicas.
                </p>
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    <div className="col">
                        <div className="card h-100" style={{ border: "none",background: '#f2f2f2'  }} >
                            <div clasNclassNames="card-body">
                                <h3 className="card-title">Objetivo: </h3>
                                <p className="card-text">
                                    Desarrollar un sistema que automatice el proceso de riego para reducir el consumo de
                                    agua y ayudar en el cuidado de los cultivos mediante la medición continua de diferentes
                                    parámetros ambientales y el procesamiento de está información para ayudar al usuario
                                    en la toma de decisiones.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card h-100" style={{ border: "none",background: '#f2f2f2'  }}>
                            <div className="card-body">
                                <h3 className="card-title">¿Por qué? </h3>
                                <p className="card-text">
                                    El avance tecnológico ha experimentado un crecimiento exponencial en diversas áreas,
                                    y la agricultura no ha sido una excepción. Dada su relevancia en la economía
                                    mexicana, resulta imperativo adoptar tecnologías emergentes que optimicen los
                                    procesos de producción, el manejo de recursos y la calidad de los cultivos. Es esencial
                                    mantener el ritmo con otros países líderes en la aplicación de tecnología agrícola, como
                                    Israel, Alemania, Suiza, Argentina, Canadá y Australia, quienes han demostrado el
                                    impacto positivo que esto puede tener en el sector agrícola.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container pt-3 pb-3' id="suscripciones" style={{ fontSize: 25, background: '#f2f2f2' }}>
                <h2 className="pb-4" style={{fontWeight:"bold"}}>Suscripciones</h2>
                <div className="row row-cols-1 row-cols-md-2 g-4 pt-4">
                    <div className="col">
                        <div className="card h-100" style={{ border: "4px solid #658C7A" }}>
                            <div className="card-body" style={{ background: '#f2f2f2' }}>
                                <h3 className="card-title" style={{fontWeight:"bold"}}>Free: </h3>
                                <ul style={{ textAlign: 'left' }}>
                                    <p style={{fontWeight:"bold"}}>Beneficios: </p>
                                    <li>
                                        1 administrador.
                                    </li>
                                    <li>
                                        2 colaboradores.
                                    </li>
                                    <li>
                                        1 dispositivo maestro.
                                    </li>
                                    <li>
                                        2 dispositivos esclavo.
                                    </li>
                                </ul>
                                <p style={{fontWeight:"bold"}}>Gratuita.</p>
                                <button class="btn" style={{background:"#ABBF15",fontWeight:"bold"}} onClick={()=>navigate("/login")}>Obtener</button>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card h-100" style={{ border: "4px solid #658C7A" }}>
                            <div className="card-body" style={{ background: '#f2f2f2' }}>
                                <h3 className="card-title" style={{fontWeight:"bold"}}>Pro:</h3>
                                <ul style={{ textAlign: 'left' }}>
                                <p style={{fontWeight:"bold"}}>Beneficios: </p>
                                    <li>
                                        3 administradores.
                                    </li>
                                    <li>
                                        10 colaboradores.
                                    </li>
                                    <li>
                                        5 dispositivo maestro.
                                    </li>
                                    <li>
                                        30 dispositivos esclavo.
                                    </li>
                                </ul>
                                <p style={{fontWeight:"bold"}}>$285 al mes.</p>
                                <button class="btn" style={{background:"#ABBF15",fontWeight:"bold"}} onClick={()=>navigate("/login")}>Obtener</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;
