import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from '../components/Menu';

function Cuenta() {
    return (
        <div className="container-fluid p-0 m-0" style={{ background: '#f2f2f2', height: '100vh' }}>
            <Menu />
            <div className='container pt-3 pb-3'>
                <div className='row'>
                    <div className='col-6'>
                        <h2 style={{ fontWeight: "bold" }}>Cuenta</h2>
                    </div>
                </div>
                <div className='container p-0 pb-5'>
                    <div className='row pt-3' style={{ fontSize: 25 }}>
                        <div className='col'>
                            <p><span style={{ fontWeight: "bold" }}>Nombre: </span>Juan</p>
                        </div>
                        <div className='col'>
                            <p><span style={{ fontWeight: "bold" }}>Correo: </span>Juan</p>

                        </div>
                        <div className='col'>
                            <p><span style={{ fontWeight: "bold" }}>Suscripción: </span>Juan</p>

                        </div>
                    </div>
                    <div className='row pt-3' style={{ fontSize: 25 }}>
                        <div className='col-4'>
                            <p><span style={{ fontWeight: "bold" }}>Fecha de inicio: </span>Juan</p>

                        </div>
                        <div className='col-4'>
                            <p><span style={{ fontWeight: "bold" }}>Fecha fin: </span>Juan</p>
                        </div>
                    </div>
                    <div className='row text-center pt-3'>
                        <div className='col'>
                            <button className='btn btn-warning'>Cambiar suscripción</button>

                        </div>
                        <div className='col'>
                            <button className='btn btn-danger'>Cerrar sesión</button>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )

}

export default Cuenta;