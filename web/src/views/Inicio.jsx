import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import agricultor from '../images/Granjero.png';
import conf from '../conf';

import '../config/firebaseConfig'
import { getFirestore, getDocs, collection, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';

function Inicio() {
  let id_usuario = sessionStorage.getItem('id_usuario');
  const navigate = useNavigate();
  const [showGrafica, setShowGrafica] = useState(false);
  const [btnGrafica, setBtnGrafica] = useState(false);
  const [options, setOptions] = useState({});
  const [tipoGrafica, setTipoGrafica] = useState("temp_amb");
  const [fechInicio, setFechInicio] = useState(null);
  const [fechFin, setFechFin] = useState(null);
  const [cultivos, setCultivos] = useState([]);
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
        console.log(data.data);
      }
    } catch (error) {
      console.error("ERROR:", error.message);
    }
  };

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

      setOptions({
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
      const dataCollection = collection(db,'desarrollo');
      const series = [];

      const dataSnapshot = await getDocs(query(
        dataCollection,
        where('id_cosecha', '==', parseInt(id_cultivo)),
        where('fecha', '>=', fechaInicio),
        where('fecha', '<=', fechaFin),
        orderBy('fecha')
      ));

      dataSnapshot.docs.forEach(doc=>{
        const data = doc.data();
        series.push(data);
      })

      const datos = series.map(item => [item.temp_avg, item.gdd]);


      setOptions({
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
    else if(tipo === "desarrollo"){
      const desarrollo = [
        {
          id_cultivo: 84,
          id_planta: 3,
          fecha: '2024-03-02',
          gdd: 4.3,
          temp_avg: 23
        },
        {
          id_cultivo: 84,
          id_planta: 3,
          fecha: '2024-03-03',
          gdd: 4.6,
          temp_avg: 28
        },
      ];

      const planta = {
        emergencia:150,
        establecimiento:650,
        floracion:1250,
        inicio_cosecha: 2050,
        fin_cosecha: 2550
      }

      const plaga = [{
          "nombre": "Mosca Blanca",
          "emergencia": "100",
          "establecimiento": "600",
          "floracion": "1100",
          "inicio_cosecha": "1900",
          "fin_cosecha": "2300"
      },
      {
          "nombre": "Trips",
          "emergencia": "100",
          "establecimiento": "600",
          "floracion": "1100",
          "inicio_cosecha": "1900",
          "fin_cosecha": "2300"
      }]

      // Paso 1: Calcular la acumulación de los valores de GDD en cada iteración
const acumulacionGDD = [];
desarrollo.forEach((item, index) => {
    if (index === 0) {
        acumulacionGDD.push(item.gdd);
    } else {
        acumulacionGDD.push(item.gdd + acumulacionGDD[index - 1]);
    }
});

// Paso 2: Calcular el porcentaje de desarrollo de la planta y de la plaga
const desarrolloPlanta = {};
const desarrolloPlaga = {};

Object.keys(planta).forEach(etapa => {
    desarrolloPlanta[etapa] = planta[etapa];
});

plaga.forEach(plaga => {
    desarrolloPlaga[plaga.nombre] = {};
    Object.keys(plaga).forEach(etapa => {
        desarrolloPlaga[plaga.nombre][etapa] = plaga[etapa];
    });
});

// Paso 3: Crear el arreglo de datos para Highcharts
const seriesData = [];
Object.keys(desarrolloPlanta).forEach(etapa => {
    const dataItem = {
        name: etapa,
        data: []
    };

    plaga.forEach(plagaItem => {
        dataItem.data.push({
            name: plagaItem.nombre,
            y: parseInt(plagaItem[etapa])
        });
    });

    seriesData.push(dataItem);
});

// Crear el gráfico en Highcharts
setOptions({
    chart: {
        type: 'column'
    },
    title: {
        text: 'Porcentaje de Desarrollo de Planta y Plaga por Etapa'
    },
    xAxis: {
        categories: acumulacionGDD,
        title: {
            text: 'GDD Acumulados'
        }
    },
    yAxis: {
        title: {
            text: 'Etapas'
        },
        categories: Object.keys(desarrolloPlanta)
    },
    tooltip: {
        shared: true,
        headerFormat: '<b>{point.x} GDD</b><br/>',
        pointFormat: '{point.y} % de desarrollo en {series.name}<br/>'
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },
    series: seriesData
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
      setOptions({
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
      });
    }



    setShowGrafica(true);
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
            {
              showGrafica ?
                <HighchartsReact
                  highcharts={Highcharts}
                  options={options}
                /> : null
            }

          </div>
        }

      </div>
    </div >
  )
}

export default Inicio;