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

const dispositivos2 = [
  {
    id_dispositivo: 'id_dispositivo',
    id_master: 'id_master',
    id_cultivo: 'id_cultivo',
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
const cultivos = [
  {
    id_cultivo: 'id_cultivo',
    cultivo: 'nombre_cultivo',
    id_master: 'id_master',
    master: 'nombre_master',
    temp_amb_prom: [
      {
        valor: 'valor',
        fecha: 'fecha y hora',
      },
    ],
    hum_amb_prom: [
      {
        valor: 'valor',
        fecha: 'fecha y hora',
      },
    ],
    hum_sue_prom: [
      {
        valor: 'valor',
        fecha: 'fecha y hora',
      },
    ],
    agua: [
      {
        valor: 'valor',
        fecha: 'fecha y hora',
      },
    ],
    gdd: [
      {
        valor: 'valor',
        fecha: 'fecha',
      },
    ],
  },
];
