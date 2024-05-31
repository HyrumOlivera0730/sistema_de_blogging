-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2024 at 04:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sistema_de_blogging`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Italiana', '2024-05-27 16:57:38', '2024-05-27 16:57:38'),
(2, 'Saludable', '2024-05-27 16:57:38', '2024-05-27 16:57:38'),
(3, 'India', '2024-05-27 16:57:38', '2024-05-27 16:57:38'),
(4, 'Mexicana', '2024-05-27 16:57:38', '2024-05-27 16:57:38'),
(5, 'Japonesa', '2024-05-27 16:57:38', '2024-05-27 16:57:38');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `user_id`, `content`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '¡Me encanta esta receta de Carbonara! ¿Puedo usar panceta en lugar de guanciale?', '2024-05-27 16:58:02', '2024-05-27 16:58:02'),
(2, 1, 3, '¿Cuánto tiempo se debe cocinar la pasta para que quede al dente?', '2024-05-27 16:58:02', '2024-05-27 16:58:02'),
(3, 2, 1, 'La ensalada César es mi favorita, ¿puedo agregar pollo?', '2024-05-27 16:58:02', '2024-05-27 16:58:02'),
(4, 2, 4, '¿Qué tipo de lechuga recomiendas usar?', '2024-05-27 16:58:02', '2024-05-27 16:58:02'),
(5, 3, 1, 'El pollo al curry quedó increíble, gracias por la receta.', '2024-05-27 16:58:02', '2024-05-27 16:58:02'),
(6, 3, 2, '¿Puedo usar leche de coco en lugar de crema?', '2024-05-27 16:58:02', '2024-05-27 16:58:02'),
(7, 4, 1, '¡Estos tacos son los mejores que he probado!', '2024-05-27 16:58:02', '2024-05-27 16:58:02'),
(8, 4, 3, '¿Qué tipo de tortillas usaste para esta receta?', '2024-05-27 16:58:02', '2024-05-27 16:58:02'),
(9, 5, 4, 'El sushi salió perfecto, gracias por los consejos.', '2024-05-27 16:58:02', '2024-05-27 16:58:02'),
(10, 5, 1, '¿Alguna recomendación para el tipo de arroz que debo usar?', '2024-05-27 16:58:02', '2024-05-27 16:58:02');

-- --------------------------------------------------------

--
-- Table structure for table `postcategories`
--

CREATE TABLE `postcategories` (
  `post_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `postcategories`
--

INSERT INTO `postcategories` (`post_id`, `category_id`) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 2),
(3, 3),
(4, 2),
(4, 4),
(5, 2),
(5, 5);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `title`, `content`, `created_at`, `updated_at`, `image`) VALUES
(1, 1, 'Receta de Spaghetti Carbonara', 'Una receta clásica italiana para spaghetti carbonara.', '2024-05-27 16:56:43', '2024-05-27 17:23:24', 'spaghetti_carbonara.jpg'),
(2, 2, 'Receta de Ensalada César', 'Una receta fresca y saludable para una ensalada César.', '2024-05-27 16:56:43', '2024-05-27 17:23:24', 'ensalada_cesar.jpg'),
(3, 3, 'Receta de Pollo al Curry', 'Delicioso pollo al curry con especias y arroz.', '2024-05-27 16:56:43', '2024-05-27 17:23:25', 'pollo_curry.jpg'),
(4, 4, 'Receta de Tacos Mexicanos', 'Tacos auténticos con carne auténtica, cilantro y cebolla.', '2024-05-27 16:56:43', '2024-05-29 00:10:57', '1716941457679-tacos.webp'),
(5, 5, 'Receta de Sushi', 'Cómo preparar sushi en casa, paso a paso.', '2024-05-27 16:56:43', '2024-05-27 17:23:25', 'sushi.jpg'),
(6, 1, 'Arroz Rico', 'En menos de 3 minutos! con solo 2 ingredientes!', '2024-05-28 19:26:05', '2024-05-28 19:58:40', '1716924365221-arrozRico.jpg'),
(8, 6, 'Arroz sin agua', 'Esta receta se hizo en el desierto de sahara! Tienes que verlo!', '2024-05-28 23:45:16', '2024-05-28 23:45:16', '1716939916853-arrozSeco.png');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `photoUser` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `updated_at`, `photoUser`) VALUES
(1, 'ratatui', 'ratatui@example.com', 'password1', 'user', '2024-05-27 16:56:12', '2024-05-27 17:31:21', 'ratatui.jpg'),
(2, 'gordonRaunsy', 'gordonRaunsy@gmail.com', 'fueraDeMiCocina123', 'user', '2024-05-27 16:56:12', '2024-05-28 17:22:45', '1716916965512-gordonRaunsy.png'),
(3, 'quemaArrozes3000', 'quemaArrozes3000@example.com', 'password3', 'user', '2024-05-27 16:56:12', '2024-05-27 17:32:22', 'quemaArrozes3000.jpg'),
(4, 'elTerrorDeLosPollos', 'elTerrorDeLosPollos@example.com', 'password4', 'user', '2024-05-27 16:56:12', '2024-05-27 17:32:39', 'elTerrorDeLosPollos.jpg'),
(5, 'manosMilagrosas', 'manosMilagrosas@example.com', 'password5', 'admin', '2024-05-27 16:56:12', '2024-05-27 17:32:57', 'manosMilagrosas.jpg'),
(6, 'tiaVeneno', 'tiaveneno_yatusabe@example.com', 'yucasycamotes123', 'user', '2024-05-28 17:11:18', '2024-05-28 17:11:18', '1716916277827-tiaVeneno.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `postcategories`
--
ALTER TABLE `postcategories`
  ADD PRIMARY KEY (`post_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `postcategories`
--
ALTER TABLE `postcategories`
  ADD CONSTRAINT `postcategories_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `postcategories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
