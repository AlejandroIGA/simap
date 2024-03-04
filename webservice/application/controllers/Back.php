<?php
class Back extends CI_Controller
{
    //Constructor
    public function __construct()
    {
        parent::__construct();
        // En tu controlador o en un archivo de configuración adecuado
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        $this->output->set_content_type("application/json");
        $this->load->model("Usuarios_model");
        $this->load->model("Plantas_model");
        $this->load->model("Cultivo_model");
        $this->load->model("Dispositivos_model");
        $this->load->model("Notificaciones_model");
    }

    public function index()
    {
        echo "Controlador Back End";
    }

    //WEBSERVICES (API REST)
    public function login()
    {
        $correo = $this->input->post("correo");
        $psw = $this->input->post("psw");
        $row = $this->Usuarios_model->login($correo, $psw);

        $obj["resultado"] = $row != NULL;
        if($obj["resultado"]!=NULL){
            $token = $row->token;
            if($row->psw == $psw and $row->correo == $correo){
                if($row->estatus == 0){
                    $obj["mensaje"] = "Cuenta desactivada";
                    $obj["data"] = NULL;
                }else{
                    if(!$token){
                        $obj["mensaje"] = "Credenciales correctas";
                        $obj["data"] = array(
                            'id_usuario' => $row->id_usuario,
                            'tipo_usuario' => $row->tipo_usuario,
                            'estatus' => $row->estatus
                        ); 
                        $this->Usuarios_model->saveUserToken($row->id_usuario);
                    }else{
                        $obj["mensaje"] = "Ya hay una sesión activa";
                        $obj["data"] = NULL;
                    }
                }
            }else{
                $obj["mensaje"] = "Correo o contraseña incorrecto";
                $obj["data"] = NULL;
            }
        }else{
            $obj["mensaje"] = "No se encontro al usuario";
            $obj["data"] = NULL;
        }
        

        echo json_encode($obj);
    }


    public function loginWeb()
    {
        $correo = $this->input->post("correo");
        $psw = $this->input->post("psw");
        $row = $this->Usuarios_model->login_Web($correo, $psw);

        $obj["resultado"] = $row != NULL;
        if($obj["resultado"]!=NULL){
            $token = $row->token;
            if($row->psw == $psw and $row->correo == $correo){
                if($row->estatus == 0){
                    $obj["mensaje"] = "Cuenta desactivada";
                    $obj["data"] = NULL;
                }else{
                    if(!$token){
                        $obj["mensaje"] = "Credenciales correctas";
                        $obj["data"] = array(
                            'id_usuario' => $row->id_usuario,
                            'tipo_usuario' => $row->tipo_usuario,
                            'tipo' => $row->tipo,
                            'estatus' => $row->estatus
                        ); 
                        $this->Usuarios_model->saveUserToken($row->id_usuario);
                    }else{
                        $obj["mensaje"] = "Ya hay una sesión activa";
                        $obj["data"] = NULL;
                    }
                }
            }else{
                $obj["mensaje"] = "Correo o contraseña incorrecto";
                $obj["data"] = NULL;
            }
        }else{
            $obj["mensaje"] = "Correo o contraseña incorrecto";
            $obj["data"] = NULL;
        }
        

        echo json_encode($obj);
    }

    public function logout(){
        $id_usuario = $this->input->post("id_usuario");
        $row = $this->Usuarios_model->logout($id_usuario);

        $obj["resultado"] = $row != false;
        $obj["mensaje"] = $obj["resultado"] ?
            "Usuario actualizado"
            : "Usuario no encontrado ->" .json_encode($_POST)."<-";
        $obj["data"] = $row;

        echo json_encode($obj);

    }

    public function usuario()
    {
        $id = $this->input->post("id_usuario");
        $tipo = $this->input->post("tipo_usuario");
        $row = $this->Usuarios_model->getInfoUsuario($id,$tipo);

        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Usuario encontrado"
            : "Usuario no encontrado ->" .json_encode($_POST)."<-";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    //CRUD Usuarios

    public function insertUser(){

        $nombre = $this->input->post("nombre");
        $apellidos = $this->input->post("apellidos");
        $correo = $this->input->post("correo");
        $tel = $this->input->post("tel");
        $tipo_usuario = $this->input->post("tipo_usuario");
        $tipo_login = $this->input->post("tipo_login");
        $row = $this->Usuarios_model->insert($nombre, $apellidos, $correo, $tel, $tipo_usuario, $tipo_login);

        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Usuario agregado"
            : "Error: usuario no agregado";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    public function updateUser(){

        $nombre = $this->input->post("nombre");
        $apellidos = $this->input->post("apellidos");
        $correo = $this->input->post("correo");
        $tel = $this->input->post("tel");
        $tipo_usuario = $this->input->post("tipo_usuario");
        $tipo_login = $this->input->post("tipo_login");
        $row = $this->Usuarios_model->update($nombre, $apellidos, $correo, $tel, $tipo_usuario, $tipo_login);

        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Usuario actualizado"
            : "Error: usuario no actualizado";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    public function deleteUser (){

        $id_usuario = $this->input->post("id_usuario");
        $row = $this->Usuarios_model->delete($id_usuario);

        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Usuario eliminado"
            : "Error: usuario no eliminado";
        $obj["data"] = $row;

        echo json_encode($obj);

    }
    //Consulta empleados
    public function getEmpleados(){
        $id_usuario = $this->input->post("id_usuario");
        $row = $this->Usuarios_model->empleados($id_usuario);

        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Usuarios obtenidos"
            : "Error: usuarios no obtenidos";
        $obj["data"] = $row;

        echo json_encode($obj);

    }
    //Fin de CRUD

    public function getCultivos(){
        $id_usuario = $this->input->post("id_usuario");
        $row = $this->Usuarios_model->getCultivos($id_usuario);

        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Cultivos recuperados"
            : "No hay cultivos registrados";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

   
    public function registroUsuario(){
        $nombre = $this->input->post("nombre");
        $apellidos = $this->input->post("apellidos");
        $correo = $this->input->post("correo");
        $psw = $this->input->post("psw");
        $tipo = $this->input->post("tipo");

        $data = array(
            "nombre" => $nombre,
            "apellidos" => $apellidos,
            "correo" => $correo,
            "psw" => $psw,
            "estatus" => 1,
            "tipo_usuario" => $tipo
        );

        $id_usuario = $this->Usuarios_model->registro($data);

        $suscripcion = array(
            "id_usuario" => $id_usuario,
            "fecha_inicio" => date('Y-m-d H:i:s'),
            "tipo" => "Free",
            "estatus" => 1
        );

        $id_suscripcion = $this->Usuarios_model->suscripcion($suscripcion);

        $obj["resultado"] = $id_usuario != 0;
        $obj['mensaje'] = $obj["resultado"] ? "Usuario registrado exitosamente" : "Imposible registrar usuario, intente de nuevo";
        $obj["id_usuario"] = $id_usuario;
        $obj["id_suscripcion"] = $id_suscripcion;

        echo json_encode($obj);

    }


    //Obtener la información de un cultivo especifico
    public function getCultivo($id_cosecha){
        $row = $this->Cultivo_model->getCultivo($id_cosecha);
        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Cultivo recuperado"
            : "No hay cultivo";
        $obj["data"] = $row;
        echo json_encode($obj);
    }

    public function nuevoDispositivo () {
        $nombre = $this->input->post("nombre");
        $mac = $this->input->post("mac");
        $ssid = $this->input->post("ssid");
        $psw = $this->input->post("psw");
        $tipo = $this->input->post("tipo");
        $maestro = $this->input->post("maestro");
        $id_cosecha = $this->input->post("id_cosecha");
        $id_usuario = $this->input->post("id_usuario");

        if ($maestro > 0) {
            $data = array(
                "nombre" => $nombre,
                "mac" => $mac,
                "ssid" => $ssid,
                "psw" => $psw,
                "tipo" => $tipo,
                "maestro" => $maestro,
                "automatizado" => NULL,
                "id_usuario" => $id_usuario,
                "id_cosecha" => $id_cosecha
            );
        } else {
            $data = array(
                "nombre" => $nombre,
                "mac" => $mac,
                "ssid" => $ssid,
                "psw" => $psw,
                "tipo" => $tipo,
                "automatizado" => NULL,
                "id_usuario" => $id_usuario,
                "id_cosecha" => $id_cosecha
            );
        }

        $id_dispositivo = $this->Dispositivos_model->nuevoDispositivo($data);

        $obj["resultado"] = $id_dispositivo != 0;
        $obj['mensaje'] = $obj["resultado"] ? "Dispositivo nuevo agregado" : "Imposible insertar dispositivo";
        $obj["id_dispositivo"] = $id_dispositivo;

        echo json_encode($obj);

    }

    public function editarDispositivo () {
        $nombre = $this->input->post("nombre");
        $mac = $this->input->post("mac");
        $ssid = $this->input->post("ssid");
        $psw = $this->input->post("psw");
        $tipo = $this->input->post("tipo");
        $maestro = $this->input->post("maestro");
        $id_usuario = $this->input->post("id_usuario");
        $id_dispositivo = $this->input->post("id_dispositivo");
        $id_cosecha = $this->input->post("id_cosecha");

        if ($maestro > 0) {
            $data = array(
                "nombre" => $nombre,
                "mac" => $mac,
                "ssid" => $ssid,
                "psw" => $psw,
                "tipo" => $tipo,
                "maestro" => $maestro,
                "automatizado" => NULL,
                "id_usuario" => $id_usuario,
                "id_cosecha" => $id_cosecha
            );
        } else {
            $data = array(
                "nombre" => $nombre,
                "mac" => $mac,
                "ssid" => $ssid,
                "psw" => $psw,
                "tipo" => $tipo,
                "automatizado" => NULL,
                "id_usuario" => $id_usuario,
                "id_cosecha" => $id_cosecha
            );
        }

        $id_dispositivo = $this->Dispositivos_model->editDispositivo($data, $id_dispositivo);

        $obj["resultado"] = $id_dispositivo != 0;
        $obj['mensaje'] = $obj["resultado"] ? "Dispositivo editado" : "Imposible editar dispositivo, tiene una cosecha en curso";
        $obj["id_dispositivo"] = $id_dispositivo;

        echo json_encode($obj);

    }

    public function dispositivos(){

        $id_usuario = $this->input->post("id_usuario");

        $data = $this->Dispositivos_model->getDispositivos($id_usuario);

            $obj['resultado'] = $data != NULL;
            $obj['mensaje'] = $obj['resultado'] ? "Se recuperaron " .count($data). " dispositivo(s)" : "No hay nigun dispositivo registrado";
            $obj['dispositivos'] = $data;

            echo json_encode($obj);

    }

    // Obtener dispisitivos maestros para asignacion de redes a otros dispositivos.
    public function dispositivosMaestros(){

        $id_usuario = $this->input->post("id_usuario");

        $data = $this->Dispositivos_model->getMaestros($id_usuario);

            $obj['resultado'] = $data != NULL;
            $obj['mensaje'] = $obj['resultado'] ? "Se recuperaron " .count($data). " dispositivo(s) maestros" : "No hay nigun dispositivo registrado del usuario $id_usuario";
            $obj['dispositivosMaestro'] = $data;

            echo json_encode($obj);

    }

    //Eliminar dispositivos

    public function borrarDispositivo(){

        $id_dispositivo = $this->input->post("id_dispositivo");

        $obj["resultado"] = $this->Dispositivos_model->deleteDispositivo($id_dispositivo);
        $obj['mensaje'] = $obj["resultado"] ? "Dispositivo borrado exitosamente" : "Imposible borrar dispositivo, tiene una cosecha en curso";

        echo json_encode($obj);
    }

    //Obtener datos de dispositivos
    
    public function datosDispositivo(){

        $id_usuario = $this->input->post("id_usuario");

        $data = $this->Dispositivos_model->getDatosDispositivo($id_usuario);

            $obj['resultado'] = $data != NULL;
            $obj['mensaje'] = $obj['resultado'] ? "Se recuperaron " .count($data). " dispositivo(s)" : "No hay nigun dispositivo registrado del usuario $id_usuario";
            $obj['Datos del Dispositivo'] = $data;

            echo json_encode($obj);

    }

    //Obtener las plantas registradas
    public function getPlantas(){
        $row = $this->Plantas_model->getPlantas();
        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Plantas recuperadas"
            : "No hay plantas";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    public function getPlanta($planta){
        $row = $this->Plantas_model->getPlanta($planta);
        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Planta recuperada"
            : "No hay planta";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    //Registrar un cultivo/cosecha
    public function addCultivo(){
        $data = array(
            'id_usuario' => $this->input->post("id_usuario"), 
            'id_planta' => $this->input->post("id_planta"), 
            'nombre' => $this->input->post("nombre"), 
            'fecha_inicio' => $this->input->post("fecha_inicio"), 
            'cant_siembra' => $this->input->post("cant_siembra"), 
            'temp_amb_min' => $this->input->post("temp_amb_min"), 
            'temp_amb_max' => $this->input->post("temp_amb_max"), 
            'hum_amb_min' => $this->input->post("hum_amb_min"), 
            'hum_amb_max' => $this->input->post("hum_amb_max"), 
            'hum_sue_min' => $this->input->post("hum_sue_min"), 
            'hum_sue_max' => $this->input->post("hum_sue_max"),
        );

        $rs = $this->Cultivo_model->addCultivo($data);
        $mensaje = "";
        $resultado = null;

        if($rs == false){
            $mensaje = "Ya hay un cultivo activo con ese nombre";
            $resultado = false;
        }else if($rs == true){
            $mensaje = "Se registro el cultivo";
            $resultado = true;
        }

        $obj["resultado"] = $resultado;
        $obj["mensaje"] = $mensaje;

        echo json_encode($obj);

    }

    //Actualizar un cultivo
    public function updateCultivo(){
        $data = array(
            'id_cosecha' => $this->input->post("id_cosecha"), 
            'id_planta' => $this->input->post("id_planta"), 
            'nombre' => $this->input->post("nombre"), 
            'fecha_inicio' => $this->input->post("fecha_inicio"), 
            'cant_siembra' => $this->input->post("cant_siembra"), 
            'temp_amb_min' => $this->input->post("temp_amb_min"), 
            'temp_amb_max' => $this->input->post("temp_amb_max"), 
            'hum_amb_min' => $this->input->post("hum_amb_min"), 
            'hum_amb_max' => $this->input->post("hum_amb_max"), 
            'hum_sue_min' => $this->input->post("hum_sue_min"), 
            'hum_sue_max' => $this->input->post("hum_sue_max"),
        );

        $rs = $this->Cultivo_model->updateCultivo($data);
        $obj["resultado"] = $rs != false;
        $obj["mensaje"] = $obj["resultado"] ?
            "Cultivo actualizado"
            : "No se actualizo o no hay cambios";

        echo json_encode($obj);
    }

    public function deleteCultivo($id_cultivo){
        $row = $this->Cultivo_model->deleteCultivo($id_cultivo);
        $obj["resultado"] = $row != false;
        $obj["mensaje"] = $obj["resultado"] ?
            "Cultivo eliminado"
            : "Hay dispositivos conectados";
        echo json_encode($obj);
    }

    //Obtener plagas
    public function getPlagas($id_cosecha){
        $row = $this->Plantas_model->getPlagas($id_cosecha);
        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Plagas recuperadas"
            : "No hay plagas registradas";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    //Obtener metodos de combate de plagas
    public function getMetodos(){
        $row = $this->Plantas_model->getMetodos();
        $opciones = explode(",",$row->opciones);
        foreach ($opciones as &$elemento) {
            $elemento = trim($elemento, "'");
        }
        
        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Metodos recuperados"
            : "No hay metodos registrados";
        $obj["data"] =$opciones;

        echo json_encode($obj);
    }

    //Finalizar un cultivo
    public function endCultivo(){
        $data = array(
            "id_cosecha" => $this->input->post("id_cosecha"),
            "fecha_fin" => $this->input->post("fecha_fin"),
            "cant_cosecha" => $this->input->post("cant_cosecha"),
            "combate" => $this->input->post("combate"),
            "combate_efectivo" => $this->input->post("combate_efectivo"),
            "plaga" => $this->input->post("plaga")
        );

        $rs = $this->Cultivo_model->endCultivo($data);
        $obj["resultado"] = $rs != false;
        $obj["mensaje"] = $obj["resultado"] ?
            "Cultivo finalizado"
            : "Surgio un error";

        echo json_encode($obj);
    }

    public function suscribirse(){
        $id_usuario = $this->input->post("id_usuario");
        $rs = $this->Usuarios_model->suscribirse($id_usuario);

        $obj["resultado"] = $rs != false;
        $obj["mensaje"] = $obj["resultado"] ?
            "Suscripción actualiza"
            : "Surgio un error";

        echo json_encode($obj);

    }
    //Obtener notificaciones
    public function notificaciones(){

        $id_usuario = $this->input->post("id_usuario");

        $data = $this->Notificaciones_model->getNotificaciones($id_usuario);

            $obj['resultado'] = $data != NULL;
            $obj['mensaje'] = $obj['resultado'] ? "Se recuperaron " .count($data). " notificacion(es)" : "No hay niguna notificación registrada";
            $obj['notificaciones'] = $data;

            echo json_encode($obj);

    }

    //Eliminar notificacion

    public function borrarNotificacion(){

        $id_notificacion = $this->input->post("id_notificacion");

        $obj["resultado"] = $this->Notificaciones_model->deleteNotificacion($id_notificacion);
        $obj['mensaje'] = $obj["resultado"] ? "Notificación borrada exitosamente" : "Imposible borrar notificación";

        echo json_encode($obj);
    }

    public function insertNotification() {

        $id_usuario = $this->input->post('id_usuario');
        $informacion = $this->input->post('informacion');
        $fecha = $this->input->post('fecha');
    
        $data = array(
            'id_usuario' => $id_usuario,
            'informacion' => $informacion,
            'fecha' => $fecha
        );
        
        $id_notificacion = $this->Notificaciones_model->nuevaNotificacion($data);
    
        $obj['resultado'] = $id_notificacion != NULL;
        $obj['mensaje'] = $obj['resultado'] ? "Se registro nueva notificación" : "No se pudo registrar notificación";
        $obj['id_notificacion'] = $id_notificacion;
    
        echo json_encode($obj);
    }
}


