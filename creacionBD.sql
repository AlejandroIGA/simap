CREATE TABLE usuario(
    id_usuario int auto_increment,
    cuenta_main int,
    nombre varchar(60),
    apellidos varchar(100),
    correo varchar(100),
    psw varchar(255),
    estatus int,
    tipo_usuario varchar(20),
    token varchar(100),
    tipo_login varchar(30),
    token_notificacion varchar(100),
    PRIMARY KEY (id_usuario),
    CONSTRAINT FK_Cuenta_Main FOREIGN KEY (cuenta_main) references usuario(id_usuario)
);

CREATE TABLE notificaciones(
    id_notificacion int auto_increment,
    id_usuario int,
    informacion text,
    fecha datetime,
    PRIMARY KEY (id_notificacion),
    CONSTRAINT FK_Notificacion_Usuario FOREIGN KEY (id_usuario) references usuario(id_usuario)
);

CREATE TABLE suscripcion(
    id_suscripcion int auto_increment,
    id_usuario int,
    fecha_inicio datetime,
    fecha_fin datetime,
    tipo varchar(20),
    estatus int,
    PRIMARY KEY (id_suscripcion),
    CONSTRAINT FK_Suscripcion_Usurio FOREIGN KEY (id_usuario) references usuario(id_usuario)
);


CREATE TABLE plaga(
    id_plaga int auto_increment,
    nombre varchar(100),
    temp_amb_min float(4,2),
    temp_amb_max float(4,2),
    huevo int,
    larva int,
    pupa int,
    adulto int,
    PRIMARY KEY (id_plaga)
);


CREATE TABLE planta(
    id_planta int auto_increment,
    nombre varchar(100),
    emergencia int,
    establecimiento int,
    floracion int,
    inicio_cosecha int,
    fin_cosecha int,
    temp_amb_min float(4,2),
    temp_amb_max float(4,2),
    hum_amb_min float(4,2),
    hum_amb_max float(4,2),
    hum_sue_min float(4,2),
    hum_sue_max float(4,2),
    PRIMARY KEY (id_planta)
);


CREATE TABLE planta_plaga (
    id_planta INT,
    id_plaga INT,
    PRIMARY KEY (id_planta, id_plaga),
    FOREIGN KEY (id_planta) REFERENCES planta(id_planta),
    FOREIGN KEY (id_plaga) REFERENCES plaga(id_plaga)
);

CREATE TABLE cosecha (
    id_cosecha int auto_increment,
    id_usuario int,
    id_planta int,
    nombre varchar(100),
    combate enum('insecticida/pesticida','biologico','atrayentes','otro'),
    combate_efectivo varchar(2),
    fecha_inicio date,
    fecha_fin date,
    cant_siembra float,
    cant_cosecha float,
    temp_amb_min int,
    temp_amb_max int,
    hum_amb_min int,
    hum_amb_max int,
    hum_sue_min int,
    hum_sue_max int,
    plaga varchar(100),
    PRIMARY KEY (id_cosecha),
    CONSTRAINT FK_Cosecha_Usuario FOREIGN KEY (id_usuario) references usuario(id_usuario),
    CONSTRAINT FK_Cosecha_Planta FOREIGN KEY (id_planta) references planta (id_planta)
);


CREATE TABLE dispositivo(
    id_dispositivo int auto_increment,
    maestro int,
    id_usuario int,
    id_cosecha int,
    nombre varchar(100),
    mac varchar(32),
    ssid varchar(100),
    psw varchar(100),
    tipo varchar(30),
    automatizado int,
    bomba int,
    PRIMARY KEY (id_dispositivo),
    CONSTRAINT FK_Maestro FOREIGN KEY (maestro) references dispositivo(id_dispositivo),
    CONSTRAINT FK_Dispositivo_Usuario FOREIGN KEY (id_usuario) references usuario(id_usuario),
    CONSTRAINT FK_Dispositivo_Cosecha FOREIGN KEY (id_cosecha) references cosecha(id_cosecha) 
);

#VER TABLAS
SHOW tables;

#OBTENER LAS OPCIONES DE ENUM
SELECT SUBSTRING(COLUMN_TYPE, 6, LENGTH(COLUMN_TYPE) - 6) AS opciones
FROM information_schema.columns
WHERE TABLE_SCHEMA = 'simap' -- Reemplaza 'tu_base_de_datos' con el nombre de tu base de datos
  AND TABLE_NAME = 'cosecha' -- Reemplaza 'tu_tabla' con el nombre de tu tabla
  AND COLUMN_NAME = 'combate'; -- Reemplaza 'opcion' con el nombre de tu columna ENUM


#INSERT DE USUARIOS
INSERT INTO 
usuario(cuenta_main,nombre,apellidos,correo,psw,estatus,tipo_usuario) values
(null,"Alejandro","Infante","alejandro@gmail.com","81dc9bdb52d04dc20036dbd8313ed055",1,"propietario")

(null,"Juan","Díaz Cruz","juan@gmail.com","1234",1,"propietario",null,"sistema"),
(1,"Martin","Álvarez Luna","martin@gmail.com","1234",1,"colaborador",null,"sistema"),
(null,"Dante","Bonilla Ibarra","dante@gmail.com","1234",1,"propietario",null,"sistema")

#INSERT DE SUSCRIPCION
INSERT INTO suscripcion(id_usuario,fecha_inicio,fecha_fin,tipo,estatus) values 
(1,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),"Pro",1),
(3,NOW(),null,"Free",1)

#INSERT DE PLANTA
INSERT INTO planta(nombre,temp_amb_min,temp_amb_max,hum_amb_min,hum_amb_max,hum_sue_min,hum_sue_max,emergencia,establecimiento,floracion,inicio_cosecha,fin_cosecha) VALUES 
("Jitomate Saladette",18,27,50,80,50,80,150,650,1250,2050,2550),
("Jitomate Bola",18,30,50,80,50,80,150,650,1250,2050,2550),
("Jitomate Bola",18,30,50,80,50,80,100,600,1100,1900,2300)

#INSERT DE PLAGA
INSERT INTO plaga(nombre,temp_amb_min,temp_amb_max,huevo,larva,pupa,adulto) values
("Mosca Blanca",20,30,0,150,350,550),
("Pulgones",20,25,0,100,200,400),
("Trips",25,30,0,150,270,370)

#INSERT PLANTA_PLAGA
INSERT INTO planta_plaga values 
(1,1),
(1,2),
(1,3),
(2,1),
(2,2),
(3,1),
(3,3)

#INSERT DE COSECHA
INSERT INTO cosecha(id_usuario,id_planta,nombre,fecha_inicio,cant_siembra,temp_amb_min,temp_amb_max,hum_amb_min,hum_amb_max,hum_sue_min,hum_sue_max) values
(1,1,"Saladette_h1",now(),150,18,27,50,80,50,80),
(3,1,"Saladette_h1",now(),150,18,27,50,80,50,80)

#INSERT DE DISPOSITIVO
INSERT INTO dispositivo(maestro, id_usuario,id_cosecha,mac,ssid,psw,tipo,automatizado) values
(null,1,5,"aabbccdd","red1","1234","maestro",1),
(10,2,5,"eeffgghh","red1","1234","esclavo",null),
(null,3,6,"aaeeiioo","red1","1234","maestro",1)

#INSERT DE DISPOSITIVO
INSERT INTO dispositivo(maestro, id_usuario,id_cosecha,nombre,mac,ssid,psw,tipo,automatizado) values
(20,4,84,"ESP32-A","3282601366","Simap","12345678","esclavo",null)

 select mac from dispositivo where maestro in (select maestro from dispositivo where mac = "3282601365");


 Select dispositivo.id_dispositivo from usuario 
 inner join dispositivo on usuario.id_usuario = dispositivo.id_usuario
 where usuario.id_usuario = 4 and dispositivo.tipo="maestro";



 Select dispositivo.id_dispositivo from usuario 
 inner join dispositivo on usuario.id_usuario = dispositivo.id_usuario
 where usuario.id_usuario in (Select cuenta_main from usuario where id_usuario = 2) and dispositivo.tipo="maestro" ;

#OBTENER LAS TARJETAS ESCLAVO Y MAESTRO PARA EL PROPIETARIO Y LA CORRESPONDIENTE PARA EL COLABORARDOR.
#CON ESTA CONSULTA NO IMPORTA QUIEN DE DA ALTA UNA TARJETA, TODO SE BASA EN EL ID DEL MAESTRO
 Select dispositivo.*, cosecha.nombre as cosecha from dispositivo
 inner join usuario on usuario.id_usuario = dispositivo.id_usuario
 inner join cosecha on cosecha.id_cosecha = dispositivo.id_cosecha
 where (dispositivo.maestro in
    (Select dispositivo.id_dispositivo from usuario 
 inner join dispositivo on usuario.id_usuario = dispositivo.id_usuario
 where usuario.id_usuario = 4 and dispositivo.tipo="maestro") or dispositivo.id_dispositivo in (Select dispositivo.id_dispositivo from usuario 
 inner join dispositivo on usuario.id_usuario = dispositivo.id_usuario
 where usuario.id_usuario = 4 and dispositivo.tipo="maestro"))
 or 
 (
    dispositivo.maestro in
    ( Select dispositivo.id_dispositivo from usuario 
 inner join dispositivo on usuario.id_usuario = dispositivo.id_usuario
 where usuario.id_usuario in (Select cuenta_main from usuario where id_usuario = 4) and dispositivo.tipo="maestro") and dispositivo.id_usuario = 4
 )

 --TRIGGERS PARA LA BASE
DELIMITER //
CREATE TRIGGER endCosecha before update on cosecha
FOR EACH ROW
BEGIN
    IF new.fecha_fin IS NOT NULL THEN
        IF new.plaga = "0" THEN
            SET new.combate = null;
            SET new.combate_efectivo = null;
        END IF;
    END IF;    
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER transferir_dispositivos
BEFORE DELETE ON usuario
FOR EACH ROW
BEGIN
    -- Verificar si el usuario que se va a eliminar es un colaborador
    IF OLD.tipo_usuario = 'Colaborador' THEN
        -- Actualizar el id_usuario de los dispositivos asociados al colaborador
        UPDATE dispositivo SET id_usuario = OLD.cuenta_main WHERE id_usuario = OLD.id_usuario;
        
        -- Actualizar el id_usuario de las cosechas asociadas al colaborador
        UPDATE cosecha SET id_usuario = OLD.cuenta_main WHERE id_usuario = OLD.id_usuario;
    END IF;
END //
DELIMITER ;

--PROCEDIMIENTOS ALMACENADOS
DELIMITER //
CREATE PROCEDURE calcular_porcentaje(IN cosecha_id INT, IN mes_inicio INT, IN mes_fin INT)
BEGIN
    DECLARE planta_id INT;
    DECLARE total_finalizados INT;
    
    -- Obtener el id_planta de la cosecha especificada
    SELECT id_planta INTO planta_id
    FROM cosecha
    WHERE id_cosecha = cosecha_id;

    -- Calcular el total de cultivos finalizados para la planta de la cosecha especificada
    SELECT COUNT(*) INTO total_finalizados
    FROM cosecha
    WHERE id_planta = planta_id AND Month(fecha_inicio) = mes_inicio AND MONTH(fecha_fin) = mes_fin;

    -- Realizar la consulta para calcular el porcentaje de afectados
    SELECT
        COUNT(*) * 1.0 / total_finalizados AS porcentaje_afectados,
        plaga,
        total_finalizados AS finalizados
    FROM
        cosecha
    WHERE
        plaga != '0'
        AND id_planta = planta_id
        AND Month(fecha_inicio) = mes_inicio AND MONTH(fecha_fin) = mes_fin
    GROUP BY
        plaga, total_finalizados;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE eliminar_dispositivo(IN dispositivoEliminar INT)
BEGIN
    DECLARE id_maestro INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT "0" as resultado;
    END;

    START TRANSACTION;
    SELECT maestro INTO id_maestro
    FROM dispositivo
    WHERE id_dispositivo = dispositivoEliminar
    LIMIT 1;
    IF id_maestro IS NULL THEN
        UPDATE dispositivo
        SET id_cosecha = NULL
        WHERE maestro = dispositivoEliminar;

        UPDATE dispositivo
        SET maestro = NULL
        WHERE maestro = dispositivoEliminar;

        DELETE FROM dispositivo
        WHERE id_dispositivo = dispositivoEliminar;
    ELSE
        DELETE FROM dispositivo
        WHERE id_dispositivo = dispositivoEliminar;
    END IF;
        SELECT "1" as resultado;
    COMMIT;
END //
DELIMITER ;

--VISTA CULTIVOS ACTIVOS (Cultivo_model)
create view cultivos_activos as
select cosecha.id_cosecha, planta.id_planta as id_planta, fecha_inicio, fecha_fin, cosecha.temp_amb_min, cosecha.id_usuario as cosecha.id_usuario,
    cosecha.temp_amb_max, cosecha.hum_amb_min, cosecha.hum_amb_max, cosecha.hum_sue_min, cosecha.hum_sue_max,
    cosecha.nombre as cosecha_nombre, planta.nombre as planta_nombre
    from cosecha
    inner join planta on planta.id_planta = cosecha.id_planta
    inner join usuario on cosecha.id_usuario = usuario.id_usuario;

--VISTA PLAGAS (Plantas_model)
create view plagas as
SELECT plaga.nombre as plaga, plaga.id_plaga as id_plaga, cosecha.id_cosecha
FROM plaga
inner join planta_plaga on planta_plaga.id_plaga = plaga.id_plaga
inner join planta on planta_plaga.id_planta = planta.id_planta
inner join cosecha on planta.id_planta = cosecha.id_planta