<?php
class Dispositivos_model extends CI_Model
{

    //Método para  agregar un nuevo dispositivo
    public function nuevoDispositivo($data) {
        $this->db->insert("dispositivo", $data);

        return $this->db->affected_rows() > 0 ? 
            $this->db->insert_id() : 0;
    }

    public function getDispositivos($id_usuario) {

        $rs = $this->db
            ->select("dp.*")
            ->where("dp.id_usuario", $id_usuario)
            ->from("dispositivo AS dp")
            ->get();

    return $rs->num_rows() > 0 ?
        $rs->result() : NULL;

    }

    public function getMaestros($id_usuario) {

        $rs = $this->db
            ->select("dp.id_dispositivo, dp.nombre")
            ->from("dispositivo AS dp")
            ->where("id_usuario", "IFNULL((SELECT cuenta_main FROM usuario WHERE id_usuario = $id_usuario), $id_usuario)", FALSE)
            ->where("dp.tipo", "maestro")
            ->get();

    return $rs->num_rows() > 0 ?
        $rs->result() : NULL;

    }

    public function deleteDispositivo($id_dispositivo) {
        $this->db
             ->from('dispositivo')
             ->where('id_dispositivo', $id_dispositivo)
             ->where("(id_cosecha IS NULL OR id_cosecha IN (SELECT id_cosecha FROM cosecha WHERE fecha_fin IS NOT NULL))")
             ->delete();
        
        return $this->db->affected_rows() > 0;
    }
    
    
    
}