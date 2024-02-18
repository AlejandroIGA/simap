<?php
class Cultivo_model extends CI_Model{
    //Método para agregar un cultivo
    function addCultivo($data){
        $this->db
        ->set($data)
        ->insert("cosecha");
        return $this->db->affected_rows()>0;
    }
}

?>