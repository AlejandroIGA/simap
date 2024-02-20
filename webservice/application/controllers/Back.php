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
    }

    public function index()
    {
        echo "<h1>Controlador Back End</h1>";
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

    public function nuevoDispositivo () {
        $nombre = $this->input->post("nombre");
        $mac = $this->input->post("mac");
        $ssid = $this->input->post("ssid");
        $psw = $this->input->post("psw");
        $tipo = $this->input->post("tipo");
        $maestro = $this->input->post("maestro");
        $id_usuario = $this->input->post("id_usuario");

        $data = array(
            "nombre" => $nombre,
            "mac" => $mac,
            "ssid" => $ssid,
            "psw" => $psw,
            "tipo" => $tipo,
            "maestro" => $maestro,
            "automatizado" => NULL,
            "id_usuario" => $id_usuario,
            "id_cosecha" => NULL
        );

        $id_dispositivo = $this->Dispositivos_model->nuevoDispositivo($data);

        $obj["resultado"] = $id_dispositivo != 0;
        $obj['mensaje'] = $obj["resultado"] ? "Dispositivo nuevo agregado" : "Imposible insertar promocion";
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
            $obj['mensaje'] = $obj['resultado'] ? "Se recuperaron " .count($data). " dispositivo(s) maestros" : "No hay nigun dispositivo registrado del usuario " + $id_usuario;
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

        $obj["resultado"] = $rs != false;
        $obj["mensaje"] = $obj["resultado"] ?
            "Cultivo guardado"
            : "Se genero un error";

        echo json_encode($obj);

    }
}
