<?php
class Sensor_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        // Carga la biblioteca cURL
        //$this->load->library('curl');
    }

    function test(){
        $fechaHoraActual = new DateTime();
        return $fechaHoraActual->format("Y-m-d H:i:s");
    }

/*
    //Enviar los datos obtenidos de ua tarjeta
    function enviarEsclavo($valor)
    {

        /// Configura la URL de la colección Firestore que deseas consultar
        $firestore_url = 'https://firestore.googleapis.com/v1/projects/PruebasSimap/databases/(default)/documents/pruebas';

        // Configura los datos que deseas enviar en el cuerpo de la solicitud POST
        $data = array(
            "fields" => array(
                "valor_prueba" => array("stringValue" => $valor),
            )
        );

        // Convierte los datos a formato JSON
        $json_data = json_encode($data);

        // Configura las opciones de la solicitud POST
        $options = array(
            CURLOPT_POST => TRUE,
            CURLOPT_POSTFIELDS => $json_data,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($json_data)
            )
        );

        // Inicializa cURL y configura las opciones
        $this->curl->create($firestore_url);
        $this->curl->options($options);

        // Realiza la solicitud POST a Firestore
        $response = $this->curl->execute();

        // Procesa la respuesta
        if ($response) {
            // La respuesta puede contener el ID del documento creado u otra información según la configuración de Firestore
            echo 'Documento creado exitosamente';
        } else {
            // Maneja el caso de error
            echo 'Error al crear el documento en Firestore';
        }
    }*/
}
