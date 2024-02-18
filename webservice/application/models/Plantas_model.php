<?php
class Plantas_model extends CI_Model{
    //Método para obtener el nombre de las planta y su id
    public function getPlantas(){
        $rs = $this->db
        ->select("id_planta,nombre")
        ->from("planta")
        ->get();

        return $rs->num_rows()>0 ? 
        $rs->result() : NULL;
    }

    //Método para recuperar los valores de una planta
    public function getPlanta($planta){
        $rs = $this->db
        ->where("id_planta",$planta)
        ->get("planta");

        return $rs->num_rows()>0 ? 
        $rs->result() : NULL;
    }
}

?>