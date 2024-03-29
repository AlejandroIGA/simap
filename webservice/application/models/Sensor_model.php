<?php
class Sensor_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        // Carga la biblioteca cURL
        //$this->load->library('curl');
    }

    function setGdd($id_planta){
        //Obtener la temperatura de trabajo promedio de la planta para calcular el gdd
        $rs = $this->db
        ->select(" temp_amb_min as temperatura")
        ->from("planta")
        ->where("id_planta",$id_planta)
        ->get();
        return $rs->num_rows() > 0 ?
            $rs->row() : NULL;
    }

    function test($mac)
    {
        //Obtener datos de la BD SQL para enviar a la BD NoSQ
        $rs = $this->db
            ->select("dispositivo.id_dispositivo, maestro, dispositivo.nombre, cosecha.nombre as cosecha, dispositivo.id_cosecha")
            ->from("dispositivo")
            ->join("cosecha", "dispositivo.id_cosecha = cosecha.id_cosecha")
            ->where("dispositivo.mac", $mac)
            ->get();
        return $rs->num_rows() > 0 ?
            $rs->row() : NULL;
    }

    function simulacionDispositivos($mac)
    {
        // Obtener el maestro asociado con la mac proporcionada
        $maestro = $this->db
            ->select('maestro')
            ->from('dispositivo')
            ->where('mac', $mac)
            ->get()
            ->row();
    
        if ($maestro) {
            // Usar el maestro para obtener todas las mac asociadas a ese maestro
            $rs = $this->db
                ->select('mac')
                ->from('dispositivo')
                ->where('maestro', $maestro->maestro) // Utilizar directamente el valor de maestro
                ->get();
    
            return $rs->num_rows() > 0 ? $rs->result() : NULL;
        }
    
        return NULL;
    }

    function getConfiguracion($mac){
        $rs = $this->db
        ->select("temp_amb_min, temp_amb_max, hum_amb_min, hum_amb_max,hum_sue_min, hum_sue_max, dispositivo.nombre as nombre, ssid, psw")
        ->from("cosecha")
        ->join("dispositivo","cosecha.id_cosecha = dispositivo.id_cosecha ")
        ->where("dispositivo.mac", $mac)
        ->get();
        return $rs->num_rows() > 0 ?
            $rs->row() : NULL;
    }
    
}
