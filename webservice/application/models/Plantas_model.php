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

    //Método para recuperar los valores de las plagas (ver si se puede en procedure)
    public function getPlagas($id_cosecha){
        $rs = $this->db
        ->select("*")
        ->from("plagas")
        ->where("id_cosecha",$id_cosecha)
        ->get();

        return $rs->num_rows()>0 ? 
        $rs->result() : NULL;
    }

    //Método para recuperar las formas de combate
    public function getMetodos(){
        $rs = $this->db
        ->select("SUBSTRING(COLUMN_TYPE, 6, LENGTH(COLUMN_TYPE) - 6) AS opciones")
        ->from("information_schema.columns")
        ->where("TABLE_SCHEMA","bd_awi4_aleinf214")
        ->where("TABLE_NAME","cosecha")
        ->where("COLUMN_NAME","combate")
        ->get();
        return $rs->num_rows()>0 ? 
        $rs->row() : NULL;

    }
}

?>