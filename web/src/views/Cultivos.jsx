import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from '../components/Menu';
import conf from '../conf';

function Cultivos() {
    const [parametro, setParametro] = useState('nombre');
    const [globalFilter, setGlobalFilter] = useState('');
    const [responseData, setResponseData] = useState([]);
    const [plantasData, setPlantasData] = useState([]);
    const [editarForm, setEditarForm] = useState(false);
    const [fechaInicioAux, setFechaInicioAux ] = useState("");

    const [cultivoId, setCultivoId] = useState('');
    const [nombre, setNombre] = useState("");
    const [planta, setPlanta] = useState(1);
    const [siembra, setSiembra] = useState("");
    const [temp_amb_min, setTempAmbMin] = useState("");
    const [temp_amb_max, setTempAmbMax] = useState("");
    const [hum_amb_min, setHumAmbMin] = useState("");
    const [hum_amb_max, setHumAmbMax] = useState("");
    const [hum_sue_min, setHumSueMin] = useState("");
    const [hum_sue_max, setHumSueMax] = useState("");
    const [fecha_inicio, setFechaInicio] = useState("");
    const [fecha_fin, setFechaFin] = useState("");
    const [cosechado, setCosechado] = useState(0);
    const [plaga, setPlaga] = useState(0);
    const [metodo, setMetodo] = useState("insecticida");
    const [efectivo, setEfectivo] = useState("Si");
    const [plagas, setPlagas] = useState([]);
    const [metodos, setMetodos] = useState([]);
    

    let id_usuario = 1;

    const filteredResponseData = responseData.filter((val) => {
        if (parametro === 'nombre') {
            const { nombre } = val;
            const filterText = globalFilter.toUpperCase();
            return nombre.toUpperCase().includes(filterText);
        }
        if (parametro === 'planta') {
            const { planta } = val;
            const filterText = globalFilter.toUpperCase();
            return planta.toUpperCase().includes(filterText);
        }
        if (parametro === 'fecha') {
            const { fecha_inicio } = val;
            const filterText = globalFilter.toUpperCase();
            return fecha_inicio.toUpperCase().includes(filterText);
        }
        else {
            return responseData;
        }
    });

    const borrarDatos = () => {
        setNombre("");
        setPlanta(1);
        setSiembra("");
        setTempAmbMin("");
        setTempAmbMax("");
        setHumAmbMin("");
        setHumAmbMax("");
        setHumSueMin("");
        setHumSueMax("");
        setFechaInicio("");
        setPlantasData([]);
        setCultivoId("");
        setParametro("nombre");
        setFechaFin("");
        setCosechado(0);
        setPlaga(0);
        setMetodo('insecticida');
        setEfectivo("Si");
        setPlagas([]);
        setMetodos([]);
        setFechaInicioAux("");
    }

    //Mandar a llamar plantas para tener los valores en el dropdown
    const getPlantas = async () => {
        try {
            const response = await fetch(conf.url + "/getPlantas/", {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("plantas", data.data)
            setPlantasData(data.data)
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    };

    //Mandar a llamar los valores de una planta en especifico para hacer sugerencia
    const getPlanta = async (id_planta) => {
        try {
            const response = await fetch(conf.url + `/getPlanta/${id_planta}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("planta", data.data[0])
            setTempAmbMin(data.data[0].temp_amb_min);
            setTempAmbMax(data.data[0].temp_amb_max);
            setHumAmbMin(data.data[0].hum_amb_min);
            setHumAmbMax(data.data[0].hum_amb_max);
            setHumSueMin(data.data[0].hum_sue_min);
            setHumSueMax(data.data[0].hum_sue_max);
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    };

    //Manda a llamar los cultivos del usuario
    const getCultivos = async () => {
        try {
            //const userDataJSON = await AsyncStorage.getItem('userData');
            if (true) {
                //const userData = JSON.parse(userDataJSON);
                //const id_usuario = userData.id_usuario;
                
                const formData = new FormData();
                formData.append("id_usuario", id_usuario);
                const response = await fetch(conf.url + "/getCultivos/", {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data.data)
                setResponseData(data.data)
            }
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    };

    //Agregar un cultivo
    const addCultivo = async () => {
        //Validación campos vacios
        if (planta === "" || nombre === "" || siembra === "" || temp_amb_min === "" || temp_amb_max === "" || hum_amb_min === "" || hum_amb_max === "" || hum_sue_min === "" || hum_sue_max === "" || fecha_inicio === "") {
            borrarDatos();
            alert("No se permiten campos vacios");
            
        } 
        else if(temp_amb_min > temp_amb_max || hum_amb_min > hum_amb_max || hum_sue_min > hum_sue_max){
            borrarDatos();
            alert("Los valores minimos no pueden ser mayores a los valores maximos");
        }
        else {
            try {
                    const formData = new FormData();
                    formData.append("id_usuario", id_usuario);
                    formData.append("id_planta", planta);
                    formData.append("nombre", nombre);
                    formData.append("fecha_inicio", fecha_inicio);
                    formData.append("cant_siembra", siembra);
                    formData.append("temp_amb_min", temp_amb_min);
                    formData.append("temp_amb_max", temp_amb_max);
                    formData.append("hum_amb_min", hum_amb_min);
                    formData.append("hum_amb_max", hum_amb_max);
                    formData.append("hum_sue_min", hum_sue_min);
                    formData.append("hum_sue_max", hum_sue_max);

                    const response = await fetch(conf.url + "/addCultivo/", {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    console.log(data);

                    if (data.resultado === true) {
                        borrarDatos();
                        alert(data.mensaje);
                    }else if(data.resultado === false){
                        borrarDatos();
                        alert(data.mensaje);
                    }
            } catch (error) {
                borrarDatos();
                console.error("ERROR:", error.message);
            }
        }
        getCultivos();
    }

    //Eliminar un cultivo
    const deleteCultivo = async ($id_cultivo) => {
        try {
            const response = await fetch(conf.url + `/deleteCultivo/${$id_cultivo}`, {
                method: 'GET',
            });
            const data = await response.json();
            console.log("eliminar: ",data)
            if(data.resultado){
                alert(data.mensaje);
            }else{
                alert(data.mensaje);
            }
            
        } catch (error) {
            console.error("ERROR:", error.message);
        }
        getCultivos();
    }

    //Obtener los datos del cultivo a modificar
    //Mandara a llamar un cultivo para editar los valores
    const getCultivo = async ($id_cultivo) =>{
        console.log("$id_cultivo: ",$id_cultivo)
        try{
            const response = await fetch(conf.url+`/getCultivo/${$id_cultivo}`,{
                method:'GET',
            });
            const data = await response.json();
            console.log("EDITAR: ",data.data[0]);
            setNombre(data.data[0].nombre);
            setPlanta(data.data[0].id_planta);
            setSiembra(data.data[0].cant_siembra);
            setFechaInicio(data.data[0].fecha_inicio);
            setTempAmbMin(data.data[0].temp_amb_min);
            setTempAmbMax(data.data[0].temp_amb_max);
            setHumAmbMin(data.data[0].hum_amb_min);
            setHumAmbMax(data.data[0].hum_amb_max);
            setHumSueMin(data.data[0].hum_sue_min);
            setHumSueMax(data.data[0].hum_sue_max);
        }catch(error){
            console.error(error.message);
        }
    }

    //Editar cultivo
    const updateCultivo = async () => {
        //Validación campos vacios
        if (planta === "" || nombre === "" || siembra === "" || temp_amb_min === "" || temp_amb_max === "" || hum_amb_min === "" || hum_amb_max === "" || hum_sue_min === "" || hum_sue_max === "" || fecha_inicio === "") {
            borrarDatos();
            alert("No se permiten campos vacios");
            
        } 
        else if(temp_amb_min > temp_amb_max || hum_amb_min > hum_amb_max || hum_sue_min > hum_sue_max){
            borrarDatos();
            alert("Los valores minimos no pueden ser mayores a los valores maximos");
        } else {
            try {
                    const formData = new FormData();
                    formData.append("id_cosecha", cultivoId);
                    formData.append("id_planta", planta);
                    formData.append("nombre", nombre);
                    formData.append("fecha_inicio", fecha_inicio);
                    formData.append("cant_siembra", siembra);
                    formData.append("temp_amb_min", temp_amb_min);
                    formData.append("temp_amb_max", temp_amb_max);
                    formData.append("hum_amb_min", hum_amb_min);
                    formData.append("hum_amb_max", hum_amb_max);
                    formData.append("hum_sue_min", hum_sue_min);
                    formData.append("hum_sue_max", hum_sue_max);

                    console.log("formdata: ", formData)
                    const response = await fetch(conf.url + "/updateCultivo/", {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    console.log(data);

                    if (data.resultado === true) {
                        alert(data.mensaje);
                        borrarDatos();
                    }
            } catch (error) {
                console.error("ERROR:", error.message);
            }
        }
        getCultivos();
    }

    //Mandar a llamar las plagas
    const getPlagas = async (id_cultivo) => {
        try {
            const response = await fetch(conf.url + `/getPlagas/${id_cultivo}`, {
                method: 'GET'
            });
            const data = await response.json();
            console.log("plagas", data);
            if (data.resultado === true) {
                setPlagas(data.data);
            } else {
                console.error("Error en la respuesta del servidor:", data.mensaje);
            }
        } catch (error) {
            console.error("Error al obtener las plagas:", error);
        }
    }

    //Mandar a llamar los métodos de combate
    const getMetodos = async () => {
        try {
            const response = await fetch(conf.url + `/getMetodos/`, {
                method: 'GET'
            });
            const data = await response.json();
            console.log("metodos", data.data)
            setMetodos(data.data)
        } catch (error) {
            console.error("ERORR metodos:", error.message);
        }
    }

    //Finalizar un cultivo
    const endCultivo = async () => {
        if (fecha_fin === "") {
            borrarDatos();
            alert("Falta ingresar fecha");
        }else if((new Date(fecha_fin)) < (new Date(fechaInicioAux))){
            borrarDatos();
            alert("La fecha de cosecha debe ser después de la fecha de inicio")
        }
        else if(cosechado<0){
            borrarDatos();
            alert("No se aceptan valores negativos")
        }
        else {
            try {
                const formData = new FormData();
                formData.append("id_cosecha", cultivoId);
                formData.append("fecha_fin", fecha_fin);
                formData.append("cant_cosecha", cosechado);
                formData.append("combate", metodo);
                formData.append("combate_efectivo", efectivo);
                formData.append("plaga", plaga);
                console.log("END CULTIVO: ",formData);
                const response = await fetch(conf.url + "/endCultivo/", {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                console.log("end: ", data);
                if (data.resultado === true) {
                    alert(data.mensaje);
                    borrarDatos();
                }
            } catch (error) {
                console.error("ERROR end:", error.message);
            }
        }
        getCultivos();
    }

    useEffect(() => {
        getCultivos();
    }, [])

    return (
        <div className="container-fluid p-0 m-0" style={{ background: '#f2f2f2', height: '100%' }}>
            <Menu />
            <div className='container pt-3 pb-3'>
                <div className='row'>
                    <div className='col-6'>
                        <h2 style={{fontWeight:"bold"}}>Cultivos</h2>
                    </div>
                    <div className='col-6 text-end'>
                        <button type="button" style={{background:"#ABBF15", color:"#fff", fontWeight:"bold", fontSize:20}}class="btn" data-bs-toggle="modal" data-bs-target="#añadir" onClick={()=>{getPlantas();getPlanta(planta)}}>
                            Añadir
                        </button>
                    </div>
                </div>
            </div>
            {/*<-----------------BUSCADOR--------------------->*/}
            <div className='container-fluid p-0'>
                <div className='container'>
                    <div className='mb-3 '>
                        <input
                            onChange={(event) => {
                                setGlobalFilter(event.target.value);
                            }}
                            value={globalFilter}
                            type='text'
                            name='globalFilter'
                            className='form-control'
                            placeholder='Buscar...'
                            style={{ border: "3px solid #658C7A", borderRadius: 15, marginBottom: 15 }}
                        />
                        <input
                            onChange={(event) => {
                                setParametro(event.target.value);
                            }}
                            type='radio'
                            name='parametro'
                            value='nombre'
                            checked={parametro === 'nombre'} // Aquí se verifica si el valor del estado parametro es igual a 'nombre'
                        />
                        <label htmlFor='regular' className='pe-2'>
                            Nombre
                        </label>
                        <input
                            onChange={(event) => {
                                setParametro(event.target.value);
                            }}
                            type='radio'
                            name='parametro'
                            value='planta'
                        />
                        <label htmlFor='regular' className='pe-2'>
                            Planta
                        </label>
                        <input
                            onChange={(event) => {
                                setParametro(event.target.value);
                            }}
                            type='radio'
                            name='parametro'
                            value='fecha'
                        />
                        <label htmlFor='regular' className='pe-2'>
                            Fecha
                        </label>
                    </div>
                </div>
            </div>

            {/*<--------------------TARJETAS CULTIVOS-------------------------->*/}
            <div className='container p-0 pb-5 px-3'>
                {
                    //Ciclo con los datos recuperados de la peticion getCultivos().
                    filteredResponseData.map((val, key) => {
                        return (
                            <div className="card mb-3" style={{ border: "3px solid #658C7A", borderRadius: 10, background: '#f2f2f2', }} key={key}>
                                <h3 className="card-header text-center" style={{ borderBottom: "3px solid #658C7A" }}>{val.nombre}</h3>
                                <div className="card-body" style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, fontSize: 25 }}>
                                    <div class="row row-cols-1 row-cols-md-2 g-4 pb-3" >
                                        <div class="col">
                                            <div class="card h-100" style={{ border: "none", background: '#f2f2f2', }}>
                                                <div class="card-body">
                                                    <ul class="list-group list-group-flush" >
                                                        <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}><span style={{ fontWeight: "bold" }}>Especie:</span> {val.planta}</li>
                                                        <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}><span style={{ fontWeight: "bold" }}>Temperatura ambiente:</span> {val.temp_amb_min}°C - {val.temp_amb_max}°C</li>
                                                        <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}><span style={{ fontWeight: "bold" }}>Humedad ambiente:</span> {val.hum_amb_min}% - {val.hum_amb_max}%</li>
                                                        <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}><span style={{ fontWeight: "bold" }}>Humedad suelo:</span> {val.hum_sue_min}% - {val.hum_sue_max}%</li>
                                                    </ul>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="col">
                                            <div class="card h-100" style={{ border: "none", background: '#f2f2f2' }}>
                                                <div class="card-body">
                                                    <ul class="list-group list-group-flush" >
                                                        <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}><span style={{ fontWeight: "bold" }}>Fecha de inicio:</span> {val.fecha_inicio.split("-")[2]}-{val.fecha_inicio.split("-")[1]}-{val.fecha_inicio.split("-")[0]}</li>
                                                        <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}><span style={{ fontWeight: "bold" }}>Cantidad sembrada:</span> {val.cant_siembra} Kg</li>
                                                        <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}><span style={{ fontWeight: "bold" }}>Fecha de cosecha: </span> {val.fecha_fin === null? val.fecha_fin:`${val.fecha_fin.split("-")[2]}-${val.fecha_fin.split("-")[1]}-${val.fecha_fin.split("-")[0]}`} </li>
                                                        <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}><span style={{ fontWeight: "bold" }}>Cantidad cosechada: </span> {val.cant_cosecha} Kg</li>
                                                    </ul>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    {
                                        val.fecha_fin !== null ? 
                                        <>
                                        <div class="row row-cols-1 row-cols-md-2" >
                                        <div class="col">
                                            <div class="card h-100" style={{ border: "none", background: '#f2f2f2', }}>
                                                <div class="card-body">
                                                    <ul class="list-group list-group-flush" >
                                                        <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}><span style={{ fontWeight: "bold" }}>Plaga:</span> {val.plaga==="0" ? "No":val.plaga}</li>
                                                        <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}><span style={{ fontWeight: "bold" }}>Combate:</span> {val.combate===null?"-":val.combate}</li>
                                                    </ul>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="col">
                                            <div class="card h-100" style={{ border: "none", background: '#f2f2f2' }}>
                                                <div class="card-body">
                                                    <ul class="list-group list-group-flush" >
                                                        <li class="list-group-item" style={{ background: '#f2f2f2', border: "none" }}><span style={{ fontWeight: "bold" }}>Efectivo:</span> {val.combate_efectivo===null?"-":val.combate_efectivo}</li>
                                                    </ul>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                        </>
                                        :
                                        <>
                                        <div className='row text-center'>
                                        <div className='col'>
                                            <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#editar" style={{background:"#EDE300", fontWeight:"bold", color:"#fff"}}
                                                onClick={()=>{
                                                    setCultivoId(val.id_cosecha);
                                                    getCultivo(val.id_cosecha);
                                                    getPlantas();
                                                    setEditarForm(true);
                                                }}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                        <div className='col'>
                                        <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#finalizar" style={{background:"#ABBF15", fontWeight:"bold", color:"#fff"}}
                                        onClick={()=>{
                                            setCultivoId(val.id_cosecha);
                                            getPlagas(val.id_cosecha);
                                            getMetodos();
                                            setFechaInicioAux(val.fecha_inicio);
                                        
                                        }}
                                        >
                                                Finalizar
                                            </button>

                                        </div>
                                        <div className='col'>
                                        <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#eliminar" style={{background:"#E70000", fontWeight:"bold", color:"#fff"}}
                                        onClick={()=>setCultivoId(val.id_cosecha)}
                                        >
                                                Eliminar
                                            </button>

                                        </div>
                                    </div>
                                        </>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {/*<------------------VENTANAS MODALES/FORMULARIOS---------------------->*/}
            {/*VENTANA MODAL AÑADIR*/}
            <div class="modal fade" id="añadir" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable" >
                    <div class="modal-content" style={{ background: '#658C7A', height: '100%', color: "#fff" }}>
                        <div class="modal-header justify-content-center">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Nuevo cultivo</h1>
                        </div>
                        <div class="modal-body">
                            <form class="row g-3">
                                <div class="col-12">
                                    <label for="nombre" class="form-label">Nombre:</label>
                                    <input type="text" class="form-control" id="nombre"
                                    onChange={e =>{
                                        setNombre(e.target.value);
                                    }}
                                    value = {nombre}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="hum_sue_max" class="form-label">Fecha de inicio:</label>
                                    <input type="date" class="form-control" id="hum_sue_max"
                                    onChange={e=>{
                                        setFechaInicio(e.target.value);
                                    }}
                                    value={fecha_inicio}
                                    />
                                </div>

                                <div class="col-md-6">
                                    <label for="especie" class="form-label">Especie:</label>
                                    <select id="especie" class="form-select" name="planta" value={planta}
                                    onChange= {(event)=>{
                                        setPlanta(event.target.value)
                                        getPlanta(event.target.value)
                                    }}
                                    >
                                     {
                                        plantasData.map((planta)=>(
                                            <option key={planta.id_planta} value={planta.id_planta}>
                                                {planta.nombre}
                                            </option>
                                        ))
                                     }   
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label for="sembrado" class="form-label">Cantidad sembrada:</label>
                                    <input type="number" class="form-control" id="sembrado"
                                    onChange={e=>{
                                        setSiembra(e.target.value);
                                    }}
                                    value={siembra}
                                    />
                                </div>

                                <div class="col-12">
                                    <label for="temp_min" class="form-label">Temperatura ambiente mínima:</label>
                                    <input type="number" class="form-control" id="temp_min"
                                    onChange={e=>{
                                        setTempAmbMin(e.target.value);
                                    }}
                                    value = {temp_amb_min}
                                    />
                                </div>

                                <div class="col-12">
                                    <label for="temp_max" class="form-label">Temperatura ambiente maxima:</label>
                                    <input type="number" class="form-control" id="temp_max"
                                    onChange={e=>{
                                        setTempAmbMax(e.target.value);
                                    }}
                                    value = {temp_amb_max}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="hum_amb_min" class="form-label">Humedad ambiente mínima:</label>
                                    <input type="number" class="form-control" id="hum_amb_min"
                                    onChange={e=>{
                                        setHumAmbMin(e.target.value);
                                    }}
                                    value = {hum_amb_min}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="hum_amb_max" class="form-label">Humedad ambiente maxima:</label>
                                    <input type="number" class="form-control" id="hum_amb_max"
                                    onChange={e=>{
                                        setHumAmbMax(e.target.value);
                                    }}
                                    value = {hum_amb_max}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="hum_sue_min" class="form-label">Humedad suelo minima:</label>
                                    <input type="number" class="form-control" id="hum_sue_min"
                                    onChange={e=>{
                                        setHumSueMin(e.target.value);
                                    }}
                                    value = {hum_sue_min}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="hum_sue_max" class="form-label">Humedad suelo maxima:</label>
                                    <input type="number" class="form-control" id="hum_sue_max"
                                    onChange={e=>{
                                        setHumSueMax(e.target.value);
                                    }}
                                    value = {hum_sue_max}
                                    />
                                </div>
                                
                            </form>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn" data-bs-dismiss="modal" style={{background:"#E70000", fontWeight:"bold", color:"#fff"}} onClick={()=>{borrarDatos()}}>Cancelar</button>
                            <button type="button" class="btn" style={{background:"#ABBF15", fontWeight:"bold", color:"#fff"}} onClick={()=>{addCultivo()}} data-bs-dismiss="modal">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
            {/*VENTA MODAL EDITAR*/}
            <div class="modal fade" id="editar" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable" >
                    <div class="modal-content" style={{ background: '#658C7A', height: '100%', color: "#fff" }}>
                        <div class="modal-header justify-content-center">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Editar cultivo</h1>
                        </div>
                        <div class="modal-body">
                            <form class="row g-3">
                                <div class="col-12">
                                    <label for="nombre" class="form-label">Nombre:</label>
                                    <input type="text" class="form-control" id="nombre"
                                    onChange={e=>setNombre(e.target.value)}
                                    value = {nombre}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="hum_sue_max" class="form-label">Fecha de inicio:</label>
                                    <input type="date" class="form-control" id="hum_sue_max"
                                    onChange={e => setFechaInicio(e.target.value)}
                                    value = {fecha_inicio}
                                    />
                                </div>

                                <div class="col-md-6">
                                    <label for="especie" class="form-label">Especie:</label>
                                    <select id="especie" class="form-select"
                                    onChange={e=>{
                                        setPlanta(e.target.value);
                                        getPlanta(e.target.value);
                                    }}
                                    value = {planta}
                                    >
                                    {
                                        plantasData.map((planta)=>(
                                            <option key={planta.id_planta} value={planta.id_planta}>
                                                {planta.nombre}
                                            </option>
                                        ))
                                     }    
                                        
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label for="sembrado" class="form-label">Cantidad sembrada:</label>
                                    <input type="number" class="form-control" id="sembrado"
                                    onChange={e=>{
                                        setSiembra(e.target.value);
                                    }}
                                    value={siembra}
                                    />
                                </div>

                                <div class="col-12">
                                    <label for="temp_min" class="form-label">Temperatura ambiente mínima:</label>
                                    <input type="number" class="form-control" id="temp_min"
                                    onChange={e=>{
                                        setTempAmbMin(e.target.value);
                                    }}
                                    value = {temp_amb_min}
                                    />
                                </div>

                                <div class="col-12">
                                    <label for="temp_max" class="form-label">Temperatura ambiente maxima:</label>
                                    <input type="number" class="form-control" id="temp_max"
                                    onChange={e=>{
                                        setTempAmbMax(e.target.value);
                                    }}
                                    value = {temp_amb_max}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="hum_amb_min" class="form-label">Humedad ambiente mínima:</label>
                                    <input type="number" class="form-control" id="hum_amb_min"
                                    onChange={e=>{
                                        setHumAmbMin(e.target.value);
                                    }}
                                    value = {hum_amb_min}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="hum_amb_max" class="form-label">Humedad ambiente maxima:</label>
                                    <input type="number" class="form-control" id="hum_amb_max"
                                    onChange={e=>{
                                        setHumAmbMax(e.target.value);
                                    }}
                                    value = {hum_amb_max}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="hum_sue_min" class="form-label">Humedad suelo minima:</label>
                                    <input type="number" class="form-control" id="hum_sue_min"
                                    onChange={e=>{
                                        setHumSueMin(e.target.value);
                                    }}
                                    value = {hum_sue_min}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="hum_sue_max" class="form-label">Humedad suelo maxima:</label>
                                    <input type="number" class="form-control" id="hum_sue_max"
                                    onChange={e=>{
                                        setHumSueMax(e.target.value);
                                    }}
                                    value = {hum_sue_max}
                                    />
                                </div>
                                
                            </form>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn" data-bs-dismiss="modal" style={{background:"#E70000", fontWeight:"bold", color:"#fff"}} onClick={()=>{borrarDatos()}}>Cancelar</button>
                            <button type="button" class="btn" style={{background:"#ABBF15", fontWeight:"bold", color:"#fff"}} onClick={()=>{updateCultivo()}} data-bs-dismiss="modal">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
            {/*VENTANA MODAL FINALIZAR*/}
            <div class="modal fade" id="finalizar" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable" >
                    <div class="modal-content" style={{ background: '#658C7A', height: '100%', color: "#fff" }}>
                        <div class="modal-header justify-content-center">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Finalizar cultivo</h1>
                        </div>
                        <div class="modal-body">
                            <form class="row g-3">

                                <div class="col-md-12">
                                    <label for="fecha_cosecha" class="form-label">Fecha de cosecha:</label>
                                    <input type="date" class="form-control" id="fecha_cosecha"
                                    onChange={e=>setFechaFin(e.target.value)}
                                    value = {fecha_fin}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="cosechado" class="form-label">Cantidad cosechada:</label>
                                    <input type="number" class="form-control" id="cosechado"
                                    onChange={e=>setCosechado(e.target.value)}
                                    value = {cosechado}
                                    />
                                </div>

                                <div class="col-md-12">
                                    <label for="plaga" class="form-label">Plaga:</label>
                                    <select id="plaga" class="form-select" 
                                    onChange={e=>setPlaga(e.target.value)}
                                    value = {plaga}
                                    >
                                        <option key={0} value={0}>Sin plaga</option>
                                        {
                                            plagas.map((plaga)=>(
                                                <option key={plaga.id_plaga} value={plaga.plaga}>
                                                    {plaga.plaga}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                {
                                    plaga !== 0 ?
                                    <>
                                    <div class="col-md-12">
                                    <label for="metodo" class="form-label">Método:</label>
                                    <select id="metodo" class="form-select"
                                    onChange = {e => setMetodo(e.target.value)}
                                    value = {metodo}
                                    >
                                        {
                                            metodos.map((metodo)=>(
                                                <option key={metodo} value={metodo}>
                                                    {metodo}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div class="col-md-12">
                                    <label for="efectividad" class="form-label">¿Fue efectivo?:</label>
                                    <select id="efectividad" class="form-select"
                                    onChange={e => setEfectivo(e.target.value)}
                                    value = {efectivo}
                                    >
                                        <option key={"Si"} value={"Si"}>Si</option>
                                        <option key={"No"} value={"No"}>No</option>
                                    </select>
                                </div>
                                    </>
                                    :
                                    <></>
                                }
                                
                                
                            </form>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn" data-bs-dismiss="modal" style={{background:"#E70000", fontWeight:"bold", color:"#fff"}} onClick={()=>{borrarDatos()}}>Cancelar</button>
                            <button type="button" class="btn" data-bs-dismiss="modal" style={{background:"#ABBF15", fontWeight:"bold", color:"#fff"}} onClick={()=>endCultivo()}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
            {/*VENTANA MODAL ELIMINAR*/}
            <div class="modal fade" id="eliminar" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" >
                    <div class="modal-content" style={{ background: '#658C7A', color: "#fff" }}>
                        <div class="modal-header justify-content-center">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">¿Desea eliminar el cultivo?</h1>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn" data-bs-dismiss="modal" style={{background:"#EDE300", fontWeight:"bold", color:"#fff"}} onClick={()=>{borrarDatos()}}>Cancelar</button>
                            <button type="button" class="btn" style={{background:"#E70000", fontWeight:"bold", color:"#fff"}} onClick={()=>deleteCultivo(cultivoId)} data-bs-dismiss="modal">Aceptar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Cultivos;
