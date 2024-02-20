<?php
class Cultivo_model extends CI_Model
{
    //Método para agregar un cultivo
    function addCultivo($data)
    {
        $this->db
            ->set($data)
            ->insert("cosecha");
        return $this->db->affected_rows() > 0;
    }

    //Método para actualizar un cultivo
    function updateCultivo($data){
        $this->db
        ->where("id_cosecha",$data["id_cosecha"])
        ->update("cosecha",$data);
        return $this->db->affected_rows()>0;
    }

    //Finalizar cultivo
    function endCultivo($data){
        $this->db
        ->where("id_cosecha",$data["id_cosecha"])
        ->update("cosecha",$data);
        return $this->db->affected_rows()>0;
    }

    //Método para obtener un cultivo
    function getCultivo($id_cosecha){
        $rs = $this->db
        ->where("id_cosecha",$id_cosecha)
        ->get("cosecha");

        return $rs->num_rows()>0 ? 
        $rs->result() : NULL;
    }

    //Método para eliminar un cultivo
    function deleteCultivo($id_cultivo)
    {
        $rw = $this->db
            ->select("COUNT(id_cosecha) as conexiones")
            ->where("id_cosecha", $id_cultivo)
            ->from("dispositivo")
            ->get();
        $conexiones = $rw->row()->conexiones;

        if ($conexiones > 0) {
            return false;
        } else {
            $this->db
                ->where("id_cosecha", $id_cultivo)
                ->delete("cosecha");
            return $this->db->affected_rows() > 0;
        }
    }
}
