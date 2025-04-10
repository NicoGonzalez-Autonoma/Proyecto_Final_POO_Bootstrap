-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-02-2025 a las 17:05:33
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
-- Base de datos: `agenda`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `name`, `email`, `password`, `imagen`) VALUES
(12, 'Nicolás González', 'nico@gmail.com', '123', NULL),
(13, 'asafsafsd', 'zantiago.zaza09@gmail.com', '$2y$10$2slE3I0lR9pyfgD9mdxuZO0sDbQxdRl6wG8xp4wLlf2gzgOoQHb7G', NULL),
(14, 'Santiago', 'santiago@gmail.com', '$2y$10$n4ase.nxj0NQ9gDhFFe0rOyXKe06GF11yRMRDqwa6V4uE5.rUOoIC', NULL),
(15, 'william', 'x@gmail.com', '$2y$10$36qheO25qEqwaHvZLEfZCe1SIVV/GcJB.YULkuJcGYpiGC/4S.uL6', NULL),
(16, 'jair', 'a@gmail.com', '$2y$10$JGja4Mjgy83IBYvXARqgt.0Kj2zrsaPKMFnUPvUiY5Jfj76xnv1Gu', NULL),
(17, 'william', 'e@gmail.com', '$2y$10$/PSj4kZPzfIh7pPlPl7pROMiv/5pW0DXpcBDjikE/j0At0EqWmBm2', NULL),
(18, 'Santiaga', 'b@gmail.com', '$2y$10$sdzq525.VRolV5znxyAETOicBUBmh3GsrBGS6.w9ImQP/LbzbTmR6', NULL),
(19, 'Yhojan', 'y@gmail.com', '$2y$10$.rIjAt5iRVqTwbtGAHn4m.DIqn1IJeHXZqGMd0inWSw6U/2TMpkeC', NULL),
(20, 'santiago', 's@gmail.com', '$2y$10$YuCWpVxhkxNfrOH4YZovXue1DgEVy/.TtbkS4JEtTqgVPjMmfS9Ti', NULL),
(21, 'Nico', 'nicolas.gonzalezg@autonoma.edu.co', '$2y$10$La8ENkVEfoVAhpjWoXvTbeT6haW8FjRlQ9g6sxeXaK5mZY6JbMOUe', NULL),
(22, 'Nico', 'nico2@gmail.com', '$2y$10$BgoSL1IzRXRTod6LUQzPZuDm4Ka34.hUUW2d9.OfDucITNJZZoeau', NULL),
(23, 'Nico', 'nicoo@gmail.com', '$2y$10$GG5jZ..7qzFI/YHA6uO/0On3rEvEefK40cGujc1cn/j1ZNfOj7RI6', NULL),
(24, 'Nico', 'nicooo@gmail.com', '$2y$10$iSGSFNDZAN9TgkCypT6/meHbR9Qjbcgh51Yxw878icGREIfu1jil6', NULL),
(25, 'Nico', 'nicoooo@gmail.com', '$2y$10$s3SZaxgYF3vpij.8dxCrjeGzXEvseeMMvnz6GdpKjorC8QHUBrll2', NULL),
(26, 'steven', '8scg48@gmail.com', '$2y$10$FKHrx9AVNLnvlDjGTZdFW.gp8RJzlEoLIAj84Ppfe2xW1.7t0vMTy', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
