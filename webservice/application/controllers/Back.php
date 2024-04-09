<?php

//use function GuzzleHttp\json_encode;

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
        $this->load->model("Sensor_model");
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
        $tokenNotificacion = $this->input->post("token_notificacion");
        $token = bin2hex(random_bytes(32));

        $row = $this->Usuarios_model->login($correo, md5($psw));

        $obj["resultado"] = $row != NULL;
        if ($obj["resultado"] != NULL) {
            $tokenU = $row->token;
            if ($row->psw == md5($psw) and $row->correo == $correo) {
                if ($row->estatus == 0) {
                    $obj["mensaje"] = "Cuenta desactivada";
                    $obj["data"] = NULL;
                } else {
                    if (!$tokenU) {
                        $obj["mensaje"] = "Credenciales correctas";
                        $obj["data"] = array(
                            'id_usuario' => $row->id_usuario,
                            'tipo_usuario' => $row->tipo_usuario,
                            'estatus' => $row->estatus,
                            'token' => $row->token,
                            'cuenta_main' => $row->cuenta_main,
                            'tipo' => $row->tipo
                        );
                        $this->Usuarios_model->saveUserToken($row->id_usuario, $token, $tokenNotificacion);
                    } else {
                        $obj["mensaje"] = "Ya hay una sesión activa";
                        $obj["data"] = NULL;
                    }
                }
            } else {
                $obj["mensaje"] = "Correo o contraseña incorrecto";
                $obj["data"] = NULL;
            }
        } else {
            $obj["mensaje"] = "No se encontro al usuario";
            $obj["data"] = NULL;
        }


        echo json_encode($obj);
    }


    public function loginGoogle()
    {
        $correo = $this->input->post("correo");
        $psw = $this->input->post("psw");
        $token = $this->input->post("token");

        $row = $this->Usuarios_model->login($correo, $psw);

        $obj["resultado"] = $row != NULL;
        if ($obj["resultado"] != NULL) {
            $tokenU = $row->token;
            if ($row->psw == $psw and $row->correo == $correo) {
                if ($row->estatus == 0) {
                    $obj["mensaje"] = "Cuenta desactivada";
                    $obj["data"] = NULL;
                } else {
                    if (!$tokenU) {
                        $obj["mensaje"] = "Credenciales correctas";
                        $obj["data"] = array(
                            'id_usuario' => $row->id_usuario,
                            'tipo_usuario' => $row->tipo_usuario,
                            'estatus' => $row->estatus
                        );
                        $this->Usuarios_model->saveUserToken($row->id_usuario, $token);
                    } else {
                        $obj["mensaje"] = "Ya hay una sesión activa";
                        $obj["data"] = NULL;
                    }
                }
            } else {
                $obj["mensaje"] = "Correo o contraseña incorrecto";
                $obj["data"] = NULL;
            }
        } else {
            $obj["mensaje"] = "No se encontro al usuario";
            $obj["data"] = NULL;
        }


        echo json_encode($obj);
    }



    public function loginWeb()
    {
        $correo = $this->input->post("correo");
        $psw = $this->input->post("psw");
        $token = bin2hex(random_bytes(32));

        $row = $this->Usuarios_model->login_Web($correo, md5($psw));

        $obj["resultado"] = $row != NULL;
        if ($obj["resultado"] != NULL) {
            $tokenU = $row->token;
            if ($row->psw == md5($psw) and $row->correo == $correo) {
                if ($row->estatus == 0) {
                    $obj["mensaje"] = "Cuenta desactivada";
                    $obj["data"] = NULL;
                } else {
                    if (!$tokenU) {

                        $obj["mensaje"] = "Credenciales correctas";
                        $obj["data"] = array(
                            'id_usuario' => $row->id_usuario,
                            'tipo_usuario' => $row->tipo_usuario,
                            'tipo' => $row->tipo,
                            'estatus' => $row->estatus
                        );
                        $this->Usuarios_model->saveUserTokenWeb($row->id_usuario, $token);
                    } else {

                        $obj["mensaje"] = "Ya hay una sesión activa";
                        $obj["data"] = NULL;
                    }
                }
            } else {
                $obj["mensaje"] = "Correo o contraseña incorrecto";
                $obj["data"] = NULL;
            }
        } else {
            $obj["mensaje"] = "Su cuenta no es main";
            $obj["data"] = NULL;
        }


        echo json_encode($obj);
    }

    public function logout()
    {
        $id_usuario = $this->input->post("id_usuario");
        $row = $this->Usuarios_model->logout($id_usuario);

        $obj["resultado"] = $row != false;
        $obj["mensaje"] = $obj["resultado"] ?
            "Usuario actualizado"
            : "Usuario no encontrado ->" . json_encode($_POST) . "<-";
        $obj["data"] = $row;

        echo json_encode($obj);
    }


    public function loginFacebook()
    {
        $correo = $this->input->post("correo");
        $nombre = $this->input->post("nombre");

        // Verificar si el usuario ya existe en la base de datos
        $row = $this->Usuarios_model->getUsuarioPorCorreo($correo);

        // Si el usuario no existe, se crea uno nuevo
        if (!$row) {
            $this->Usuarios_model->guardarUsuarioFacebook($nombre, $correo);
        }

        // Intentar iniciar sesión con los datos del usuario de Facebook
        $row = $this->Usuarios_model->login_facebook($nombre, $correo);

        $obj["resultado"] = $row != NULL;
        if ($obj["resultado"] != NULL) {
            $token = $row->token;
            if ($row->nombre == $nombre and $row->correo == $correo) {
                if ($row->estatus == 0) {
                    $obj["mensaje"] = "Cuenta desactivada";
                    $obj["data"] = NULL;
                } else {
                    if (!$token) {
                        $obj["mensaje"] = "Credenciales correctas";
                        $obj["data"] = array(
                            'id_usuario' => $row->id_usuario,
                            'tipo_usuario' => $row->tipo_usuario,
                        );
                        $this->Usuarios_model->saveUserToken($row->id_usuario);
                    } else {
                        $obj["mensaje"] = "Ya hay una sesión activa";
                        $obj["data"] = NULL;
                    }
                }
            } else {
                $obj["mensaje"] = "Correo o contraseña incorrecto";
                $obj["data"] = NULL;
            }
        } else {
            $obj["mensaje"] = "Correo o contraseña incorrecto";
            $obj["data"] = NULL;
        }

        // Devolver la respuesta JSON utilizando la variable $obj
        echo json_encode($obj);
    }

    public function usuario()
    {
        $id = $this->input->post("id_usuario");
        $tipo = $this->input->post("tipo_usuario");
        $row = $this->Usuarios_model->getInfoUsuario($id, $tipo);

        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Usuario encontrado"
            : "Usuario no encontrado ->" . json_encode($_POST) . "<-";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    //CRUD Usuarios

    public function insertUser(){
        $cuenta_main = $this->input->post('cuenta_main');
        $nombre = $this->input->post("nombre");
        $apellidos = $this->input->post("apellidos");
        $correo = $this->input->post("correo");
        $psw = $this->input->post("psw");
        $tipo_usuario = $this->input->post("tipo_usuario");
        $tipo_login = $this->input->post("tipo_login");
        

        $duplicado = $this->Usuarios_model->correoDuplicado($correo);
        if($duplicado){
            $obj["resultado"] = false;
            $obj["mensaje"] = "Correo duplicado";
        }else if(!$duplicado){
            $row = $this->Usuarios_model->insert($cuenta_main, $nombre, $apellidos, $correo, md5($psw), $tipo_usuario, $tipo_login);
            $obj["resultado"] = $row != NULL;
            $obj["mensaje"] = $obj["resultado"] ?
            "Usuario agregado"
            : "Error: usuario no agregado";
        $obj["data"] = $row;
        }
        echo json_encode($obj);
    }

    public function updateUser()
    {
        $id_usuario = $this->input->post("id_usuario");
        $nombre = $this->input->post("nombre");
        $apellidos = $this->input->post("apellidos");
        $correo = $this->input->post("correo");
        $psw = $this->input->post("psw");
        $tipo_usuario = $this->input->post("tipo_usuario");
        $tipo_login = $this->input->post("tipo_login");
        
        $duplicado = $this->Usuarios_model->correoDuplicadoUpdate($correo,$id_usuario);
        if($duplicado){
            $obj["resultado"] = false;
            $obj["mensaje"] = "Correo duplicado";
        }else{
            $row = $this->Usuarios_model->update($id_usuario, $nombre, $apellidos, $correo, md5($psw), $tipo_usuario, $tipo_login);
            $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Usuario actualizado"
            : "No se realizaron cambios";
        $obj["data"] = $row;
        }
        echo json_encode($obj);
    }


    public function deleteUser()
    {

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
    public function getEmpleados() {
        $id_usuario = $this->input->post("id_usuario");
        $rows = $this->Usuarios_model->empleados($id_usuario);
    
        $obj["resultado"] = !empty($rows);
        $obj["mensaje"] = $obj["resultado"] ?
            "Usuarios obtenidos"
            : "Error: usuarios no obtenidos";
        $obj["data"] = $rows;

        echo json_encode($obj);
    }        

    public function getCantidadUsuarios(){
        $cuenta_main = $this->input->post("cuenta_main");
        $tipo_usuario = $this->input->post("tipo_usuario");
        $row = $this->Usuarios_model->getCantidadUsuarios($cuenta_main, $tipo_usuario);

        $obj["cantidad"] = $row->cantidad;
        echo json_encode($obj);
    }
    //Fin de CRUD

    public function registroUsuario()
    {
        $nombre = $this->input->post("nombre");
        $apellidos = $this->input->post("apellidos");
        $correo = $this->input->post("correo");
        $psw = $this->input->post("psw");
        $tipo = $this->input->post("tipo");
        $tipo_login = $this->input->post("tipo_login");

        $duplicado = $this->Usuarios_model->correoDuplicado($correo);
        if($duplicado){
            $obj["mensaje"] = "Este correo ya está registrado";
        }else{
            $data = array(
                "nombre" => $nombre,
                "apellidos" => $apellidos,
                "correo" => $correo,
                "psw" => md5($psw),
                "estatus" => 1,
                "tipo_usuario" => $tipo,
                "tipo_login" => $tipo_login
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
        }

        
        echo json_encode($obj);
    }

    public function facebookPerfil()
    {
        $nombre = $this->input->post("nombre");
        $correo = $this->input->post("correo");

        $data = array(
            "nombre" => $nombre,
            "correo" => $correo
        );

        $row = $this->Usuarios_model->facebookLogin($nombre, $correo);

        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Guardado de perfil e inicio de sesión exitoso"
            : "Error: inicio de sesión fallido";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    public function getCultivos()
    {
        $id_usuario = $this->input->post("id_usuario");
        $row = $this->Usuarios_model->getCultivos($id_usuario);

        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Cultivos recuperados"
            : "No hay cultivos registrados";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    //Obtener la información de un cultivo especifico
    public function getCultivo($id_cosecha)
    {
        $row = $this->Cultivo_model->getCultivo($id_cosecha);
        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Cultivo recuperado"
            : "No hay cultivo";
        $obj["data"] = $row;
        echo json_encode($obj);
    }

    public function nuevoDispositivo()
    {
        $nombre = $this->input->post("nombre");
        $mac = $this->input->post("mac");
        $tipo = $this->input->post("tipo");
        $maestro = $this->input->post("maestro");
        $id_cosecha = $this->input->post("id_cosecha");
        $id_usuario = $this->input->post("id_usuario");

        $mac_repetida = $this->Dispositivos_model->getMac($mac);

        if($mac_repetida !== NULL) {
            $obj["resultado"] = 0;
            $obj['mensaje'] = "La dirección MAC ya fue utilizada.";
        } else {
            if ($maestro > 0) {
                $data = array(
                    "nombre" => $nombre,
                    "mac" => $mac,
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
        }

        echo json_encode($obj);
    }

    public function editarDispositivo()
    {
        $nombre = $this->input->post("nombre");
        $mac = $this->input->post("mac");
        $tipo = $this->input->post("tipo");
        $maestro = $this->input->post("maestro");
        $id_usuario = $this->input->post("id_usuario");
        $id_dispositivo = $this->input->post("id_dispositivo");
        $id_cosecha = $this->input->post("id_cosecha");

        if ($maestro > 0) {
            $data = array(
                "nombre" => $nombre,
                "mac" => $mac,
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

    public function dispositivos()
    {

        $id_usuario = $this->input->post("id_usuario");

        $data = $this->Dispositivos_model->getDispositivos($id_usuario);

        $obj['resultado'] = $data != NULL;
        $obj['mensaje'] = $obj['resultado'] ? "Se recuperaron " . count($data) . " dispositivo(s)" : "No hay nigun dispositivo registrado";
        $obj['dispositivos'] = $data;

        echo json_encode($obj);
    }

    // Obtener dispisitivos maestros para asignacion de redes a otros dispositivos.
    public function dispositivosMaestros()
    {

        $id_usuario = $this->input->post("id_usuario");

        $data = $this->Dispositivos_model->getMaestros($id_usuario);

        $obj['resultado'] = $data != NULL;
        $obj['mensaje'] = $obj['resultado'] ? "Se recuperaron " . count($data) . " dispositivo(s) maestros" : "No hay nigun dispositivo registrado del usuario $id_usuario";
        $obj['dispositivosMaestro'] = $data;

        echo json_encode($obj);
    }

    //Eliminar dispositivos

    public function borrarDispositivo()
    {

        $id_dispositivo = $this->input->post("id_dispositivo");

        $obj["resultado"] = $this->Dispositivos_model->deleteDispositivo($id_dispositivo);
        $obj['mensaje'] = $obj["resultado"] ? "Dispositivo borrado exitosamente" : "Imposible borrar dispositivo, tiene una cosecha en curso";

        echo json_encode($obj);
    }

    public function borrarDispositivoSuscripcion()
    {

        $id_dispositivo = $this->input->post("id_dispositivo");
        $result = $this->Dispositivos_model->deleteDispositivoSuscripcion($id_dispositivo);

        if((integer)$result[0]->resultado == 1){
            $obj["resultado"] = true;
        }else{
            $obj["resultado"] = false; 
        }
        $obj['mensaje'] = $obj["resultado"] ? "Dispositivo borrado exitosamente" : "Imposible borrar dispositivo, tiene una cosecha en curso";

        echo json_encode($obj);
    }

    //Obtener datos de dispositivos

    public function datosDispositivo()
    {

        $id_usuario = $this->input->post("id_usuario");

        $data = $this->Dispositivos_model->getDatosDispositivo($id_usuario);

        $obj['resultado'] = $data != NULL;
        $obj['mensaje'] = $obj['resultado'] ? "Se recuperaron " . count($data) . " dispositivo(s)" : "No hay nigun dispositivo registrado del usuario $id_usuario";
        $obj['Datos del Dispositivo'] = $data;

        echo json_encode($obj);
    }

    public function activarBomba()
{
    $id_dispositivo = $this->input->post("id_dispositivo");
    $bomba = $this->input->post("bomba");
    $row = $this->Dispositivos_model->activarBomba($id_dispositivo, $bomba);
    $obj["resultado"] = $row != NULL;
    $obj["mensaje"] = $obj["resultado"] ?
        "Se activó bomba"
        : " Error: Algo ocurrió al activar bomba";
    $obj["data"] = $row;

    echo json_encode($obj);
}

public function activarAutomatizado()
{
    $id_dispositivo = $this->input->post("id_dispositivo");
    $automatizado = $this->input->post("automatizado");
    $row = $this->Dispositivos_model->activarAutomatizado($id_dispositivo, $automatizado);
    $obj["resultado"] = $row != NULL;
    $obj["mensaje"] = $obj["resultado"] ?
        "Se activó automatizado"
        : " Error: Algo ocurrió al activar automatizado";
    $obj["data"] = $row;

    echo json_encode($obj);
}

public function obtenerEstadoDispositivo()
{
    $id_dispositivo = $this->input->post("id_dispositivo");

        $data = $this->Dispositivos_model->obtenerEstadoDispositivo($id_dispositivo);

        $obj['resultado'] = $data != NULL;
        $obj['mensaje'] = $obj['resultado'] ? "Se recuperó estado de dispositivo $id_dispositivo" : "Sin estado";
        $obj['Estado del bomba'] = $data;

        echo json_encode($obj);
}

    //Obtener las plantas registradas
    public function getPlantas()
    {
        $row = $this->Plantas_model->getPlantas();
        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Plantas recuperadas"
            : "No hay plantas";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    public function getPlanta($planta)
    {
        $row = $this->Plantas_model->getPlanta($planta);
        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Planta recuperada"
            : "No hay planta";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    //Registrar un cultivo/cosecha
    public function addCultivo()
    {
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

        if ($rs == false) {
            $mensaje = "Ya hay un cultivo activo con ese nombre";
            $resultado = false;
        } else if ($rs == true) {
            $mensaje = "Se registro el cultivo";
            $resultado = true;
        }

        $obj["resultado"] = $resultado;
        $obj["mensaje"] = $mensaje;

        $idNuevoCultivo = $this->Cultivo_model->getUltimoId();
        $idNuevoCultivo = $idNuevoCultivo[0]->id_cosecha;
        $idPlanta = (int)$this->input->post("id_planta");
        
        $this->setGdd($idPlanta, $idNuevoCultivo);

        echo json_encode($obj);
    }

    public function getUltimoId(){
        $data = $this->Cultivo_model->getUltimoId();
        $data = $data[0]->id_cosecha;
        echo json_encode($data);
    }

    //Actualizar un cultivo
    public function updateCultivo()
    {
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

    public function deleteCultivo($id_cultivo)
    {
        $row = $this->Cultivo_model->deleteCultivo($id_cultivo);
        $obj["resultado"] = $row != false;
        $obj["mensaje"] = $obj["resultado"] ?
            "Cultivo eliminado"
            : "Hay dispositivos conectados";
        echo json_encode($obj);
    }

    //Obtener plagas
    public function getPlagas($id_cosecha)
    {
        $row = $this->Plantas_model->getPlagas($id_cosecha);
        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Plagas recuperadas"
            : "No hay plagas registradas";
        $obj["data"] = $row;

        echo json_encode($obj);
    }

    //Obtener metodos de combate de plagas
    public function getMetodos()
    {
        $row = $this->Plantas_model->getMetodos();
        $opciones = explode(",", $row->opciones);
        foreach ($opciones as &$elemento) {
            $elemento = trim($elemento, "'");
        }

        $obj["resultado"] = $row != NULL;
        $obj["mensaje"] = $obj["resultado"] ?
            "Metodos recuperados"
            : "No hay metodos registrados";
        $obj["data"] = $opciones;

        echo json_encode($obj);
    }

    //Finalizar un cultivo
    public function endCultivo()
    {
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

    public function suscribirse()
    {
        $id_usuario = $this->input->post("id_usuario");
        $rs = $this->Usuarios_model->suscribirse($id_usuario);

        $obj["resultado"] = $rs != false;
        $obj["mensaje"] = $obj["resultado"] ?
            "Suscripción actualiza"
            : "Surgio un error";

        echo json_encode($obj);
    }
    
    public function terminarTransaccion(){
        $estado = $this->input->post("estado");
        $res = $this->Usuarios_model->terminarTransaccion($estado);
        $obj["mensaje"] = $res;
        echo json_encode($obj);
    }
    //Obtener notificaciones
    public function notificaciones()
    {

        $id_usuario = $this->input->post("id_usuario");

        $data = $this->Notificaciones_model->getNotificaciones($id_usuario);

        $obj['resultado'] = $data != NULL;
        $obj['mensaje'] = $obj['resultado'] ? "Se recuperaron " . count($data) . " notificacion(es)" : "No hay niguna notificación registrada";
        $obj['notificaciones'] = $data;

        echo json_encode($obj);
    }

    //Eliminar notificacion

    public function borrarNotificacion()
    {

        $id_notificacion = $this->input->post("id_notificacion");

        $obj["resultado"] = $this->Notificaciones_model->deleteNotificacion($id_notificacion);
        $obj['mensaje'] = $obj["resultado"] ? "Notificación borrada exitosamente" : "Imposible borrar notificación";

        echo json_encode($obj);
    }

    public function insertNotification()
    {
        if ($this->input->raw_input_stream[0] == "{") {
            $input = json_decode($this->input->raw_input_stream);
            $id_usuario = $input->id_usuario;
            $informacion = $input->informacion;
        } else {
            $id_usuario = $this->input->post('id_usuario');
            $informacion = $this->input->post('informacion');
        }
        
        $fecha = new DateTime();
        $nueva_zona_horaria = new DateTimeZone('America/Mexico_City');
        $fecha->setTimezone($nueva_zona_horaria);

        $data = array(
            'id_usuario' => $id_usuario,
            'informacion' => $informacion,
            'fecha' => $fecha->format("Y-m-d H:i:s")
        );

        $id_notificacion = $this->Notificaciones_model->nuevaNotificacion($data);
        $token = $this->Notificaciones_model->getTokenUsuario($id_usuario);

        $expoPushEndpoint = "https://exp.host/--/api/v2/push/send";
        $expoPushData = [
            'to' => $token,
            'title' => 'Nueva notificación - SIMAP',
            'body' => $informacion,
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $expoPushEndpoint);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
        ));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($expoPushData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        $obj['resultado'] = $id_notificacion != NULL;
        $obj['mensaje'] = $obj['resultado'] ? "Se registró nueva notificación" : "No se pudo registrar notificación";
        $obj['id_notificacion'] = $id_notificacion;

        echo json_encode($obj);
    }

    public function simulacionDispositivos($mac)
    {
        $data = $this->Sensor_model->simulacionDispositivos($mac);
        if ($data !== NULL) {
            foreach ($data as $row) {
                echo "MAC: " . $row->mac . "<br>";
            }
        } else {
            echo "No se encontraron dispositivos asociados.";
        }
    }

    public function test2()
    {
        $variacion = 0;
        if ($this->input->raw_input_stream[0] == "{") {
            $input = json_decode($this->input->raw_input_stream);
            $mac = $input->mac_esclavo;
            $dispositivos = $this->Sensor_model->simulacionDispositivos($mac);
        } else {
            $mac = $this->input->post("mac_esclavo");
        }

        foreach ($dispositivos as $row) {
            $data = $this->Sensor_model->test($row->mac); //Se obtienen datos de la BD SQL
            if ($data == null) {
                echo 'No se encontro la tarjeta';
                return;
            }
            $fecha = new DateTime();
            $nueva_zona_horaria = new DateTimeZone('America/Mexico_City');
            $fecha->setTimezone($nueva_zona_horaria);
            // Configura los datos que deseas enviar en el cuerpo de la solicitud POST
            $iot = array(
                "fields" => array(
                    "id_maestro" => array("integerValue" => $data->maestro),
                    "id_esclavo" => array("integerValue" => $data->id_dispositivo),
                    "id_cosecha" => array("integerValue" => $data->id_cosecha),
                    "cosecha" =>  array("stringValue" => $data->cosecha),
                    "dispositivo" => array("stringValue" => $data->nombre),
                    "fecha" => array("stringValue" => $fecha->format("Y-m-d H:i:s")),
                    "temp_amb" => array("doubleValue" => $input->temp_amb + $variacion),
                    "hum_amb" => array("doubleValue" => $input->hum_amb + $variacion),
                    "hum_sue" => array("doubleValue" => $input->hum_sue + $variacion),
                )
            );
            //Madar datos al firebase
            $firestore_url = "https://firestore.googleapis.com/v1/projects/testesp-36e82/databases/(default)/documents/pruebas";

            // Configura las opciones de la solicitud POST
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $firestore_url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Accept: application/json',
                'Content-Type: application/json',
            ));
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($iot));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_close($ch);

            // Realiza la solicitud POST a Firestore
            if (!$response = curl_exec($ch)) {
                echo $response;
            } else {
                echo $response;
            }
            $random_valor = rand(0, 8) / 10;
            $variacion = $variacion + $random_valor;
        }
    }

    //TEST ESP32
    public function test()
    {
        if ($this->input->raw_input_stream[0] == "{") {
            $input = json_decode($this->input->raw_input_stream);
            $mac = $input->mac_esclavo;
        } else {
            $mac = $this->input->post("mac_esclavo");
        }

        $data = $this->Sensor_model->test($mac); //Se obtienen datos de la BD SQL
        if ($data == null) {
            echo 'No se encontro la tarjeta';
            return;
        }
        $fecha = new DateTime();
        $nueva_zona_horaria = new DateTimeZone('America/Mexico_City');
        $fecha->setTimezone($nueva_zona_horaria);

        // Configura los datos que deseas enviar en el cuerpo de la solicitud POST
        $iot = array(
            "fields" => array(
                "id_maestro" => array("integerValue" => $data->maestro),
                "id_esclavo" => array("integerValue" => $data->id_dispositivo),
                "id_cosecha" => array("integerValue" => $data->id_cosecha),
                "cosecha" =>  array("stringValue" => $data->cosecha),
                "dispositivo" => array("stringValue" => $data->nombre),
                "fecha" => array("stringValue" => $fecha->format("Y-m-d H:i:s")),
                "hora" => array("stringValue" => $fecha->format("H:i:s")),
                "temp_amb" => array("doubleValue" => $input->temp_amb),
                "hum_amb" => array("doubleValue" => $input->hum_amb),
                "hum_sue" => array("doubleValue" => $input->hum_sue),
            )
        );
        //Madar datos al firebase
        $firestore_url = "https://firestore.googleapis.com/v1/projects/testesp-36e82/databases/(default)/documents/pruebas";

        // Configura las opciones de la solicitud POST
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $firestore_url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
        ));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($iot));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_close($ch);

        // Realiza la solicitud POST a Firestore
        if (!$response = curl_exec($ch)) {
            echo $response;
        } else {
            echo $response;
        }
    }

    /*
    Funcion para calcular los gdd de un cultvio
    La función debe de ejecutarse en cuando se agrega un cultivo por primera vez
    La función se ejecuta cuando hace un login y el ultimo dia registrado en firebase es igual al día del login
    */
    public function setGdd($id_planta, $id_cultivo)
    {
        //MANDAR A LLAMAR CADA QUE SE CREA UN CULTIVO
        $temperaturaBase = $this->Sensor_model->setGdd($id_planta, $id_cultivo);
        $temperaturaBase = $temperaturaBase->temperatura;

        //https://api.openweathermap.org/data/2.5/forecast?lat=20.58806&lon=-100.38806&units=metric&appid=eef355588b320115816599bad7abf8bf
        // Configura las opciones de la solicitud POST
        $clima_url = "https://api.openweathermap.org/data/2.5/forecast?lat=20.58806&lon=-100.38806&units=metric&appid=eef355588b320115816599bad7abf8bf";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $clima_url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
        ));
        curl_setopt($ch, CURLOPT_POST, false); // Cambiado a false para una solicitud GET
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // No necesitamos CURLOPT_POSTFIELDS para una solicitud GET

        // Realiza la solicitud GET
        $response = curl_exec($ch);
        $informacion = [];
        if ($response === false) {
            // Manejar errores si la solicitud falla
            echo 'Error en la solicitud: ' . curl_error($ch);
        } else {
            // Manejar la respuesta exitosa
            $decoded_response = json_decode($response, true);
            $dataPeticion = $decoded_response['list'];
            $fecha = new DateTime();
            $nueva_zona_horaria = new DateTimeZone('America/Mexico_City');
            $fecha->setTimezone($nueva_zona_horaria);

            $fechaActual = $fecha->format('Y-m-d');

            foreach ($dataPeticion as $data) {
                $fechaObtenida = new DateTime($data["dt_txt"]);
                $fechaObtenida = $fechaObtenida->format('Y-m-d');
                if ($fechaObtenida > $fechaActual) {
                    $pares["fecha"] = $fechaObtenida;
                    $pares["temp_avg"] = $data["main"]["temp"];
                    array_push($informacion, $pares);
                }
            }
        }
        $dataJson = json_encode($informacion);
        // Decodificar el JSON
        $data = json_decode($dataJson, true);

        // Nuevo arreglo para almacenar el promedio de temp_avg por fecha
        $promedio_temp_avg_por_fecha = array();

        // Nuevo arreglo para almacenar la cantidad de valores por fecha
        $cantidad_valores_por_fecha = array();

        // Recorrer los datos y calcular el promedio de temp_avg por fecha
        foreach ($data as $item) {
            $fecha = $item['fecha'];
            $temp_avg = $item['temp_avg'];

            // Verificar si la fecha ya existe en el nuevo arreglo
            if (array_key_exists($fecha, $promedio_temp_avg_por_fecha)) {
                // Sumar el temp_avg y la cantidad de valores para la fecha existente
                $promedio_temp_avg_por_fecha[$fecha] += $temp_avg;
                $cantidad_valores_por_fecha[$fecha]++;
            } else {
                // Crear una nueva entrada en el arreglo para la fecha
                $promedio_temp_avg_por_fecha[$fecha] = $temp_avg;
                $cantidad_valores_por_fecha[$fecha] = 1;
            }
        }
        $responseData = [];

        // Calcular el promedio para cada fecha
        foreach ($promedio_temp_avg_por_fecha as $fecha => $suma_temp_avg) {
            $pares["id_cosecha"] = $id_cultivo;
            $pares["id_planta"] = $id_planta;

            $cantidad_valores = $cantidad_valores_por_fecha[$fecha];
            $promedio = $suma_temp_avg / $cantidad_valores;
            $promedio = number_format($promedio, 2);
            if ($promedio > $temperaturaBase) {
                $pares["fecha"] = $fecha;
                $pares["temp_avg"] = $promedio;
                $pares["gdd"] = number_format($promedio - $temperaturaBase, 2);
                array_push($responseData, $pares);
            } else {
                $pares["fecha"] = $fecha;
                $pares["temp_avg"] = $promedio;
                $pares["gdd"] = 0;
                array_push($responseData, $pares);
            }
        }
        //echo json_encode($responseData); //este response data debe de mandarse a firebase
    
        
        //crear arreglo a mandar a firebase
        foreach($responseData as $data){
            $output = array(
                "fields" => array(
                    "id_cosecha" => array("integerValue" => $data['id_cosecha']),
                    "id_planta" => array("integerValue" => $data['id_planta']),
                    "fecha" => array("stringValue" => $data['fecha']),
                    "temp_avg" => array("doubleValue" => $data['temp_avg']),
                    "gdd" => array("doubleValue" => $data['gdd'])
                )
            );
        //Madar datos al firebase
        $firestore_url = "https://firestore.googleapis.com/v1/projects/testesp-36e82/databases/(default)/documents/desarrollo";

        // Configura las opciones de la solicitud POST
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $firestore_url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
        ));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($output));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_close($ch);

        // Realiza la solicitud POST a Firestore
        if (!$response = curl_exec($ch)) {
            echo $response;
        } else {
            echo $response;
        }
        }
        
        
    }

    public function getConfiguracion($mac)
    {
        $dataMaestro = $this->Sensor_model->getMaestro($mac);
        $dataSensor = $this->Sensor_model->getConfiguracion($mac);
        $obj["sensores"] = $dataSensor;
        $obj["maestro"] = $dataMaestro[0];
        echo json_encode($obj);
    }

    public function getSlaves($mac)
    {
        $data = $this->Sensor_model->getSlaves($mac);
        $obj["data"] = $data;
        echo json_encode($obj);
    }

    public function insertConsumoAgua(){
        if ($this->input->raw_input_stream[0] == "{") {
            $input = json_decode($this->input->raw_input_stream);
            $mac = $input->mac_maestro;
        } else {
            $mac = $this->input->post("mac_maestro");
        }

        $fecha = new DateTime();
        $nueva_zona_horaria = new DateTimeZone('America/Mexico_City');
        $fecha->setTimezone($nueva_zona_horaria);

        $data = $this->Sensor_model->insertConsumoAgua($mac);

        $iot = array(
            "fields" => array(
                "id_maestro" => array("integerValue" => $data->id_dispositivo),
                "id_cosecha" => array("integerValue" => $data->id_cosecha),
                "cosecha" =>  array("stringValue" => $data->cosecha),
                "dispositivo" => array("stringValue" => $data->nombre),
                "fecha" => array("stringValue" => $fecha->format("Y-m-d H:i:s")),
                "agua" => array("doubleValue" => $input->agua),
            )
        );

        //Madar datos al firebase
        $firestore_url = "https://firestore.googleapis.com/v1/projects/testesp-36e82/databases/(default)/documents/consumoAgua";
        // Configura las opciones de la solicitud POST
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $firestore_url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
        ));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($iot));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_close($ch);

        // Realiza la solicitud POST a Firestore
        if (!$response = curl_exec($ch)) {
            echo $response;
        } else {
            echo $response;
        }
    }

    public function automatizado($mac){
        $data = $this->Sensor_model->automatizado($mac);
        echo json_encode($data);
    }

    public function actualizarEstadoBomba(){
        if ($this->input->raw_input_stream[0] == "{") {
            $input = json_decode($this->input->raw_input_stream);
            $mac = $input->mac;
            $estado = $input->estado;
        } else {
            $mac = $this->input->post("mac");
            $estado = $this->input->post("estado");
        }

        $data = $this->Sensor_model->actualizarEstadoBomba($mac,$estado);

        $obj["mac"] = $mac;
        $obj["estado"] = $estado;
        $obj["respuesta"] = $data==true ? "Se actualizo estado" : "No se actualizo";

        echo json_encode($obj);
    }

    public function getEtapasPlanta(){
        $id_planta = $this->input->post("id_planta");
        $data = $this->Sensor_model->getEtapasPlanta($id_planta);
        echo json_encode($data);
    }

    public function getEtapasPlaga(){
        $id_planta = $this->input->post("id_planta");
        $data = $this->Sensor_model->getEtapasPlaga($id_planta);
        echo json_encode($data);
    }

    public function getPorcentajes(){
         $id_cosecha = $this->input->post("id_cosecha");    
         $mesInicio = $this->input->post("mes_inicio");
         $mesFin = $this->input->post("mes_fin");
         $planta = $this->Sensor_model->getNombrePlanta($id_cosecha);    

        $registros = $this->Sensor_model->getPorcentajes($id_cosecha,$mesInicio,$mesFin);
        $resto = 1;
        if($registros == !null){
            foreach($registros as $registro){
                $resto = $resto - $registro->porcentaje_afectados;
                $finalizados = $registro->finalizados;
            }
            $porcentajes = [];
            $data["estado"] = true;
            $data["finalizados"] = $finalizados;
            $data["planta"] = $planta;
            for($i=0; $i<count($registros)+1;$i++){
                if($i != count($registros)){
                    $obj["y"] = (float)$registros[$i]->porcentaje_afectados;
                    $obj["name"] = $registros[$i]->plaga;
                }else{
                    $obj["y"] = $resto;
                    $obj["name"] = "Sin plaga";
                }
                array_push($porcentajes, $obj);
            }
            $data["porcentajes"] =$porcentajes;
        }else{
            $data["estado"] = false;
        }
        
        //validar porcentajes 
        echo json_encode($data);
    }

    public function getCultivosActivos(){
        $id_usuario = $this->input->post("id_usuario");
        $data = $this->Cultivo_model->getCultivosActivos($id_usuario);
        echo json_encode($data);
    }

   
}
