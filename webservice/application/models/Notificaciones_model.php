<?php
class Notificaciones_model extends CI_Model
{

    // Obtener notificaciones
    public function getNotificaciones($id_usuario) {

        $rs = $this->db
            ->select("nt.*")
            ->where("nt.id_usuario", $id_usuario)
            ->from("notificaciones AS nt")
            ->get();

    return $rs->num_rows() > 0 ?
        $rs->result() : NULL;

    }
    
    public function deleteNotificacion($id_notificacion) {
        $this->db
             ->from('notificaciones')
             ->where('id_notificacion', $id_notificacion)
             ->delete();
        
        return $this->db->affected_rows() > 0;
    }
    
}