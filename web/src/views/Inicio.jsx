import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import agricultor from '../images/Granjero.png';
import conf from '../conf';

import '../config/firebaseConfig'
import { getFirestore, getDocs, collection, orderBy, query, where, limit } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';

import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';

function Inicio() {
  let id_usuario = sessionStorage.getItem('id_usuario');
  let tipo = sessionStorage.getItem('tipo');
  const navigate = useNavigate();
  const [showGrafica, setShowGrafica] = useState(false);
  const [btnGrafica, setBtnGrafica] = useState(false);
  const [options, setOptionsGraf] = useState({});
  const [tipoGrafica, setTipoGrafica] = useState("temp_amb");
  const [fechInicio, setFechInicio] = useState(null);
  const [fechFin, setFechFin] = useState(null);
  const [dispositivos, setDispositivos] = useState([]);
  const [cultivos, setCultivos] = useState([]);
  const [cultivosActivos, setCultivosActivos] = useState([]);
  const [id_cultivo, setIdCultivo] = useState(null);


  //Firebase
  const db = getFirestore();

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


  const processData = (doc, tipo) => {
    if (doc.data()[tipo] !== undefined && doc.data().fecha !== undefined) {
      const fechaString = doc.data().fecha;
      const [fechaParte, horaParte] = fechaString.split(' ');
      const [anio, mes, dia] = fechaParte.split('-');
      const [hora, minuto, segundo] = horaParte.split(':');
      return [Date.UTC(anio, mes - 1, dia, hora, minuto, segundo), doc.data()[tipo]];
    }
    return null;
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
        setCultivos(data.data)
      }
    } catch (error) {
      console.error("ERROR:", error.message);
    }
  };

  //Manda a llamar los cultivosActivo
  const getCultivosActivos = async () => {
    try {
      //const userDataJSON = await AsyncStorage.getItem('userData');
      if (true) {
        //const userData = JSON.parse(userDataJSON);
        //const id_usuario = userData.id_usuario;

        const formData = new FormData();
        formData.append("id_usuario", id_usuario);
        const response = await fetch(conf.url + "/getCultivosActivos/", {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCultivosActivos(data)
        actualizarGdds(data);
      }
    } catch (error) {
      console.error("ERROR:", error.message);
    }
  };

  //Actualizar GDDs 
  const actualizarGdds = async (aux) => {
    const dataCollection = collection(db, 'desarrollo');
    for (const cultivo of aux) {
      const querySnapshot = await getDocs(query(
        dataCollection,
        where('id_cosecha', '==', parseInt(cultivo.id_cosecha)),
        orderBy('fecha', 'desc'),
        limit(1)
      ));

      // Obtener la fecha actual
      const fechaActual = new Date();
      // Convertir la fecha en formato de cadena a un objeto Date
      const fechaComparar = new Date(querySnapshot.docs[0].data().fecha + 'T00:00:00'); // Establecer la hora a las 00:00:00
      if (fechaComparar.getTime() === fechaActual.getTime()) {
        console.log('Las fechas son iguales.');
        //hacer consulta a gdd
        insertGdds(cultivo.id_planta, cultivo.id_cosecha)
      } else {
        console.log('Las fechas son diferentes.');
      }
    }
  };

  //Insertar GDDs
  const insertGdds = async (idPlanta, idCultivo) => {
    try {
      const response = await fetch(conf.url + `/setGdd/${idPlanta}/${idCultivo}`, {
        method: 'GET',
      });
      const data = await response.json();
      console.log("insertGdds: ", data)
    } catch (error) {
      console.error("ERROR:", error.message);
    }
  }

  const crearGrafica = (opciones) => {
    new Highcharts.Chart('containerGrafica', opciones);
  }

  //Obtener etapas de planta
  const getEtapasPlanta = async(idPlanta) =>{
    try {
      if (true) {
        const formData = new FormData();
        formData.append("id_planta", idPlanta);
        const response = await fetch(conf.url + "/getEtapasPlanta/", {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("ERROR:", error.message);
    }
  } 

  //Obtener etapas de plagas
  const getEtapasPlagas = async(idPlanta) =>{
    try {
      if (true) {
        const formData = new FormData();
        formData.append("id_planta", idPlanta);
        const response = await fetch(conf.url + "/getEtapasPlaga/", {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("ERROR:", error.message);
    }
  } 

  const grafica = async (tipo, id_cultivo, fechaInicio, fechaFin) => {
    console.log(tipo, id_cultivo, fechaInicio, fechaFin)
    if (fechaFin === null || fechaInicio === null) {
      alert("Seleccione una fecha de inicio y una fecha de fin");
      setShowGrafica(false);
      return;
    } else if (fechaFin < fechaInicio) {
      alert("La fecha de inicio no puede ser mayor a la fecha de fin");
      setShowGrafica(false);
      return;
    } else if (id_cultivo === null) {
      alert("Seleccione un cultivo");
      setShowGrafica(false);
      return;
    }
    /*
    1.Identificar el tipo de datos a gráficar.
    2.Apuntar a la colección correcta.
    3.Definir las configuraciones necesarias.
    */
    if (tipo === "agua") {
      const dataCollectionAgua = collection(db, 'consumoAgua');
      const allSeriesAgua = [];
      const seriesDataAgua = [];
      let dispositivo = "";
      const dataSnapshot = await getDocs(query(
        dataCollectionAgua,
        where('id_cosecha', '==', parseInt(id_cultivo)),
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin),
        orderBy('fecha')
      ));

      dataSnapshot.docs.forEach(doc => {
        dispositivo = doc.data()["dispositivo"];
        const data = processData(doc, tipo);
        if (data) {
          seriesDataAgua.push(data);
        }
      });

      allSeriesAgua.push({
        name: dispositivo,
        data: seriesDataAgua
      });
      setShowGrafica(true);
      crearGrafica({
        chart: {
          type: 'spline',
          zoomType: 'x'
        },
        title: {
          text: "Consumo de agua"
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            minute: '%e. %b %H:%M',
            hour: '%e. %b %H:%M',
            day: '%e. %b',
            month: '%b',
          },
          title: {
            text: 'Fecha y Hora'
          }
        },
        yAxis: {
          title: {
            text: "Litros"
          },
          labels: {
            format: `{value}L`
          }
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: `Fecha: {point.x:%e. %b %Y %H:%M} ${tipo}: {point.y:.2f}L`
        },
        plotOptions: {
          series: {
            marker: {
              symbol: 'circle',
              fillColor: '#FFFFFF',
              enabled: true,
              radius: 2.5,
              lineWidth: 1,
              lineColor: null
            }
          }
        },
        series: allSeriesAgua
      });
    }
    else if (tipo === "gdd_temp") {
      const dataCollection = collection(db, 'desarrollo');
      const series = [];

      const dataSnapshot = await getDocs(query(
        dataCollection,
        where('id_cosecha', '==', parseInt(id_cultivo)),
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin),
        orderBy('fecha')
      ));

      dataSnapshot.docs.forEach(doc => {
        const data = doc.data();
        series.push(data);
      })

      const datos = series.map(item => [item.temp_avg, item.gdd]);
      setShowGrafica(true);
      crearGrafica({
        chart: {
          type: 'scatter',
          zoomType: 'xy'
        },
        title: {
          text: 'Grados de desarrollo vs. Temperatura Promedio'
        },
        xAxis: {
          title: {
            enabled: true,
            text: 'Temperatura Promedio (°C)'
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
        },
        yAxis: {
          title: {
            text: 'Grados de desarrollo'
          }
        },
        plotOptions: {
          scatter: {
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)'
                }
              }
            },
            states: {
              hover: {
                marker: {
                  enabled: false
                }
              }
            },
            tooltip: {
              headerFormat: '<b>{series.name}</b><br>',
              pointFormat: '{point.x} °C, {point.y} GDD'
            }
          }
        },
        series: [{
          name: 'Gdd',
          color: 'rgba(223, 83, 83, .5)',
          data: datos
        }]
      });
    }
    else if (tipo === "plagas") {
      alert("Esta gráfica trabaja con los meses de las fechas ingresadas");
      const fechaInicioFormateada = fechaInicio.split("-");
      const fechaFinFormateada = fechaFin.split("-");
      const mesInicio = parseInt(fechaInicioFormateada[1]);
      const mesFin = parseInt(fechaFinFormateada[1]);
      console.log("meses:", fechaInicioFormateada, fechInicio)

      try {
        //const userDataJSON = await AsyncStorage.getItem('userData');
        if (true) {
          //const userData = JSON.parse(userDataJSON);
          //const id_usuario = userData.id_usuario;
          const formData = new FormData();
          formData.append("id_cosecha", id_cultivo);
          formData.append("mes_inicio", mesInicio);
          formData.append("mes_fin", mesFin);
          const response = await fetch(conf.url + "/getPorcentajes/", {
            method: 'POST',
            body: formData
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          if (!data.estado) {
            alert("No hay cultivos finalizados en el periodo indicado");
            setShowGrafica(false);
            setOptionsGraf({});
            return;
          }
          const dataGrafica = data.porcentajes;
          const finalizados = data.finalizados;
          const plantaNombre = data.planta[0].nombre;
          setShowGrafica(true);
          crearGrafica({
            chart: {
              type: 'pie'
            },
            title: {
              text: 'Plagas en cultivos finalizados'
            },
            tooltip: {
              valueSuffix: '%'
            },
            subtitle: {
              text:
                `Cultivos finalizados: ${finalizados} de ${plantaNombre}`
            },
            plotOptions: {
              series: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: [{
                  enabled: true,
                  distance: 20
                }, {
                  enabled: true,
                  distance: -40,
                  format: '{point.percentage:.1f}%',
                  style: {
                    fontSize: '1.2em',
                    textOutline: 'none',
                    opacity: 0.7
                  },
                  filter: {
                    operator: '>',
                    property: 'percentage',
                    value: 10
                  }
                }]
              }
            },
            series: [
              {
                name: 'Porcentaje',
                colorByPoint: true,
                data: dataGrafica
              }
            ]

          });
        }
      } catch (error) {
        console.error("ERROR:", error.message);
      }

    }
    else if (tipo === "desarrollo") {
      //getCultivosActivos(); COMENTADO POR FASE DE desarrollo/ ESTA FUNCIÓN SOLAMENTE ACTULIZA DATOS EN FIREBASE

      //petición a firebase de los gdd.
      const dataCollection = collection(db, 'desarrollo');
      const dataSnapshot = await getDocs(query(
        dataCollection,
        where('id_cosecha', '==', parseInt(id_cultivo)),
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin),
        orderBy('fecha')
      ));

      let sumagdd = 0;
      let idPlanta;
      dataSnapshot.docs.forEach(doc => {
        sumagdd = sumagdd + doc.data()["gdd"];
        idPlanta= doc.data()["id_planta"];
      });
      
      
      const planta = await getEtapasPlanta(idPlanta);
      const nombrePlanta = planta.nombre;

      const plagas = await getEtapasPlagas(idPlanta);


      let series = [];
      let data = [0,0,0,0];
      if(sumagdd<planta.emergencia){
        data[0]=parseFloat(((sumagdd/planta.emergencia)*100).toFixed(2));
      }else if(sumagdd<planta.establecimiento){
        data[0]=100;
        data[1]=parseFloat(((sumagdd/planta.establecimiento)*100).toFixed(2));
      }else if(sumagdd<planta.floracion){
        data[0]=100;
        data[1]=100;
        data[2]=parseFloat(((sumagdd/planta.floracion)*100).toFixed(2));
      }else if(sumagdd<planta.inicio_cosecha){
        data[0]=100;
        data[1]=100;
        data[2]=100;
        data[3]=parseFloat(((sumagdd/planta.inicio_cosecha)*100).toFixed(2));
      }
      series.push({
        name: nombrePlanta,
        data: data
      })
      //plaga
      plagas.forEach(plaga=>{
        let data = [0,0,0,0];
        if(sumagdd<plaga.emergencia){
          data[0]=parseFloat(((sumagdd/plaga.emergencia)*100).toFixed(2));
        }else if(sumagdd<plaga.establecimiento){
          data[0]=100;
          data[1]=parseFloat(((sumagdd/plaga.establecimiento)*100).toFixed(2));
        }else if(sumagdd<plaga.floracion){
          data[0]=100;
          data[1]=100;
          data[2]=parseFloat(((sumagdd/plaga.floracion)*100).toFixed(2));
        }else if(sumagdd<plaga.inicio_cosecha){
          data[0]=100;
          data[1]=100;
          data[2]=100;
          data[3]=parseFloat(((sumagdd/plaga.inicio_cosecha)*100).toFixed(2));
        }
        series.push({
          name: plaga.nombre,
          data: data
        })
      })

      crearGrafica({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Desarrollo de plagas y cultivo.',
            align: 'center'
        },
        xAxis: {
            categories: ['Emergencia', 'Establecimiento', 'Floración', 'IncioCosecha', 'finCosecha'],
            crosshair: true,
            accessibility: {
                description: 'Etapas de desarrollo'
            }
        },
        yAxis: {
          min: 0,
          title: {
              text: 'Porcentaje desarrollo (%)' // Cambiado para indicar porcentaje
          },
          labels: {
              format: '{value:.1f}%' // Formato para mostrar dos decimales y el símbolo de porcentaje
          }
      },
        tooltip: {
            valueSuffix: '%'
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: series
    });


    }
    else {
      const dataCollection = collection(db, 'pruebas');
      const allSeries = [];
      const dispositivosUnicos = new Set();

      const queryDispositivos = await getDocs(query(
        dataCollection,
        where('id_cosecha', '==', parseInt(id_cultivo)),
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin),
        orderBy('fecha')
      ));

      queryDispositivos.docs.forEach(doc => {
        dispositivosUnicos.add(doc.data().dispositivo);
      });

      for (const dispositivo of dispositivosUnicos) {
        const seriesData = [];
        const dataSnapshot = await getDocs(query(
          dataCollection,
          where('dispositivo', '==', dispositivo),
          where('fecha', '>=', fechaInicio),
          where('fecha', '<=', fechaFin),
          orderBy('fecha')
        ));

        dataSnapshot.docs.forEach(doc => {
          const data = processData(doc, tipo);
          if (data) {
            seriesData.push(data);
          }
        });

        allSeries.push({
          name: dispositivo,
          data: seriesData
        });
      }
      setShowGrafica(true);
      crearGrafica({
        chart: {
          type: 'spline',
          zoomType: 'x'
        },
        title: {
          text: tipo === "temp_amb" ? "Temperatura Ambiente" : tipo === "hum_amb" ? "Humedad Ambiente" : "Humedad Suelo"
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            minute: '%e. %b %H:%M',
            hour: '%e. %b %H:%M',
            day: '%e. %b',
            month: '%b',
          },
          title: {
            text: 'Fecha y Hora'
          }
        },
        yAxis: {
          title: {
            text: tipo === "temp_amb" ? "Temperatura" : "Humedad"
          },
          labels: {
            format: `{value}${tipo === "temp_amb" ? "°" : "%"}`
          }
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: `Fecha: {point.x:%e. %b %Y %H:%M} ${tipo}: {point.y:.2f}${tipo === "temp_amb" ? "°" : "%"}`
        },
        plotOptions: {
          series: {
            marker: {
              symbol: 'circle',
              fillColor: '#FFFFFF',
              enabled: true,
              radius: 2.5,
              lineWidth: 1,
              lineColor: null
            }
          }
        },
        series: allSeries
      })
    }
  };

  useEffect(() => {
    
    getCultivos();
    HighchartsExporting(Highcharts);
    HighchartsExportData(Highcharts);
    Highcharts.setOptions({
      lang: {
        shortMonths: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        downloadCSV: 'Descarga CSV',
        downloadJPEG: 'Descarga imagen JPEG',
        downloadMIDI: 'Descarga MIDI',
        downloadPDF: 'Descarga PDF',
        downloadPNG: 'Descarga PNG',
        downloadSVG: 'Descarga SVG',
        downloadXLS: 'Descarga XLS',
        exitFullScreen: 'Salir de pantalla completa',
        hideData: 'Ocultar tabla de datos',
        loading: 'Cargando...',
        months: [
          'Enero',
          'Febreo',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        noData: 'No hay datos para mostrar',
        playAsSound: 'Reproduce como sonido',
        printChart: 'Imprime gráfica',
        resetZoom: 'Restaura zoom',
        resetZoomTitle: 'Restaura nivel de zoom 1:1',
        shortWeekdays: ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'],
        thousandsSep: '\u002C',
        viewData: 'Ver tabla de datos',
        viewFullscreen: 'Ver pantalla completa',
        weekdays: [
          'Domingo',
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
        ],
      },
    });
  }, [])
  return (
    <div style={{ background: '#f2f2f2', height: "100vh" }}>
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
      <div>
        {
          <div className='container hv-100'>
            <div className="row g-3 my-2">
              <div className="col-md-3">
                <label className="form-label">Gráfica:</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={tipoGrafica}
                  onChange={e => setTipoGrafica(e.target.value)}
                >
                  <option value="temp_amb">Temperatura ambiente</option>
                  <option value="hum_amb">Humedad ambiente</option>
                  <option value="hum_sue">Humedad suelo</option>
                  <option value="agua">Consumo de agua</option>
                  <option value="desarrollo">Desarrollo del cultivo</option>
                  <option value="gdd_temp">Desarrollo vs Temperatura</option>
                  <option value="plagas">Plagas vs Agricultor</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Cultivo:</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={id_cultivo}
                  onChange={e => setIdCultivo(e.target.value)}
                >
                  <option value={null}>Seleccione un cultivo</option>
                  {
                    cultivos != null ? cultivos.map(cultivo => (
                      <option value={cultivo.id_cosecha}>{cultivo.nombre}</option>
                    )) : null

                  }
                </select>
              </div>

              <div className="col-md-2">
                <label for="fechaInicio" className="form-label">Fecha Inicio:</label>
                <input value={fechInicio} onChange={e => setFechInicio(e.target.value)} type="date" className="form-control" id="fechaInicio" />
              </div>
              <div className="col-md-2">
                <label for="fechaFin" className="form-label">Fecha Fin:</label>
                <input value={fechFin} onChange={e => setFechFin(e.target.value)} type="date" className="form-control" id="fechaFin" />
              </div>
              <div className="col-md-2 mt-auto">
                <button enabled={btnGrafica.toString()} className='btn btn-primary' onClick={() => grafica(tipoGrafica, id_cultivo, fechInicio, fechFin)}>Ver Gráfica</button>
              </div>

            </div>
            
                <div id="containerGrafica">

                </div>
            

          </div>
        }

      </div>
    </div >
  )
}

export default Inicio;