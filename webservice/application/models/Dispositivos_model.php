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
            ->where("id_cosecha IN (SELECT id_cosecha FROM cosecha WHERE fecha_fin IS NOT NULL OR fecha_inicio > CURDATE())")
            ->update("dispositivo", $data);

        return $this->db->affected_rows() > 0 ?
            $id_dispositivo : 0;
    }

   public function getDispositivos($id_usuario)
{
    $query = $this->db->query("
        SELECT dispositivo.*, cosecha.nombre as cosecha
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
            ->select("dp.id_dispositivo, dp.nombre, dp.ssid, dp.psw, dp.id_cosecha")
            ->from("dispositivo AS dp")
            ->where("id_usuario", "IFNULL((SELECT cuenta_main FROM usuario WHERE id_usuario = $id_usuario), $id_usuario)", FALSE)
            ->where("dp.tipo", "maestro")
            ->get();

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


    public function getDatosDispositivo($id_usuario)
    {
        $rs = $this->db
            ->select('dp.id_dispositivo, dp.mac, dp.ssid, co.nombre')
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
}
