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
    CONSTRAINT FK_Suscripcion_Usurio FOREIGN KEY (id_suscripcion) references usuario(id_usuario)
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
    fecha_inicio datetime,
    fecha_fin datetime,
    cant_siembra float,
    cant_cosecha float,
    temp_amb_min float(4,2),
    temp_amb_max float(4,2),
    hum_amb_min float(4,2),
    hum_amb_max float(4,2),
    hum_sue_min float(4,2),
    hum_sue_max float(4,2),
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
usuario(cuenta_main,nombre,apellidos,correo,psw,estatus,tipo_usuario,token,tipo_login) values
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




