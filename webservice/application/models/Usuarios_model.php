<?php
class Usuarios_model extends CI_Model
{
    //Método para realizar el login de un usuario mediante la página (sin APIS)
    public function login($correo, $psw)
    {
        $rs = $this->db
            ->select("id_usuario,tipo_usuario,estatus,correo,psw,token")
            ->from("usuario")
            ->where("correo", $correo)
            ->where("psw", $psw)
            ->get();
        //die($this->db->last_query());
        return $rs->num_rows() > 0 ?
        $rs->row() : NULL;
    }

    //Método para guardar el token del usuario
    public function saveUserToken($id_usuario)
    {
        $token = bin2hex(random_bytes(32));
        $this->db
            ->set("token", $token)
            ->where("id_usuario", $id_usuario)
            ->update("usuario");
    }

    //Método para actualizar token al cerrar sesión
    public function logout($id_usuario){
        $rs = $this->db
        ->set("token", NULL)
            ->where("id_usuario", $id_usuario)
            ->update("usuario");
        
        return $this->db->affected_rows()>0;
    }

    //Método para obtener la información del usuario
    public function getInfoUsuario($id_usuario, $tipo)
    {
        if ($tipo == "propietario") {
            $rs = $this->db
                ->select("nombre,apellidos,correo,fecha_inicio,fecha_fin, suscripcion.estatus, suscripcion.tipo")
                ->from("usuario")
                ->join("suscripcion", "suscripcion.id_usuario = usuario.id_usuario", "inner join")
                ->where("usuario.id_usuario", $id_usuario)
                ->where("suscripcion.estatus", 1)
                ->get();
            //die($this->db->last_query());
        }else if ($tipo == "colaborador"){
            $rs = $this->db
            ->select("nombre,apellidos,correo,fecha_inicio,fecha_fin, suscripcion.estatus, suscripcion.tipo")
            ->from("usuario")
            ->join("suscripcion", "suscripcion.id_usuario = usuario.cuenta_main", "inner join")
            ->where("usuario.id_usuario", $id_usuario)
            ->where("suscripcion.estatus", 1)
            ->get(); 
        }

        return $rs->num_rows() > 0 ?
            $rs->row() : NULL;
    }

    //Método para obtener la información de los cultivos del usuario
    public function getCultivos($id_usuario)
    {
        $rs = $this->db
            ->select("id_cosecha,cant_siembra,fecha_inicio,fecha_fin,cant_cosecha,cosecha.temp_amb_min,cosecha.temp_amb_max,cosecha.hum_amb_min,cosecha.hum_amb_max,cosecha.hum_sue_min,cosecha.hum_sue_max, cosecha.nombre, planta.nombre as planta")
            ->from("cosecha")
            ->join("planta", "planta.id_planta = cosecha.id_planta", "inner join")
            ->join("usuario", "cosecha.id_usuario = usuario.id_usuario", "inner join")
            ->where("cosecha.id_usuario", $id_usuario)
            ->order_by("fecha_inicio", "DESC")
            ->get();

        return $rs->num_rows() > 0 ?
            $rs->result() : NULL;
    }

}
