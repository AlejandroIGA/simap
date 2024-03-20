<?php
class Sensor_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        // Carga la biblioteca cURL
        //$this->load->library('curl');
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

    
    
}
