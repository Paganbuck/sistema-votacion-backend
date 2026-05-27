-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-05-2026 a las 06:03:46
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `votacion_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `candidato`
--

CREATE TABLE `candidato` (
  `id` bigint(20) NOT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `partido_politico` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `candidato`
--

INSERT INTO `candidato` (`id`, `foto_url`, `nombre`, `partido_politico`) VALUES
(4, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80&crop=faces', 'Juan Pérez', 'ALIANZA TECNOLÓGICA'),
(5, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80&crop=faces', 'Luz Monsalve', 'INNOVACIÓN DIGITAL'),
(6, 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500&auto=format&fit=crop&q=80', 'Voto en Blanco', 'Elección Ciudadana'),
(7, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80&crop=faces', 'Diego Bedoya', 'MOVIMIENTO CODE'),
(8, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80&crop=faces', 'Alan Poe', 'Hell Tech');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `urna_votos`
--

CREATE TABLE `urna_votos` (
  `id` bigint(20) NOT NULL,
  `candidato_id` bigint(20) NOT NULL,
  `direccion_ip` varchar(255) NOT NULL,
  `hash_verificacion` varchar(128) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `user_agent` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `urna_votos`
--

INSERT INTO `urna_votos` (`id`, `candidato_id`, `direccion_ip`, `hash_verificacion`, `timestamp`, `user_agent`) VALUES
(1, 1, '192.168.1.50', '690146ef240a761be2593b9e026245abf4df4b9293a1f252dd42720f21d14252b04b58c385931c00228674ce2fd61db4b9918fb0527b50efa7a3c5c76479969e', '2026-05-27 00:57:54.000000', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0.0.0'),
(2, 7, '0:0:0:0:0:0:0:1', '134966e9c322f52dbc0b784e26b2da6cfd79c0b87cf3b75095a55165e10015f6d14186d962fb2007dc45a5b4bc898c955ce2c76ed0d4866a47179059fe521ca6', '2026-05-27 02:55:42.000000', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),
(3, 5, '0:0:0:0:0:0:0:1', '7e706ccbff10da95fc3e45bdcd502f7177e77359bba4ab2c62f3a4958452ecf89e8691774cfa02afce68129d6a2c79f989b859357ab34a60e4a73850819dc19f', '2026-05-27 02:59:35.000000', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),
(4, 7, '0:0:0:0:0:0:0:1', '09556eafb1a9b7b17b27d4f27aee134ad5a3ae2224009711ec03ef0b72fa2bc094a54f1d33a8a680394a7b2b5a677e9edc33b6ce912257cd68d2ee842ba82160', '2026-05-27 02:59:47.000000', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),
(5, 6, '0:0:0:0:0:0:0:1', '76c41b676f82cf22423c26b6f4ee0a6b9758a9211b7a9b280c15050dc164edb84fb215b48b2c2d1b0724587342a580a03b11fedfd3f61673612c753a9f15b991', '2026-05-27 03:58:29.000000', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votante_registrado`
--

CREATE TABLE `votante_registrado` (
  `documento` varchar(255) NOT NULL,
  `fecha_voto` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `votante_registrado`
--

INSERT INTO `votante_registrado` (`documento`, `fecha_voto`) VALUES
('1020304050', '2026-05-27 00:57:54.000000'),
('1236547', '2026-05-27 02:59:47.000000'),
('145782', '2026-05-27 02:55:42.000000'),
('256487', '2026-05-27 02:59:35.000000'),
('784523', '2026-05-27 03:58:29.000000');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `candidato`
--
ALTER TABLE `candidato`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `urna_votos`
--
ALTER TABLE `urna_votos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `votante_registrado`
--
ALTER TABLE `votante_registrado`
  ADD PRIMARY KEY (`documento`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `candidato`
--
ALTER TABLE `candidato`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `urna_votos`
--
ALTER TABLE `urna_votos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
