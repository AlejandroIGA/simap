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


    public function login_Web($correo, $psw)
    {
        $rs = $this->db
            ->select("us.id_usuario,us.tipo_usuario,us.estatus,us.correo,us.psw,us.token,su.tipo")
            ->from("usuario AS us")
            ->join("suscripcion AS su", "su.id_usuario = us.id_usuario")
            ->where("correo", $correo)
            ->where("psw", $psw)
            ->get();
        //die($this->db->last_query());
        return $rs->num_rows() > 0 ?
        $rs->row() : NULL;
    }

    //Método para registrar a un usuario mediante el sistema
    public function registro($data)
    {
        $this->db->insert("usuario", $data);

        return $this->db->affected_rows() > 0 ? 
        $this->db->insert_id() : 0;
    }

    //Método para registrar suscripcion de un usuario nuevo
    public function suscripcion($suscripcion)
    {
        $this->db->insert("suscripcion", $suscripcion);

        return $this->db->affected_rows() > 0 ? 
        $this->db->insert_id() : 0;
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
            ->select("id_cosecha,cant_siembra,fecha_inicio,fecha_fin,cant_cosecha,cosecha.temp_amb_min,cosecha.temp_amb_max,cosecha.hum_amb_min,cosecha.hum_amb_max,cosecha.hum_sue_min,cosecha.hum_sue_max, cosecha.nombre, planta.nombre as planta, combate, combate_efectivo,plaga")
            ->from("cosecha")
            ->join("planta", "planta.id_planta = cosecha.id_planta", "inner join")
            ->join("usuario", "cosecha.id_usuario = usuario.id_usuario", "inner join")
            ->where("cosecha.id_usuario", $id_usuario)
            ->order_by("fecha_inicio", "DESC")
            ->get();

        return $rs->num_rows() > 0 ?
            $rs->result() : NULL;
    }

    //Hacer una suscripción de usuario
    public function suscribirse($id_usuario){
        $this->db
        ->set("tipo","Pro")
        ->set("fecha_inicio","NOW()", false) // Establece el valor de fecha_inicio como la función SQL NOW() sin escapar
        ->set("fecha_fin","DATE_ADD(NOW(), INTERVAL 30 DAY)", false) // Establece el valor de fecha_fin como la función SQL DATE_ADD() sin escapar
        ->where("id_usuario",$id_usuario)
        ->update("suscripcion");
        return $this->db->affected_rows()>0;
    }
    
    //CRUD Usuarios

    public function insert($nombre, $apellidos, $correo, $tel, $tipo_usuario, $tipo_login){
        $data = array(
            'nombre' => $nombre,
            'apellidos' => $apellidos,
            'correo' => $correo,
            'tel' => $tel,
            'tipo_usuario' => $tipo_usuario,
            'tipo_login' => $tipo_login
        );
    
        $this->db->insert('usuario', $data);
    
        return $this->db->affected_rows() > 0;
    }
    

    public function update($id_usuario, $nombre, $apellidos, $correo, $tel, $tipo_usuario, $tipo_login){
        $data = array(
            'nombre' => $nombre,
            'apellidos' => $apellidos,
            'correo' => $correo,
            'tel' => $tel,
            'tipo_usuario' => $tipo_usuario,
            'tipo_login' => $tipo_login
        );
    
        $this->db->where('id_usuario', $id_usuario);
        $this->db->update('usuario', $data);
    
        return $this->db->affected_rows() > 0;
    }
    
    public function delete( $id_usuario ) {
		$this->db
				->where( "id_usuario", $id_usuario )
				->delete( "usuario" );
		return $this->db->affected_rows() > 0;
	}

    //Consulta de usuarios
    public function empleados(){
        $rs = $this->db
            ->select('id_usuario, nombre, apellidos, correo, tel, tipo_usuario, tipo_login')
            ->get("usuario");
    
        return $rs->num_rows() > 0 ?
            $rs->result_array() : NULL;
    }    
    //Fin CRUD Usuarios
}
