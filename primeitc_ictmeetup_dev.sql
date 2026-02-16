-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 14, 2026 at 07:43 AM
-- Server version: 8.0.45-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `primeitc_ictmeetup_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `access_tokens`
--

CREATE TABLE `access_tokens` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `token` varchar(500) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `userId` varchar(36) NOT NULL,
  `ipAddress` varchar(255) NOT NULL,
  `userAgent` varchar(255) NOT NULL,
  `isRevoked` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `asset_library_id` varchar(36) NOT NULL,
  `image_path` text,
  `image_url` text,
  `display_order` int NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `asset_library`
--

CREATE TABLE `asset_library` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `flagship_event_version_id` varchar(36) NOT NULL,
  `source_table` enum('hero_sections','gallery_items','achievement_metrics','speakers','team_members') NOT NULL,
  `source_table_id` varchar(36) NOT NULL,
  `max_image_upload` int NOT NULL DEFAULT '1',
  `extra_options` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `logType` enum('info','error') NOT NULL,
  `userId` varchar(36) DEFAULT NULL,
  `logActionType` enum('login','logout','create','update','delete','view') NOT NULL,
  `message` text NOT NULL,
  `versionId` varchar(36) DEFAULT NULL,
  `scope` enum('events','event_speakers','sponsors','event_registrations','hero_sections','achievement_metrics','about_sections','speakers','gallery_items','team_members','version_settings','users') NOT NULL,
  `ipAddress` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` varchar(36) NOT NULL,
  `type` enum('teams','sponsors') NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `flagship_event_versions`
--

CREATE TABLE `flagship_event_versions` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `version_name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `version_number` decimal(3,1) NOT NULL,
  `status` enum('draft','active','archived') NOT NULL DEFAULT 'draft',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_current` tinyint NOT NULL DEFAULT '0',
  `modifiedById` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flagship_event_versions`
--

INSERT INTO `flagship_event_versions` (`id`, `createdAt`, `updatedAt`, `createdById`, `version_name`, `slug`, `version_number`, `status`, `start_date`, `end_date`, `is_current`, `modifiedById`) VALUES
('03dbda95-dc51-4335-be4c-fe2730b5889f', '2026-02-09 21:19:32.157912', '2026-02-09 21:19:32.157912', NULL, 'string', 'string', 0.0, 'draft', '2026-02-01', '2026-02-09', 0, NULL),
('9065e0cf-73ab-4107-a39d-843e159d23c1', '2026-02-09 21:29:07.564906', '2026-02-09 21:29:07.564906', NULL, 'st1rrring', 'strrin1g', 1.7, 'draft', '2026-02-03', '2026-02-09', 0, NULL),
('a20e1639-119e-4a91-bd70-5e1b4962dd18', '2026-02-09 21:20:33.766117', '2026-02-09 21:20:33.766117', NULL, 'string', 'string-tyttt', 1.9, 'draft', '2026-02-01', '2026-02-09', 0, NULL),
('e75d9e1d-e451-49c1-ae25-e8c262503ca0', '2026-02-09 21:28:57.342928', '2026-02-09 21:28:57.342928', NULL, 'strrring', 'strring', 0.7, 'draft', '2026-02-03', '2026-02-09', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int NOT NULL,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1, 1768837673879, 'Change1768837673879'),
(2, 1770942791462, 'Change1770942791462');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `token` varchar(500) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `userId` varchar(36) NOT NULL,
  `ipAddress` varchar(255) NOT NULL,
  `userAgent` varchar(255) NOT NULL,
  `isRevoked` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` varchar(36) NOT NULL,
  `version_id` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `name` varchar(150) NOT NULL,
  `designation` varchar(150) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `socialLinks` json DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `name`, `email`, `password`, `role`) VALUES
('3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '2026-02-09 20:21:58.814429', '2026-02-09 20:21:58.814429', NULL, NULL, 'creativehubadmin', 'creativehub@ictmeetup.com', '$2b$10$Ugv7VIOkdjTAomV9QfyWHeosNGBFgchr72gkRuYjBjo5ACKm.PEeS', 'superadmin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `access_tokens`
--
ALTER TABLE `access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_65140f59763ff994a025248816` (`id`),
  ADD KEY `IDX_5d3af83194b55902673d1ab4b0` (`createdAt`),
  ADD KEY `IDX_0080f5688addb538bc56a588de` (`updatedAt`),
  ADD KEY `IDX_9f8f44257355360846bb3826ed` (`token`),
  ADD KEY `IDX_a7c8422e92d72d1f7e6bb52fac` (`expiresAt`),
  ADD KEY `IDX_343a101d109c86071f2b2fb43e` (`userId`),
  ADD KEY `IDX_2c122ae0a047aa34ea08beac10` (`ipAddress`),
  ADD KEY `IDX_342f943d4fb05ea15ccc599830` (`userAgent`);

--
-- Indexes for table `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_1fedb3ea80ebd5bda18f860b03` (`asset_library_id`,`display_order`),
  ADD KEY `IDX_da96729a8b113377cfb6a62439` (`id`),
  ADD KEY `IDX_e558151673e87411258fca0963` (`createdAt`),
  ADD KEY `IDX_cb5593a8c4e610e39fb58bd2c3` (`updatedAt`);

--
-- Indexes for table `asset_library`
--
ALTER TABLE `asset_library`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_ec62d2614000b05784cb52f0c9` (`source_table`,`source_table_id`),
  ADD KEY `IDX_5ecdc9f04c673d6775463dbbc6` (`id`),
  ADD KEY `IDX_484075569f9c4822aafdbb879c` (`createdAt`),
  ADD KEY `IDX_f7d2257c952bdd63c660953b36` (`updatedAt`),
  ADD KEY `FK_39f849765556da15fba70e045b6` (`flagship_event_version_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_1bb179d048bbc581caa3b01343` (`id`),
  ADD KEY `IDX_c69efb19bf127c97e6740ad530` (`createdAt`),
  ADD KEY `IDX_af306d9d6517c0cba697947736` (`updatedAt`),
  ADD KEY `IDX_c58692b4a15571579b460fcd9b` (`logType`),
  ADD KEY `IDX_cfa83f61e4d27a87fcae1e025a` (`userId`),
  ADD KEY `IDX_4fde0e732f1996ff21318ab2aa` (`logActionType`),
  ADD KEY `IDX_a4c3508bb113b8167cd6057e37` (`scope`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_63ad76a14a8321d22dc0a5e704` (`type`);

--
-- Indexes for table `flagship_event_versions`
--
ALTER TABLE `flagship_event_versions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_b1042e331f059b5a4b957d2345` (`slug`),
  ADD KEY `IDX_b8bfa0cbe9ad1728413010028f` (`id`),
  ADD KEY `IDX_9250aff79735533258f286167e` (`createdAt`),
  ADD KEY `IDX_b8dca07d23afa7980d787d1f37` (`updatedAt`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_7d8bee0204106019488c4c50ff` (`id`),
  ADD KEY `IDX_98c0562c3afc78514a32f56045` (`createdAt`),
  ADD KEY `IDX_128d39388b2d6cbeb68585d520` (`updatedAt`),
  ADD KEY `IDX_610102b60fea1455310ccd299d` (`userId`),
  ADD KEY `IDX_04b3548499bb504689176c8849` (`ipAddress`),
  ADD KEY `IDX_90781acb0a5b9b32658b656c41` (`userAgent`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_b075a04749a5969dfa73f8e4db` (`version_id`),
  ADD KEY `IDX_80c1bc4ded05bd07883fffb30c` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  ADD KEY `IDX_a3ffb1c0c8416b9fc6f907b743` (`id`),
  ADD KEY `IDX_204e9b624861ff4a5b26819210` (`createdAt`),
  ADD KEY `IDX_0f5cbe00928ba4489cc7312573` (`updatedAt`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `access_tokens`
--
ALTER TABLE `access_tokens`
  ADD CONSTRAINT `FK_343a101d109c86071f2b2fb43e7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `assets`
--
ALTER TABLE `assets`
  ADD CONSTRAINT `FK_9061d55e0afb8aa37ce5f0e9eb1` FOREIGN KEY (`asset_library_id`) REFERENCES `asset_library` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `asset_library`
--
ALTER TABLE `asset_library`
  ADD CONSTRAINT `FK_39f849765556da15fba70e045b6` FOREIGN KEY (`flagship_event_version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `FK_610102b60fea1455310ccd299de` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `FK_80c1bc4ded05bd07883fffb30c7` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `FK_b075a04749a5969dfa73f8e4db8` FOREIGN KEY (`version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
