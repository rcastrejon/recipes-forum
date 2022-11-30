-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 29, 2022 at 11:14 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `recipe_forum`
--

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `has_user_liked_recipe` (`in_user_id` CHAR(36) CHARSET utf8mb4, `in_recipe_id` CHAR(36) CHARSET utf8mb4) RETURNS TINYINT(1) READS SQL DATA RETURN (
        EXISTS (SELECT `like`.id FROM `like`WHERE `like`.user_id = in_user_id AND `like`.recipe_id = in_recipe_id
    ))$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `get_users`
-- (See below for the actual view)
--
CREATE TABLE `get_users` (
`id` char(36)
,`username` varchar(15)
,`display_name` varchar(50)
,`recipe_count` int(11)
,`likes_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `like`
--

CREATE TABLE `like` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `recipe_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `recipe`
--

CREATE TABLE `recipe` (
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `id` char(36) NOT NULL,
  `title` varchar(75) NOT NULL,
  `content_md` longtext NOT NULL,
  `content_html` longtext NOT NULL,
  `thumbnail` longblob NOT NULL,
  `thumbnail_media_type` varchar(50) NOT NULL,
  `created_by_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Triggers `recipe`
--
DELIMITER $$
CREATE TRIGGER `create_recipe` AFTER INSERT ON `recipe` FOR EACH ROW UPDATE `user` SET recipe_count=recipe_count+1 WHERE `user`.id = NEW.created_by_id
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `delete_recipe` AFTER DELETE ON `recipe` FOR EACH ROW UPDATE `user` SET recipe_count=recipe_count-1 WHERE `user`.id = OLD.created_by_id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `id` char(36) NOT NULL,
  `username` varchar(15) NOT NULL,
  `display_name` varchar(50) DEFAULT NULL,
  `password_hash` varchar(60) NOT NULL,
  `recipe_count` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure for view `get_users`
--
DROP TABLE IF EXISTS `get_users`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `get_users`  AS SELECT `u`.`id` AS `id`, `u`.`username` AS `username`, `u`.`display_name` AS `display_name`, `u`.`recipe_count` AS `recipe_count`, count(`l`.`id`) AS `likes_count` FROM (`user` `u` left join `like` `l` on(`l`.`user_id` = `u`.`id`)) GROUP BY `u`.`id`;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `like`
--
ALTER TABLE `like`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid_like_user_id_763278` (`user_id`,`recipe_id`),
  ADD KEY `fk_like_recipe_26d4ecbb` (`recipe_id`);

--
-- Indexes for table `recipe`
--
ALTER TABLE `recipe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_recipe_user_fae00100` (`created_by_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `like`
--
ALTER TABLE `like`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `like`
--
ALTER TABLE `like`
  ADD CONSTRAINT `fk_like_recipe_26d4ecbb` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_like_user_e8643edc` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipe`
--
ALTER TABLE `recipe`
  ADD CONSTRAINT `fk_recipe_user_fae00100` FOREIGN KEY (`created_by_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
