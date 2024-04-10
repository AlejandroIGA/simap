<?php
class Dispositivos_model extends CI_Model
{

    //Método para  agregar un nuevo dispositivo
    public function nuevoDispositivo($data)
    {
        $this->db->insert("dispositivo", $data);

        return $this->db->affected_rows() > 0 ?
            $this->db->insert_id() : 0;
    }

    //Método para editar un dispositivo
    public function editDispositivo($data, $id_dispositivo)
    {
        $this->db
            ->where("id_dispositivo", $id_dispositivo)
            ->update("dispositivo", $data);

        return $this->db->affected_rows() > 0 ?
            $id_dispositivo : 0;
    }


    public function editMaestroDispositivo($id_cosecha, $maestro, $id_dispositivo)
    {
        $data = array(
            "maestro" => $maestro,
            "id_cosecha" => $id_cosecha
        );
    
        $this->db
            ->set($data)
            ->where("id_dispositivo", $id_dispositivo)
            ->update("dispositivo"); 

        return $this->db->affected_rows() > 0 ?
            $id_dispositivo : 0;
    }

    //Método para actualizar estado de bomba y automatizado
    public function update($id_dispositivo, $data)
{
    $this->db->where('id_dispositivo', $id_dispositivo);
    $this->db->update('dispositivo', $data);

    return $this->db->affected_rows() > 0;
}


   public function getDispositivos($id_usuario)
{

    $query = $this->db->query("
        SELECT dispositivo.*, cosecha.nombre as cosecha, usuario.nombre as nomus, usuario.apellidos as appus, temp_amb_min, temp_amb_max, hum_amb_min, hum_amb_max, hum_sue_min, hum_sue_max
        FROM dispositivo
        INNER JOIN usuario ON usuario.id_usuario = dispositivo.id_usuario
        INNER JOIN cosecha ON cosecha.id_cosecha = dispositivo.id_cosecha
        WHERE (
            dispositivo.maestro IN (
                SELECT dispositivo.id_dispositivo
                FROM usuario 
                INNER JOIN dispositivo ON usuario.id_usuario = dispositivo.id_usuario
                WHERE usuario.id_usuario = $id_usuario AND dispositivo.tipo = 'maestro'
            )
            OR dispositivo.id_dispositivo IN (
                SELECT dispositivo.id_dispositivo
                FROM usuario 
                INNER JOIN dispositivo ON usuario.id_usuario = dispositivo.id_usuario
                WHERE usuario.id_usuario = $id_usuario AND dispositivo.tipo = 'maestro'
            )
            OR (
                dispositivo.maestro IN (
                    SELECT dispositivo.id_dispositivo
                    FROM usuario 
                    INNER JOIN dispositivo ON usuario.id_usuario = dispositivo.id_usuario
                    WHERE usuario.id_usuario IN (
                        SELECT cuenta_main 
                        FROM usuario 
                        WHERE id_usuario = $id_usuario
                    ) 
                    AND dispositivo.tipo = 'maestro'
                )
                AND dispositivo.id_usuario = $id_usuario
            )
        )
    ");

    $resultados = $query->result();

    return $resultados;
}

public function getDispositivosSinMaestro($id_usuario)
{

    $rs = $this->db->query("
        SELECT dispositivo.*
        FROM dispositivo
        WHERE dispositivo.id_usuario = $id_usuario
        AND dispositivo.tipo = 'esclavo'
        AND dispositivo.maestro IS NULL
        OR (
            dispositivo.id_usuario IN (
                    SELECT id_usuario 
                    FROM usuario 
                    WHERE cuenta_main = $id_usuario
            )
        );
    ");

    return $rs->num_rows() > 0 ?
        $rs->result() : NULL;
}


/*public function getDispositivos($id_usuario) {

        $rs = $this->db
            ->select("dp.*, cs.nombre as cosecha")
            ->join("cosecha AS cs", "cs.id_cosecha = dp.id_cosecha", "inner")
            ->where("dp.id_usuario", $id_usuario)
            ->from("dispositivo AS dp")
            ->get();

    return $rs->num_rows() > 0 ?
        $rs->result() : NULL;

}*/

    public function getMaestros($id_usuario)
    {

        $rs = $this->db
            ->select("dp.id_dispositivo, dp.nombre, dp.id_cosecha")
            ->from("dispositivo AS dp")
            ->where("id_usuario", "IFNULL((SELECT cuenta_main FROM usuario WHERE id_usuario = $id_usuario), $id_usuario)", FALSE)
            ->where("dp.tipo", "maestro")
            ->get();

        return $rs->num_rows() > 0 ?
            $rs->result() : NULL;
    }

    public function getMaestrosSusucripcion($id_usuario)
    {

        $rs = $this->db->query("
            SELECT dp.*
            FROM dispositivo AS dp
            WHERE (
                dp.id_usuario IN (
                    $id_usuario
                )
                OR dp.id_usuario IN (
                    SELECT id_usuario
                    FROM usuario 
                    WHERE cuenta_main = $id_usuario
                )
            )
            AND dp.tipo = 'maestro';
        ");

        return $rs->num_rows() > 0 ?
            $rs->result() : NULL;
    }

    public function getEsclavosSuscripcion($id_usuario)
    {

        $rs = $this->db->query("
            SELECT dp.*
            FROM dispositivo AS dp
            WHERE (
                dp.id_usuario IN (
                    $id_usuario
                )
                OR dp.id_usuario IN (
                    SELECT id_usuario
                    FROM usuario 
                    WHERE cuenta_main = $id_usuario
                )
            )
            AND dp.tipo = 'esclavo';
        ");

        return $rs->num_rows() > 0 ?
            $rs->result() : NULL;
    }

    public function deleteDispositivo($id_dispositivo)
    {
        $this->db
            ->from('dispositivo')
            ->where('id_dispositivo', $id_dispositivo)
            ->where("id_cosecha IN (SELECT id_cosecha FROM cosecha WHERE fecha_fin IS NOT NULL OR fecha_inicio > CURDATE())")
            ->delete();

        return $this->db->affected_rows() > 0;
    }

    public function deleteDispositivoSuscripcion($id_dispositivo)
    {
        $rs = $this->db
            ->query("CALL eliminar_dispositivo($id_dispositivo)");
        return $rs->result();
    }
    


    public function getDatosDispositivo($id_usuario)
    {
        $rs = $this->db
            ->select('dp.id_dispositivo, dp.mac, co.nombre as cosecha, dp.nombre as dispositivo,dp.bomba, dp.automatizado, dp.tipo, us.nombre as nomus, us.apellidos as appus')
            ->from('dispositivo AS dp')
            ->join('cosecha AS co', 'dp.id_cosecha = co.id_cosecha')
            ->join('usuario AS us', 'dp.id_usuario = us.id_usuario')
            ->where('dp.id_usuario', $id_usuario)
            ->get();

        if ($rs->num_rows() > 0) {
            return $rs->result();
        } else {
            return NULL;
        }
    }

    public function getMac($mac)
    {
        $rs = $this->db
            ->select('id_dispositivo')
            ->from('dispositivo')
            ->where('mac', $mac)
            ->get();

        if ($rs->num_rows() > 0) {
            return $rs->row()->id_dispositivo;
        } else {
            return NULL;
        }
    }
    public function activarBomba($id_dispositivo, $bomba){
        $data = array(
            'bomba' => $bomba
        );
    
        $this->db->where('id_dispositivo', $id_dispositivo);
        $this->db->set($data);
        $this->db->update('dispositivo');
        
        return $this->db->affected_rows() > 0;
    }
    
    public function activarAutomatizado($id_dispositivo, $automatizado){
        $data = array(
            'automatizado' => $automatizado
        );
    
        $this->db->where('id_dispositivo', $id_dispositivo);
        $this->db->set($data);
        $this->db->update('dispositivo');
        
        return $this->db->affected_rows() > 0;
    }

    public function obtenerEstadoDispositivo($id_dispositivo){
        $rs = $this->db
        ->select('id_dispositivo, bomba, automatizado')
        ->from('dispositivo')
        ->where('id_dispositivo', $id_dispositivo)
        ->get();

    if ($rs->num_rows() > 0) {
        return $rs->result();
    } else {
        return NULL;
    }
    }
    
}
