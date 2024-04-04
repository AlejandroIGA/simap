describe usuario;
describe suscripcion;

#INSERT DE USUARIOS PRUEBA
INSERT INTO usuario(nombre,apellidos,correo,psw,estatus,tipo,cuentamain) values
("Juan","Pérez Luna","juan@gmail.com","1234",1,"propietario",null),
("Alberto","Mendez Ibarra","alberto@gmail.com","1234",1,"colaborador",1)

#INSERT SUSCRIPCION PRUEBA
INSERT INTO suscripcion(id_usuario,fecha_inicio,fecha_fin,tipo,estatus) values
(1,NOW(),DATE_ADD(NOW(),INTERVAL 30 DAY),"Pro",1)

select * from usuario;
select * from cosechas;

show tables;

select nombre,apellidos,correo,fecha_inicio,fecha_fin, suscripcion.estatus, suscripcion.tipo from usuario
inner join suscripcion on suscripcion.id_usuario = usuario.id_usuario
where usuario.id_usuario = 1 and suscripcion.estatus=1;

alter table cosechas add column nombre varchar(100);
alter table cosechas add column id_usuario int;
alter table cosechas add foreign key (id_usuario) references usuario(id_usuario)

update cosechas set id_usuario = 1

update cosechas set nombre="Jitomate_H1" where id_planta=1
update cosechas set nombre="Aguacate_H2" where id_planta=2
update cosechas set nombre="Lechuga_H3" where id_planta=3

select * from usuario where id_usuario=1;
select * from plantas;
#Para obtener los datos de cultivos se referencia a cosehcas
select id_cosecha,cant_sembrada,fecha_inicio,fecha_fin,cant_cosechada,cosechas.temp_amb_min,cosechas.temp_amb_max,cosechas.hum_amb_min,cosechas.hum_amb_max,cosechas.hum_sue_min,cosechas.hum_sue_max, cosechas.nombre, plantas.nombre
from cosechas
inner join plantas on plantas.id_planta = cosechas.id_planta
inner join usuario on cosechas.id_usuario = usuario.id_usuario
where cosechas.id_usuario = 1

#MODIFICAR INICIO_COSECHA Y FIN_COSECHA EN PLANTAS POR VALORES INT
ALTER TABLE plantas MODIFY COLUMN inicio_cosecha int;
ALTER TABLE plantas MODIFY COLUMN fin_cosecha int;

/*PROMPT CHATGPT PARA OBTENER LOS VALORES DE LA TABLA PLANTAS
dame la cantidad de gdd necesarias para cada etapa de desarrollo del jitomate Bola y de manera general 
la temperatura y humedad ambiente minima y maxima, así como la humedad de suelo minima y maxima que requiere la planta
*/


#INSERTAR DATOS DE PLANTAS (JITOMATE Saladette)
INSERT INTO plantas(nombre,temp_amb_min,temp_amb_max,hum_amb_min,hum_amb_max,hum_sue_min,hum_sue_max,emergencia,establecimiento,floracion,inicio_cosecha,fin_cosecha) 
VALUES ("Jitomate Saladette",18,27,50,80,50,80,150,650,1250,2050,2550);

#INSERTAR DATOS DE PLANTAS (JITOMATE Bola)
INSERT INTO plantas(nombre,temp_amb_min,temp_amb_max,hum_amb_min,hum_amb_max,hum_sue_min,hum_sue_max,emergencia,establecimiento,floracion,inicio_cosecha,fin_cosecha) 
VALUES ("Jitomate Bola",18,30,50,80,50,80,150,650,1250,2050,2550);

#INSERTAR DATOS DE PLANTAS (JITOMATE Cherry)
INSERT INTO plantas(nombre,temp_amb_min,temp_amb_max,hum_amb_min,hum_amb_max,hum_sue_min,hum_sue_max,emergencia,establecimiento,floracion,inicio_cosecha,fin_cosecha) 
VALUES ("Jitomate Bola",18,30,50,80,50,80,100,600,1100,1900,2300);

#HACER EL DROPDOWN DE PLANTAS
SELECT id_planta, nombre from plantas;

#HACER LA SUGERENCIA DE VALORES ENVIANDO EL VALOR DEL DROPWODN
SELECT id_planta, 
temp_amb_min,
temp_amb_max,
hum_amb_min,
hum_amb_max,
hum_sue_min,
hum_sue_max,
emergencia,
establecimiento,
floracion,
inicio_cosecha,
fin_cosecha
FROM plantas
WHERE id_planta = 7;

#TRIGEER PARA ELIMINAR UN CULTIVO
CREATE TRIGGER eliminarCultivo BEFORE DELETE ON cosecha 
FOR EACH ROW
BEGIN
    DECLARE conexiones INT;
    SET conexiones = (SELECT COUNT(id_cosecha) FROM dispositivo WHERE id_cosecha = OLD.id_cosecha);
    IF conexiones > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Hay dispositivos conectados';
    END IF;
END;

drop trigger eliminarCultivo;
delete from cosecha where id_cosecha = 48;


#obtener las plagas de una planta
select plaga.nombre as plaga, plaga.id_plaga as id_plaga from plaga
    inner join planta_plaga on planta_plaga.id_plaga = plaga.id_plaga
    inner join planta on planta_plaga.id_planta = planta.id_planta
    inner join cosecha on planta.id_planta = cosecha.id_planta
    where id_cosecha = 6
    order by plaga.nombre;


#OBTENER LOS VALORES DE ENUM
Select
SUBSTRING(COLUMN_TYPE, 6, LENGTH(COLUMN_TYPE) - 6) AS opciones
FROM information_schema.columns
WHERE TABLE_SCHEMA = 'simap' -- Reemplaza 'tu_base_de_datos' con el nombre de tu base de datos
AND TABLE_NAME = 'cosecha' -- Reemplaza 'tu_tabla' con el nombre de tu tabla
AND COLUMN_NAME = 'combate'; -- Reemplaza 'opcion' con el nombre de tu columna ENUM

#corregir un fallo de inserción de datos
CREATE TRIGGER endCosecha before update on cosecha
FOR EACH ROW
BEGIN
    IF new.fecha_fin IS NOT NULL THEN
        IF new.plaga = "0" THEN
            SET new.combate = null;
            SET new.combate_efectivo = null;
        END IF;
        update dispositivo set id_cosecha = null where id_cosecha = new.id_cosecha;
    END IF;    
END;

drop TRIGGER endCosecha;

#PROCEDIMIENTO ALMACENADO PARA ENCONTRAR UN NOMBRE DUPLICADO de una cosecha activa

#Grafica de plagas
SHOW PROCEDURE STATUS;
drop PROCEDURE calcular_porcentaje


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
END
call calcular_porcentaje(108,3,4);

SELECT COUNT(*) 
    FROM cosecha
    WHERE id_planta = 1 AND Month(fecha_inicio) = 4 AND MONTH(fecha_fin) = 4;