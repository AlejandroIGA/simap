/*
  Con el documento dispositivos se pueden ontener las medidas realizadas por cada esclavo
  y con esto realizar graficas de tiempo por cada tarjeta esclavo.
*/

const dispositivos = [
  {
    id_dispositivo: 'id_dispositivo',
    id_master: 'id_master',
    id_cultivo: 'id_cultivo',
    dispositivo: 'nombre_dispositivo',
    temp_amb: [
      {
        valor: 'valor',
        fecha: 'fecha y hora medicion',
      },
    ],
    hum_amb: [
      {
        valor: 'valor',
        fecha: 'fecha y hora medicion',
      },
    ],
    hum_sue: [
      {
        valor: 'valor',
        fecha: 'fecha y hora medicion',
      },
    ],
  },
];

const sensores = [
  {
    master: 'id_master',
    esclavo: 'id_esclavo',
    id_cultivo: 'id_cultivo',
    cultivo: 'nombre_cultivo',
    dispositivo: 'nombre_dispositivo',
    fecha: 'fecha y hora medicion',
    temp_amb: 'valor',
    hum_amb: 'valor',
    hum_sue: 'valor',
  },
];
/*
  Con el documento cultivos se tiene la información general del cultivo,
  con esta información se realizan los procesos estadisticos en la web.
*/
const desarrollo = [
  {
    id_cultivo: 'id_cultivo',
    cultivo: 'nombre_cultivo',
    id_master: 'id_master',
    master: 'nombre_master',
    fecha: 'fecha y hora medicion',
    gdd: 'valor',
  },
];

const consumoAgua = [
  {
    id_cultivo: 'id_cultivo',
    cultivo: 'nombre_cultivo',
    id_master: 'id_master',
    master: 'nombre_master',
    fecha: 'fecha y hora medicion',
    agua: 'valor',
  },
];
