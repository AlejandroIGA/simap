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
}
