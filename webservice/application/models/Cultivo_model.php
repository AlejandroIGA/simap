<?php
class Cultivo_model extends CI_Model
{

    //Método para agregar un cultivo
    function addCultivo($data)
    {
        //select id_cosecha from cosecha where fecha_fin is null and id_usuario = 1 and nombre like "afd";

        $rs = $this->db
        ->select("id_cosecha")
        ->from("cosecha")
        ->where("fecha_fin is null")
        ->where("id_usuario", $data["id_usuario"])
        ->where("nombre",$data["nombre"])
        ->get();

        if($rs->num_rows()>0){
            return false;
        }else{
            $this->db
            ->set($data)
            ->insert("cosecha");
        return $this->db->affected_rows() > 0;
        }        
    }

    //Obtener el ultimo id
    function getUltimoId(){
        $query = $this->db->query("SELECT MAX(id_cosecha) AS id_cosecha FROM cosecha");
        return $query->result();
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
