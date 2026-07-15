-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 07, 2026 at 03:46 AM
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
-- Database: `primeitc_ictmeetup_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_sections`
--

CREATE TABLE `about_sections` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `image_path` text DEFAULT NULL,
  `flagship_event_version_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `access_tokens`
--

CREATE TABLE `access_tokens` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `token` varchar(500) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `userId` varchar(36) NOT NULL,
  `ipAddress` varchar(255) NOT NULL,
  `userAgent` varchar(255) NOT NULL,
  `isRevoked` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `asset_library_id` varchar(36) NOT NULL,
  `image_path` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `display_order` int(11) NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `asset_library`
--

CREATE TABLE `asset_library` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `source_table` enum('hero_sections','gallery_items','achievement_metrics','speakers','team_members') NOT NULL,
  `source_table_id` varchar(36) NOT NULL,
  `max_image_upload` int(11) NOT NULL DEFAULT 1,
  `flagship_event_version_id` varchar(36) NOT NULL,
  `extra_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra_options`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `logType` enum('info','error') NOT NULL,
  `userId` varchar(36) DEFAULT NULL,
  `logActionType` enum('login','logout','create','update','delete','view','refresh') NOT NULL,
  `message` text NOT NULL,
  `versionId` varchar(36) DEFAULT NULL,
  `scope` enum('flagship_event','events','event_speakers','sponsors','event_registrations','hero_sections','achievement_metrics','about_sections','speakers','gallery_items','team_members','version_settings','users','faq') NOT NULL,
  `ipAddress` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `type` enum('team_members','designations','events','speakers','sponsors') NOT NULL,
  `name` varchar(100) NOT NULL,
  `displayName` varchar(100) NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `trackingId` varchar(150) NOT NULL,
  `title` varchar(150) NOT NULL,
  `subtitle` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `date` date DEFAULT NULL,
  `category_id` varchar(36) NOT NULL,
  `version_id` varchar(36) NOT NULL,
  `speaker_id` varchar(36) DEFAULT NULL,
  `total_seats` int(11) NOT NULL DEFAULT 0,
  `fee_type` enum('free','paid') NOT NULL,
  `fee` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `status` enum('draft','published','archived') NOT NULL,
  `registration_deadline` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_highlighted` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_registration`
--

CREATE TABLE `event_registration` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `username` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contactNumber` varchar(150) NOT NULL,
  `isStudent` tinyint(4) NOT NULL,
  `educationLevel` varchar(150) DEFAULT NULL,
  `faculty` varchar(150) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `attachedPaymentScreenshot` varchar(150) NOT NULL,
  `eventId` varchar(150) NOT NULL,
  `versionId` varchar(150) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `event_id` varchar(36) DEFAULT NULL,
  `version_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `flagship_event_version_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `flagship_event_versions`
--

CREATE TABLE `flagship_event_versions` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `version_name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `version_number` decimal(3,1) NOT NULL,
  `status` enum('draft','active','archived') NOT NULL DEFAULT 'draft',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_current` tinyint(4) NOT NULL DEFAULT 0,
  `logo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_images`
--

CREATE TABLE `gallery_images` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `imagePath` varchar(255) NOT NULL,
  `cloudImageUrl` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `flagship_event_version_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_sections`
--

CREATE TABLE `hero_sections` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `heading` text DEFAULT NULL,
  `paragraph` text DEFAULT NULL,
  `flagship_event_version_id` varchar(36) NOT NULL,
  `extra_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra_options`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `token` varchar(500) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `userId` varchar(36) NOT NULL,
  `ipAddress` varchar(255) NOT NULL,
  `userAgent` varchar(255) NOT NULL,
  `isRevoked` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `speakers`
--

CREATE TABLE `speakers` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `designation` varchar(150) NOT NULL,
  `company` varchar(150) DEFAULT NULL,
  `version_id` varchar(36) NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `socialLinks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`socialLinks`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sponsors`
--

CREATE TABLE `sponsors` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `version_id` varchar(255) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `name` varchar(150) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `category_id` varchar(36) NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `version_id` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `name` varchar(150) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 1,
  `designation_id` varchar(255) NOT NULL,
  `socialLinks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`socialLinks`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_sections`
--
ALTER TABLE `about_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_c518a56bc1312b86a77e8e2c8b` (`id`),
  ADD KEY `IDX_cda8ea32856f5e97206462d8a6` (`createdAt`),
  ADD KEY `IDX_9c041c5e3a973443d1a4d26d8d` (`updatedAt`),
  ADD KEY `IDX_f2bc0c7b791530383185fa16e1` (`flagship_event_version_id`);

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
  ADD KEY `IDX_9c4e4a89e3674fc9f382d733f0` (`id`),
  ADD KEY `IDX_c15e0393f5bebfb602fb077897` (`createdAt`),
  ADD KEY `IDX_a7f046d46350d4bc4aa0f7c113` (`updatedAt`),
  ADD KEY `IDX_63ad76a14a8321d22dc0a5e704` (`type`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_a0f024b99b1491a03fc421858e` (`id`),
  ADD KEY `IDX_fc6fd6701d8885218202a9e643` (`createdAt`),
  ADD KEY `IDX_b44bee1e0a4d666e4641f3aac7` (`updatedAt`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_40731c7151fe4be3116e45ddf7` (`id`),
  ADD KEY `IDX_3911711b8afdd783fe98b7f979` (`createdAt`),
  ADD KEY `IDX_caad021bd1f4161811a0d30b23` (`updatedAt`),
  ADD KEY `FK_643188b30e049632f80367be4e1` (`category_id`),
  ADD KEY `FK_58145e5ce743859cc1e01cc8db8` (`version_id`),
  ADD KEY `FK_815f74eeebec35f9c0ab96eb148` (`speaker_id`);

--
-- Indexes for table `event_registration`
--
ALTER TABLE `event_registration`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_10aedff1bd0d0ef534d1106dde` (`id`),
  ADD KEY `IDX_aae0bae45f514446629acfdc87` (`createdAt`),
  ADD KEY `IDX_0a7d2e726b86b75bcfcb1ebb2e` (`updatedAt`),
  ADD KEY `FK_d42836e8ed00e2586af913934a6` (`event_id`),
  ADD KEY `FK_dd19c9aee647b85117cd6b14ac1` (`version_id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_2ddf4f2c910f8e8fa2663a67bf` (`id`),
  ADD KEY `IDX_c2f253ed34996b12cf17d261a0` (`createdAt`),
  ADD KEY `IDX_7942066d9cd48db51a5eda4ff2` (`updatedAt`),
  ADD KEY `IDX_08afb9a6481ba19d5ff82c1754` (`flagship_event_version_id`);

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
-- Indexes for table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_9b1601c4bdad7456bb12636dd1` (`id`),
  ADD KEY `IDX_615d8de46b8d60334ccb52d492` (`createdAt`),
  ADD KEY `IDX_a5691ced91ee4659fe405c05c7` (`updatedAt`),
  ADD KEY `IDX_0d9b24dcbc361b0613e3cbf35c` (`flagship_event_version_id`);

--
-- Indexes for table `hero_sections`
--
ALTER TABLE `hero_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_452d119271f3b1d7701c4da9c5` (`id`),
  ADD KEY `IDX_dc15a152efe96567b9f0e00a22` (`createdAt`),
  ADD KEY `IDX_dc5f3ddfaa0c06390ce53bde9e` (`updatedAt`),
  ADD KEY `IDX_6cce9bbd2662cf132bb5fd719b` (`flagship_event_version_id`);

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
-- Indexes for table `speakers`
--
ALTER TABLE `speakers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_b3818c94af77a0cf73403ecef1` (`id`),
  ADD KEY `IDX_c656f4e6a243454e48f984d3ec` (`createdAt`),
  ADD KEY `IDX_0d0a22e3dc32827e1bf388a8cf` (`updatedAt`),
  ADD KEY `FK_0e21b8c3902f3487632401239db` (`version_id`);

--
-- Indexes for table `sponsors`
--
ALTER TABLE `sponsors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_6d1114fe7e65855154351b66bf` (`id`),
  ADD KEY `IDX_1cfb1135a6f8f65abe9071645e` (`createdAt`),
  ADD KEY `IDX_fe307023f398ebc3128a121a4a` (`updatedAt`),
  ADD KEY `IDX_675fa02095fef93fe312fd575d` (`version_id`),
  ADD KEY `IDX_87cd36c0a72271648acaf04ad7` (`category_id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_ca3eae89dcf20c9fd95bf7460a` (`id`),
  ADD KEY `IDX_33692aeb17710f5c6c8d58ee73` (`createdAt`),
  ADD KEY `IDX_b652f5b22b5487f4f1f1f9fbde` (`updatedAt`),
  ADD KEY `IDX_b075a04749a5969dfa73f8e4db` (`version_id`),
  ADD KEY `IDX_80c1bc4ded05bd07883fffb30c` (`category_id`),
  ADD KEY `IDX_369d86343d1e0db80fb9ac9788` (`designation_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `about_sections`
--
ALTER TABLE `about_sections`
  ADD CONSTRAINT `FK_f2bc0c7b791530383185fa16e12` FOREIGN KEY (`flagship_event_version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `access_tokens`
--
ALTER TABLE `access_tokens`
  ADD CONSTRAINT `FK_343a101d109c86071f2b2fb43e7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `assets`
--
ALTER TABLE `assets`
  ADD CONSTRAINT `FK_9061d55e0afb8aa37ce5f0e9eb1` FOREIGN KEY (`asset_library_id`) REFERENCES `asset_library` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `asset_library`
--
ALTER TABLE `asset_library`
  ADD CONSTRAINT `FK_39f849765556da15fba70e045b6` FOREIGN KEY (`flagship_event_version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `FK_58145e5ce743859cc1e01cc8db8` FOREIGN KEY (`version_id`) REFERENCES `flagship_event_versions` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_643188b30e049632f80367be4e1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_815f74eeebec35f9c0ab96eb148` FOREIGN KEY (`speaker_id`) REFERENCES `speakers` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `event_registration`
--
ALTER TABLE `event_registration`
  ADD CONSTRAINT `FK_d42836e8ed00e2586af913934a6` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_dd19c9aee647b85117cd6b14ac1` FOREIGN KEY (`version_id`) REFERENCES `flagship_event_versions` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `faqs`
--
ALTER TABLE `faqs`
  ADD CONSTRAINT `FK_08afb9a6481ba19d5ff82c17546` FOREIGN KEY (`flagship_event_version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD CONSTRAINT `FK_0d9b24dcbc361b0613e3cbf35c0` FOREIGN KEY (`flagship_event_version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `hero_sections`
--
ALTER TABLE `hero_sections`
  ADD CONSTRAINT `FK_6cce9bbd2662cf132bb5fd719be` FOREIGN KEY (`flagship_event_version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `FK_610102b60fea1455310ccd299de` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `speakers`
--
ALTER TABLE `speakers`
  ADD CONSTRAINT `FK_0e21b8c3902f3487632401239db` FOREIGN KEY (`version_id`) REFERENCES `flagship_event_versions` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `sponsors`
--
ALTER TABLE `sponsors`
  ADD CONSTRAINT `FK_675fa02095fef93fe312fd575db` FOREIGN KEY (`version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_87cd36c0a72271648acaf04ad73` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `FK_369d86343d1e0db80fb9ac9788a` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_80c1bc4ded05bd07883fffb30c7` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_b075a04749a5969dfa73f8e4db8` FOREIGN KEY (`version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
