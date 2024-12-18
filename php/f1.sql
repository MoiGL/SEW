CREATE DATABASE f1_database;

USE f1_database;

CREATE TABLE pilotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nacionalidad VARCHAR(50),
    equipo_id INT
);

CREATE TABLE equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    motor VARCHAR(50)
);

CREATE TABLE carreras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    pais VARCHAR(50)
);

CREATE TABLE resultados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrera_id INT,
    piloto_id INT,
    posicion INT,
    tiempo VARCHAR(50),
    FOREIGN KEY (carrera_id) REFERENCES carreras(id),
    FOREIGN KEY (piloto_id) REFERENCES pilotos(id)
);

CREATE TABLE estadisticas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    piloto_id INT,
    total_puntos INT,
    podios INT,
    FOREIGN KEY (piloto_id) REFERENCES pilotos(id)
);


INSERT INTO equipos (nombre, motor) VALUES
('Ferrari', 'Ferrari'),
('Mercedes', 'Mercedes'),
('Red Bull Racing', 'Honda'),
('McLaren', 'Mercedes'),
('Aston Martin', 'Mercedes'),
('Alpine', 'Renault'),
('Alfa Romeo', 'Ferrari'),
('Haas', 'Ferrari'),
('AlphaTauri', 'Honda'),
('Williams', 'Mercedes');


INSERT INTO pilotos (nombre, apellido, nacionalidad, equipo_id) VALUES
('Charles', 'Leclerc', 'Monegasco', 1),
('Sebastian', 'Vettel', 'Alemán', 1),
('Lewis', 'Hamilton', 'Británico', 2),
('Valtteri', 'Bottas', 'Finlandés', 2),
('Max', 'Verstappen', 'Holandés', 3),
('Sergio', 'Pérez', 'Mexicano', 3),
('Lando', 'Norris', 'Británico', 4),
('Daniel', 'Ricciardo', 'Australiano', 4),
('Fernando', 'Alonso', 'Español', 5),
('Esteban', 'Ocon', 'Francés', 5),
('Kimi', 'Räikkönen', 'Finlandés', 6),
('Antonio', 'Giovinazzi', 'Italiano', 6),
('Nicholas', 'Latifi', 'Canadiense', 7),
('Mick', 'Schumacher', 'Alemán', 8),
('Pierre', 'Gasly', 'Francés', 9),
('Nicholas', 'Latifi', 'Canadiense', 10);

INSERT INTO carreras (nombre, fecha, pais) VALUES
('Gran Premio de Australia', '2024-03-24', 'Australia'),
('Gran Premio de Bahréin', '2024-03-03', 'Bahréin'),
('Gran Premio de España', '2024-05-12', 'España'),
('Gran Premio de Mónaco', '2024-05-26', 'Mónaco'),
('Gran Premio de Italia', '2024-09-08', 'Italia'),
('Gran Premio de Gran Bretaña', '2024-07-07', 'Reino Unido');

INSERT INTO resultados (carrera_id, piloto_id, posicion, tiempo) VALUES
(1, 1, 1, '1:24.45'),
(1, 2, 2, '1:25.23'),
(1, 3, 3, '1:25.47'),
(1, 4, 4, '1:25.92'),
(2, 1, 2, '1:31.12'),
(2, 3, 1, '1:30.21'),
(2, 5, 4, '1:31.79'),
(3, 6, 1, '1:26.52'),
(3, 9, 2, '1:27.21'),
(4, 7, 3, '1:28.77'),
(4, 8, 1, '1:30.09'),
(5, 10, 3, '1:31.64'),
(5, 4, 1, '1:32.11');

INSERT INTO estadisticas (piloto_id, total_puntos, podios) VALUES
(1, 350, 15),
(2, 280, 10),
(3, 400, 20),
(4, 250, 8),
(5, 320, 12),
(6, 230, 6),
(7, 210, 5),
(8, 190, 4),
(9, 150, 3),
(10, 100, 2),
(11, 130, 3),
(12, 90, 1),
(13, 80, 2),
(14, 70, 1),
(15, 50, 0),
(16, 40, 0);
