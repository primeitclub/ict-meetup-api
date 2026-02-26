-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 25, 2026 at 03:12 PM
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
-- Table structure for table `about_sections`
--

CREATE TABLE `about_sections` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `flagship_event_version_id` varchar(36) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `image_url` text,
  `image_path` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

--
-- Dumping data for table `access_tokens`
--

INSERT INTO `access_tokens` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `token`, `expiresAt`, `userId`, `ipAddress`, `userAgent`, `isRevoked`) VALUES
('00d86c20-bfea-46da-8c3b-ab1550097848', '2026-02-18 21:51:31.698647', '2026-02-18 21:51:31.698647', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDc5MSwiZXhwIjoxNzcxNDMxNjkxfQ.JRtWdFUs_VPCWyX7Vf59DXi350ZOvlezH6wePFlkI7Y', '2026-02-18 22:06:32', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('05ca0dfd-a602-4764-a251-26d452e7c672', '2026-02-18 21:48:06.484197', '2026-02-18 21:48:06.484197', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDU4NiwiZXhwIjoxNzcxNDMxNDg2fQ.V77kDerXG_UN64yzSdpVqxm1Y1yGaj4hrruxP1qe0Is', '2026-02-18 22:03:06', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('0c5be477-0713-4e74-9072-ac1da83d3062', '2026-02-19 07:12:02.903351', '2026-02-19 07:12:02.903351', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDQyMiwiZXhwIjoxNzcxNDY1MzIyfQ.ogIbGW0OZ3Ac9yXQvfH2vNSZZqKsimhwZbuUTNU8fJk', '2026-02-19 07:27:03', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('0d9409fd-2a3a-442f-8b47-543a5c7432db', '2026-02-18 21:45:16.921277', '2026-02-18 21:45:16.921277', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDQxNiwiZXhwIjoxNzcxNDMxMzE2fQ.AB-eddElJFng6vWGKHfYggEMyibF4PhHqIzUaK-2P0Y', '2026-02-18 22:00:17', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('12f5b5df-fc82-407d-9a89-40d3142cb214', '2026-02-18 21:56:45.641654', '2026-02-18 21:56:45.641654', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMTEwNSwiZXhwIjoxNzcxNDMyMDA1fQ.ihQOC_SwZ1iBOvrbsL0hthpOl62QP3C1DQ5afAjr_mU', '2026-02-18 22:11:46', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('1613afe1-92df-4a87-a9f8-ff9f333dbf03', '2026-02-19 07:17:34.351708', '2026-02-19 07:17:34.351708', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDc1NCwiZXhwIjoxNzcxNDY1NjU0fQ.Vqu0SmuUYmA-47kncUh7kDlomELycG1Q5Xg6S7aDV3s', '2026-02-19 07:32:34', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('1a6cd5d8-1161-48aa-8757-7172d92b7a33', '2026-02-22 21:21:03.143438', '2026-02-22 21:38:38.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTc3NDU2MywiZXhwIjoxNzcxNzc1NDYzfQ.lf64zkUI7g0iKB4AYzkGP01ki8YheSE1NrlATZxw0TI', '2026-02-22 21:36:03', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', 1),
('1f014b7d-84e5-4981-944b-5dd9086229b3', '2026-02-18 21:27:38.438354', '2026-02-19 06:11:30.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQyOTM1OCwiZXhwIjoxNzcxNDMwMjU4fQ.VhntBkann5FYdURGlup5wP4BPUbeU_mlWbrDOd-8Xko', '2026-02-18 21:42:38', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1),
('235e11a8-06b5-4e56-a86f-843a668c1159', '2026-02-20 06:33:47.947471', '2026-02-20 06:33:47.947471', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTU0ODUyNywiZXhwIjoxNzcxNTQ5NDI3fQ.TgIDp87cvwfsushg_2EwkLwVmPr0m4bMqLrSu80JZhw', '2026-02-20 06:48:48', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 0),
('36b9a76c-06df-4013-bcfd-22de310079ee', '2026-02-18 21:51:12.899130', '2026-02-18 21:51:12.899130', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDc3MiwiZXhwIjoxNzcxNDMxNjcyfQ.TSuJOfOmI9ErAkicuuoTCKWjmnyQ78b1ldBW9V68dCw', '2026-02-18 22:06:13', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('3d4629dc-d4cb-4d45-b6fb-ac7f3e1f8048', '2026-02-22 21:24:43.197437', '2026-02-22 21:24:43.197437', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTc3NDc4MywiZXhwIjoxNzcxNzc1NjgzfQ.0d5J98zqWAnjRyjvdhdP1DLp42F4FeqmmN0L7PNaWIw', '2026-02-22 21:39:43', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 0),
('4f702abf-3aad-4743-827d-641589db5ecd', '2026-02-18 21:53:22.165981', '2026-02-18 21:53:22.165981', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDkwMiwiZXhwIjoxNzcxNDMxODAyfQ.GDaj3Q0LXbKxINaFn4aJf7wRa5LqNJ5Nsc5yngc11UI', '2026-02-18 22:08:22', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('50cc5862-4946-40db-b9f5-cd45bbf66d46', '2026-02-22 21:38:38.154252', '2026-02-22 21:38:38.154252', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTc3NTYxOCwiZXhwIjoxNzcxNzc2NTE4fQ.u2ph1SCnA4JxBUE9EBDmy0aqHps-LsvzcyhM3wKKDrw', '2026-02-22 21:53:38', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', 0),
('58587add-7885-4ba3-8357-b37ee9c0aa2d', '2026-02-18 21:43:55.245310', '2026-02-18 21:43:55.245310', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDMzNSwiZXhwIjoxNzcxNDMxMjM1fQ.ktmueQMhsPD6l2TaATZ2C46-AkSEVOvz1gAEe_OE0WU', '2026-02-18 21:58:55', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('5a26bc00-ea81-4202-8234-76ddcf5b8fb2', '2026-02-19 07:21:00.609588', '2026-02-19 07:21:00.609588', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDk2MCwiZXhwIjoxNzcxNDY1ODYwfQ.-UjKU2szBG1j87WrK9zWsswtR-WLkze8pnSbfekCxJE', '2026-02-19 07:36:01', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('5a37a693-5b16-4e3f-adb3-a53033288707', '2026-02-20 07:25:03.099553', '2026-02-20 07:25:03.099553', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTU1MTYwMywiZXhwIjoxNzcxNTUyNTAzfQ.QYxzfgk12xd1pTwgR3vLG5xb4RH0rgpl1Sw_zu6gB7k', '2026-02-20 07:40:03', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('615fc723-4722-4000-8af9-590738b2cf29', '2026-02-19 07:27:06.023350', '2026-02-19 07:27:06.023350', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTMyNiwiZXhwIjoxNzcxNDY2MjI2fQ.5pwPoj_oRma-EtsFexympX9tD0Db4HTUtVsKUXADx_U', '2026-02-19 07:42:06', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('64945fb9-b9e0-47d4-b8a0-a623788a29a8', '2026-02-18 21:44:55.379392', '2026-02-18 21:44:55.379392', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDM5NSwiZXhwIjoxNzcxNDMxMjk1fQ.b-xlRq7SDYYqmJFIt_NTJm8Xu516oUFzTqAevo7xhOE', '2026-02-18 21:59:55', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('68093734-c0a7-4013-8b07-545f6bd26e2f', '2026-02-20 07:24:18.070672', '2026-02-20 07:24:18.070672', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTU1MTU1OCwiZXhwIjoxNzcxNTUyNDU4fQ.iAa53gL31NjwL65xQi8Gk_c5oIcZGTsADEt2VqpDPeE', '2026-02-20 07:39:18', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('68c0f1fe-2444-4e16-84bd-e89c190a7dd4', '2026-02-19 06:40:02.286634', '2026-02-19 06:40:02.286634', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2MjUwMiwiZXhwIjoxNzcxNDYzNDAyfQ.U3COZ_Fnvz3fRmmiYF_QUyOR5VATL9Zw9JrKCcw-dbE', '2026-02-19 06:55:02', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('69a7e7c6-4d57-424e-a72a-99ff97e9a053', '2026-02-23 07:01:43.036673', '2026-02-23 07:01:43.036673', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTgwOTQwMywiZXhwIjoxNzcxODEwMzAzfQ.aH47CsNFU8d1YW3nXk7UHx3bFurk9JNhAiqADuDvTSc', '2026-02-23 07:16:43', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'PostmanRuntime/7.49.1', 0),
('72bfa511-1e74-48f0-b3d4-d49c9e806a9f', '2026-02-19 07:13:01.269162', '2026-02-19 07:13:01.269162', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDQ4MSwiZXhwIjoxNzcxNDY1MzgxfQ.f162a-SHM7tKrJu0YtpE3JsAT0o5QFgZkIXKhqLm-fE', '2026-02-19 07:28:01', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('797a3a29-663d-4483-b729-16dcbc50438d', '2026-02-19 06:36:15.110347', '2026-02-19 07:03:26.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2MjI3NSwiZXhwIjoxNzcxNDYzMTc1fQ.-mZ2bQ9iJ_cUbuj-8AecNnZSqLSca6DzUWcqDa7T1Xk', '2026-02-19 06:51:15', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1),
('7b0ac48b-f6f9-4eab-bd28-b7f62bf04661', '2026-02-18 21:44:26.685100', '2026-02-18 21:44:26.685100', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDM2NiwiZXhwIjoxNzcxNDMxMjY2fQ.yk4Cc0wUD_fDbOQhf-4nQRTKVmgudw1bGZJdZF8ngcE', '2026-02-18 21:59:27', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('80b50aa3-e38c-4157-8473-21752c6095ce', '2026-02-19 07:26:28.179363', '2026-02-19 07:26:28.179363', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTI4OCwiZXhwIjoxNzcxNDY2MTg4fQ.temYlsd99QU6O_EajTvLcwI_Bgha_-f5zXa53D5SpgU', '2026-02-19 07:41:28', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('81973f7c-a645-4292-b4d2-a805a4675ad6', '2026-02-18 21:49:36.445789', '2026-02-18 21:49:36.445789', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDY3NiwiZXhwIjoxNzcxNDMxNTc2fQ.oNfmgk0izPSOOr9BjiaJcBm2AItRHrLO7gQp4aKtAI8', '2026-02-18 22:04:36', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('90c05368-10bd-49db-bc43-ece7d18760c1', '2026-02-18 21:48:57.420995', '2026-02-18 21:48:57.420995', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDYzNywiZXhwIjoxNzcxNDMxNTM3fQ.23lPBukk07ojnZnOhXKsbgEGx1f_wSYciHFpNGyZ6Mk', '2026-02-18 22:03:57', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('984a9fbb-2d7e-407d-ba40-6980caae7e87', '2026-02-22 21:16:50.507134', '2026-02-22 21:16:50.507134', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTc3NDMxMCwiZXhwIjoxNzcxNzc1MjEwfQ.xoQ1ZJcm-5ScZx8UURhFG88tL-UFPjgm1p2KjQKRnOk', '2026-02-22 21:31:51', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 0),
('9d7be451-19f4-4a9d-bf13-311dfb5448a7', '2026-02-19 07:18:20.606084', '2026-02-19 07:18:20.606084', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDgwMCwiZXhwIjoxNzcxNDY1NzAwfQ.PhyXutCfPGnNXE4-KGVp3wMxyIWFNgJkpWiJBAwdOiY', '2026-02-19 07:33:21', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('9e9d3b5a-5f41-4093-996f-bc3c8840f088', '2026-02-23 07:11:40.786349', '2026-02-23 07:11:40.786349', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTgxMDAwMCwiZXhwIjoxNzcxODEwOTAwfQ.-N8uKE4ahSfOZT828RxNFNOwquI5fZ9fcsmspz8rOrs', '2026-02-23 07:26:41', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 0),
('a12127f0-8f47-400b-9f17-9e130cb2c2ff', '2026-02-19 07:17:57.818796', '2026-02-19 07:17:57.818796', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDc3NywiZXhwIjoxNzcxNDY1Njc3fQ.lo6jkCdp91Ruk3peaAGMhA154zGTw-Yf7mI6xUMNecY', '2026-02-19 07:32:58', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('a1eeaaa3-24af-4201-bb05-8cb7be199f5c', '2026-02-19 07:30:46.192605', '2026-02-19 07:30:46.192605', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTU0NiwiZXhwIjoxNzcxNDY2NDQ2fQ.xWXTF0QXRqGOtRWH4aCdW3S0J1jVJOAtv0kPY6XITAo', '2026-02-19 07:45:46', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('a20474bf-6b33-4bc3-a6ef-cdefb137f368', '2026-02-18 21:54:01.511244', '2026-02-18 21:54:01.511244', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDk0MSwiZXhwIjoxNzcxNDMxODQxfQ.hHbT8hXqHR3cBFR1oysA54R9Va89OVmP6ppz5jl-9Is', '2026-02-18 22:09:02', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('a7db1941-4470-4002-8e68-be2095504f9c', '2026-02-19 07:28:21.470437', '2026-02-19 07:28:21.470437', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTQwMSwiZXhwIjoxNzcxNDY2MzAxfQ.xYVBZUzd2H4MnUgEXBw5TZYq-HeUUXMKYCy2B9qwZsk', '2026-02-19 07:43:21', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('aa261f21-5f40-43fb-9a94-6a1dab05b589', '2026-02-18 21:50:47.029149', '2026-02-18 21:50:47.029149', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDc0NywiZXhwIjoxNzcxNDMxNjQ3fQ.1T-WYytdt9CqvuOv6GEI3_-MF02Q-3J-vpN40_O38wk', '2026-02-18 22:05:47', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('b3d4266a-e607-494f-a512-63f404b375b6', '2026-02-19 07:27:37.193279', '2026-02-19 07:27:37.193279', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTM1NywiZXhwIjoxNzcxNDY2MjU3fQ.2OYmGrjO9VxjLy5bfxWbMdbUc4sQXmxCGMXM2_VvXSY', '2026-02-19 07:42:37', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('b8b1c700-e1a7-43de-9d36-7f6ba7d2b7af', '2026-02-18 21:52:53.841037', '2026-02-18 21:52:53.841037', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDg3MywiZXhwIjoxNzcxNDMxNzczfQ.liezcwea-yEXSXpXrxTyXW41wPTcjn9Qf0Ll8Zwbl2A', '2026-02-18 22:07:54', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('c050d666-b0d7-47c8-a1c6-fd60b569f61a', '2026-02-22 21:41:21.718028', '2026-02-22 21:41:21.718028', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTc3NTc4MSwiZXhwIjoxNzcxNzc2NjgxfQ.6VvOKUtjgsU2cciBgT07YOfgKdcJ44vSd90Qu5VmeQY', '2026-02-22 21:56:22', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 0),
('c1631fe6-2dde-42d6-8af9-51271b9c0c25', '2026-02-20 07:23:14.527757', '2026-02-20 07:23:14.527757', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTU1MTQ5NCwiZXhwIjoxNzcxNTUyMzk0fQ.p6H5zpP03uMtayjJ6hAV4NxAlOYNBXyajXMjdBD5ick', '2026-02-20 07:38:15', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('c867092f-0f18-4a8a-9e4c-e2bc56e96ea2', '2026-02-18 21:14:09.927885', '2026-02-18 21:27:38.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQyODU0OSwiZXhwIjoxNzcxNDI5NDQ5fQ.mOtR-m5_VkcUwwgDToV827351NEdMmBUwVXwVV_09HY', '2026-02-18 21:29:10', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1),
('cd8d0001-e1cd-4367-b767-644915bfec27', '2026-02-19 07:33:40.801932', '2026-02-19 07:33:40.801932', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTcyMCwiZXhwIjoxNzcxNDY2NjIwfQ.r5JIXGRKKECMcM1TiMAhIVoYBDFbzBE8x-BC1nfQ2KY', '2026-02-19 07:48:41', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('d144e11e-2916-48cd-b55d-a455a7d22188', '2026-02-19 07:31:24.234055', '2026-02-19 07:31:24.234055', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTU4NCwiZXhwIjoxNzcxNDY2NDg0fQ.L0h4wPWt9GNPqSd55solMyhHiT8ptsx3u1JuGuUl0g8', '2026-02-19 07:46:24', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('de06e573-17be-4129-96f3-b70cd7c99910', '2026-02-19 07:03:26.817275', '2026-02-20 06:33:47.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2MzkwNiwiZXhwIjoxNzcxNDY0ODA2fQ.spLuVJHcH-GHbN5jSXSSd4bT23lGA3aQhFKAPwq6MNI', '2026-02-19 07:18:27', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1),
('e2550f37-c943-40a0-af81-c5c615e1d365', '2026-02-20 07:23:43.651726', '2026-02-20 07:23:43.651726', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTU1MTUyMywiZXhwIjoxNzcxNTUyNDIzfQ.SPtobIbIXANLI0-0bR1T9H7WsmnTS7ZRirRNVNAyOvc', '2026-02-20 07:38:44', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('e2b54911-5d12-463f-9b3d-b00a2066b8a7', '2026-02-18 21:25:59.069195', '2026-02-18 21:27:38.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQyOTI1OSwiZXhwIjoxNzcxNDMwMTU5fQ.mxWrMnszS6USa6R2kaoT2P9ZnDtMgw0p0lL42D94uck', '2026-02-18 21:40:59', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1),
('e8c3e301-8905-4664-a6ed-872099dcfc9c', '2026-02-19 06:11:30.765270', '2026-02-19 06:36:15.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2MDc5MCwiZXhwIjoxNzcxNDYxNjkwfQ.XlRnudk0zHQODEQHSZhIsstM_0qcMlAHT_MKFckCegE', '2026-02-19 06:26:31', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1),
('e8ddf339-187a-4dc5-8b59-4f6903716e4e', '2026-02-23 07:06:45.007564', '2026-02-23 07:06:45.007564', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTgwOTcwNCwiZXhwIjoxNzcxODEwNjA0fQ.vjNiWW3L_r8QnLRAcEMKs_g0JHAXSULFUqgj24-7DuE', '2026-02-23 07:21:45', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'PostmanRuntime/7.49.1', 0),
('fccb80d6-d7fc-4fab-b125-5271a1e85353', '2026-02-19 07:30:13.603780', '2026-02-19 07:30:13.603780', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTUxMywiZXhwIjoxNzcxNDY2NDEzfQ.OuWty7xV7LdGzI9nPGG38LLDhN_Q1sazuhy55BhZ-cI', '2026-02-19 07:45:14', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0);

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
  `logActionType` enum('login','logout','create','update','delete','view','refresh') NOT NULL,
  `message` text NOT NULL,
  `versionId` varchar(36) DEFAULT NULL,
  `scope` enum('flagship_event','events','event_speakers','sponsors','event_registrations','hero_sections','achievement_metrics','about_sections','speakers','gallery_items','team_members','version_settings','users','faq') NOT NULL,
  `ipAddress` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `logType`, `userId`, `logActionType`, `message`, `versionId`, `scope`, `ipAddress`) VALUES
('098f0d15-d5a0-445b-87a3-fffed5cbc9bf', '2026-02-22 21:35:31.276614', '2026-02-22 21:35:31.276614', NULL, NULL, 'info', 'system', 'create', 'Designation 2eb7c381-be36-4d28-8ff5-da38a3c6e53e created successfully', 'a20e1639-119e-4a91-bd70-5e1b4962dd18', 'team_members', '::ffff:127.0.0.1'),
('202f376d-a075-44ea-8486-f1af448ba301', '2026-02-22 21:24:43.240214', '2026-02-22 21:24:43.240214', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'login', 'User logged in successfully', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'users', '::ffff:127.0.0.1'),
('221718ae-5ace-49de-8c19-9b557a424b9d', '2026-02-22 21:41:28.654031', '2026-02-22 21:41:28.654031', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'create', 'Team member 003fdd7e-e25d-43b5-8099-5dc7ac8d86a4 created', 'a20e1639-119e-4a91-bd70-5e1b4962dd18', 'team_members', '::ffff:127.0.0.1'),
('2617f926-6523-4a14-bd7f-2ebfbc80fcbe', '2026-02-20 07:24:18.321050', '2026-02-20 07:24:18.321050', NULL, NULL, 'info', 'system', 'delete', 'Category 6417942c-6392-4ba2-881d-9a6395ef9536 deleted successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('28262412-a936-481b-8309-2e136c017e5b', '2026-02-22 21:21:03.181219', '2026-02-22 21:21:03.181219', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'login', 'User logged in successfully', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'users', '::ffff:127.0.0.1'),
('28daec5a-44a9-416a-aa6d-c8d0bf8ec132', '2026-02-22 21:16:50.551832', '2026-02-22 21:16:50.551832', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'login', 'User logged in successfully', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'users', '::ffff:127.0.0.1'),
('3c00c805-7f14-4a9c-8d51-10f71110d5a2', '2026-02-22 21:41:21.757304', '2026-02-22 21:41:21.757304', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'login', 'User logged in successfully', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'users', '::ffff:127.0.0.1'),
('4882710d-a07e-40e7-9695-a8b977dd77e2', '2026-02-23 07:01:43.072854', '2026-02-23 07:01:43.072854', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'login', 'User logged in successfully', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'users', '::1'),
('50ef7f11-3128-401e-b430-64d447b4df11', '2026-02-20 07:25:03.248441', '2026-02-20 07:25:03.248441', NULL, NULL, 'info', 'system', 'create', 'Designation c94661c0-2783-45c2-80ef-5200a7cc2d2f created successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('53d10012-8ab5-44e4-9237-46d23dec9e3e', '2026-02-20 07:25:03.316244', '2026-02-20 07:25:03.316244', NULL, NULL, 'info', 'system', 'delete', 'Designation c94661c0-2783-45c2-80ef-5200a7cc2d2f deleted successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('5b94e1ab-9e78-49a4-8331-c7a645a6007d', '2026-02-20 07:24:18.139423', '2026-02-20 07:24:18.139423', NULL, NULL, 'info', 'system', 'create', 'Category 6417942c-6392-4ba2-881d-9a6395ef9536 created successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('618cd232-f3a9-49d1-bf2c-fb37c1a81b57', '2026-02-20 07:24:18.189270', '2026-02-20 07:24:18.189270', NULL, NULL, 'info', 'system', 'update', 'Category 6417942c-6392-4ba2-881d-9a6395ef9536 updated successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('6a982e5a-eac2-4126-8631-a5d893e99118', '2026-02-20 07:23:43.836491', '2026-02-20 07:23:43.836491', NULL, NULL, 'info', 'system', 'create', 'Designation 52c311c0-a4d6-4553-9512-1474b6b6fe43 created successfully', NULL, 'team_members', '::ffff:127.0.0.1'),
('72492cfd-dbef-4893-b007-0ee6ec275a18', '2026-02-23 07:11:40.813214', '2026-02-23 07:11:40.813214', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'refresh', 'Refresh token successful', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'users', '::1'),
('74bf8157-372f-4e56-83ca-29fa585aa9c2', '2026-02-20 07:23:43.873897', '2026-02-20 07:23:43.873897', NULL, NULL, 'info', 'system', 'update', 'Designation 52c311c0-a4d6-4553-9512-1474b6b6fe43 updated successfully', NULL, 'team_members', '::ffff:127.0.0.1'),
('861cdd69-6dbb-4058-a63e-eca02144340b', '2026-02-20 07:24:18.283643', '2026-02-20 07:24:18.283643', NULL, NULL, 'info', 'system', 'delete', 'Designation 21f18be7-c10a-4bba-a16a-54e7a90d1a1a deleted successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('97c4b680-6725-4e01-8f1d-12eb3bca7cfa', '2026-02-20 07:24:18.226083', '2026-02-20 07:24:18.226083', NULL, NULL, 'info', 'system', 'create', 'Designation 21f18be7-c10a-4bba-a16a-54e7a90d1a1a created successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('9b7b6a4b-41bb-48f9-9183-e7c8bf8c50e4', '2026-02-23 07:06:45.047632', '2026-02-23 07:06:45.047632', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'login', 'User logged in successfully', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'users', '::1'),
('a7062fe2-1dcd-4b6f-af90-6f65c4c63f69', '2026-02-20 07:25:03.212256', '2026-02-20 07:25:03.212256', NULL, NULL, 'info', 'system', 'update', 'Category 854b19af-8824-4105-af6a-6b27b20a3115 updated successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('ad1a0b44-2f86-4c1c-9b1c-2de1c8378994', '2026-02-20 07:23:43.916917', '2026-02-20 07:23:43.916917', NULL, NULL, 'info', 'system', 'delete', 'Designation 52c311c0-a4d6-4553-9512-1474b6b6fe43 deleted successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('ae3121f8-1a25-492d-a707-4bd61fe263a5', '2026-02-22 21:34:17.087321', '2026-02-22 21:34:17.087321', NULL, NULL, 'info', 'system', 'create', 'Category c472a3bd-55e8-4671-8b6c-de59f962fc78 created successfully', 'a20e1639-119e-4a91-bd70-5e1b4962dd18', 'team_members', '::ffff:127.0.0.1'),
('af786813-e053-4a86-ba33-3f741a99f246', '2026-02-20 07:23:43.795283', '2026-02-20 07:23:43.795283', NULL, NULL, 'info', 'system', 'update', 'Category 5c5f6130-baac-478c-b3a8-6ddfcd50c147 updated successfully', NULL, 'team_members', '::ffff:127.0.0.1'),
('b4c9aa57-9fcd-461c-8216-846ccd4f4445', '2026-02-22 21:56:08.604673', '2026-02-22 21:56:08.604673', NULL, NULL, 'info', 'system', 'update', 'Team member 003fdd7e-e25d-43b5-8099-5dc7ac8d86a4 updated successfully', 'a20e1639-119e-4a91-bd70-5e1b4962dd18', 'team_members', '::ffff:127.0.0.1'),
('bd9752ba-82da-4185-b4a7-32ffe76c388d', '2026-02-23 07:17:12.764157', '2026-02-23 07:17:12.764157', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'create', 'Team member 81342f4b-aff4-42f4-a4dd-c5ef65042f0f created', 'a20e1639-119e-4a91-bd70-5e1b4962dd18', 'team_members', '::1'),
('c87438bf-fca3-465e-ab02-e0ee47ec19dc', '2026-02-20 07:25:03.172150', '2026-02-20 07:25:03.172150', NULL, NULL, 'info', 'system', 'create', 'Category 854b19af-8824-4105-af6a-6b27b20a3115 created successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('cfda19d9-12a1-40cc-b618-7b34fd737cdf', '2026-02-22 21:38:38.180369', '2026-02-22 21:38:38.180369', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'refresh', 'Refresh token successful', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'users', '::ffff:127.0.0.1'),
('eb01411e-b0bb-4bef-b578-2b8fa47e33e1', '2026-02-20 07:25:03.283863', '2026-02-20 07:25:03.283863', NULL, NULL, 'info', 'system', 'update', 'Designation c94661c0-2783-45c2-80ef-5200a7cc2d2f updated successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('ef71fa59-f315-477a-be5f-ee2a3d360cd0', '2026-02-20 07:23:43.744901', '2026-02-20 07:23:43.744901', NULL, NULL, 'info', 'system', 'create', 'Category 5c5f6130-baac-478c-b3a8-6ddfcd50c147 created successfully', NULL, 'team_members', '::ffff:127.0.0.1'),
('f0ce11a2-ebd6-4a11-8e0b-4ef6a3044c71', '2026-02-20 07:25:03.351014', '2026-02-20 07:25:03.351014', NULL, NULL, 'info', 'system', 'delete', 'Category 854b19af-8824-4105-af6a-6b27b20a3115 deleted successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('f29d4980-788e-43c6-bbe9-6d2813442d98', '2026-02-20 07:23:43.966856', '2026-02-20 07:23:43.966856', NULL, NULL, 'info', 'system', 'delete', 'Category 5c5f6130-baac-478c-b3a8-6ddfcd50c147 deleted successfully', '03dbda95-dc51-4335-be4c-fe2730b5889f', 'team_members', '::ffff:127.0.0.1'),
('f5b671f7-5a2b-4cc1-8bb8-6e96a079d5d1', '2026-02-22 21:44:28.846998', '2026-02-22 21:44:28.846998', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'update', 'Category 3400f931-22ce-44d0-8d63-67606410996b updated successfully', NULL, 'team_members', '::ffff:127.0.0.1'),
('f77febf0-d426-46a6-9965-e58e78912bd3', '2026-02-22 21:46:27.541425', '2026-02-22 21:46:27.541425', NULL, NULL, 'info', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'update', 'Designation 2eb7c381-be36-4d28-8ff5-da38a3c6e53e updated successfully', NULL, 'team_members', '::ffff:127.0.0.1'),
('fe77281c-a3ce-4e85-b608-6d0298730396', '2026-02-22 21:39:25.447130', '2026-02-22 21:39:25.447130', NULL, NULL, 'info', 'system', 'create', 'Category 3400f931-22ce-44d0-8d63-67606410996b created successfully', 'a20e1639-119e-4a91-bd70-5e1b4962dd18', 'team_members', '::ffff:127.0.0.1');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `display_order`, `type`) VALUES
('015916e7-5ee7-46f7-a92c-1a7eca73bf7d', 'Video Edit Team 1771465513498', '2026-02-19 07:30:13.648136', '2026-02-19 07:30:13.648136', 'system', NULL, 5, 'teams'),
('0dfa5359-a7bb-40d0-b8e4-536ee3596b67', 'Backend 1771465513498', '2026-02-19 07:30:13.690354', '2026-02-19 07:30:13.690354', 'system', NULL, 3, 'teams'),
('0f1dcb3e-ad47-4c0e-8824-a258252de5c5', 'Organizers 1771464800498', '2026-02-19 07:18:20.736906', '2026-02-19 07:18:20.736906', 'system', NULL, 1, 'organizers-1771464800498'),
('1e4f60eb-f0dc-4112-924b-f1377dcb603d', 'Backend 1771464800498', '2026-02-19 07:18:20.698107', '2026-02-19 07:18:20.698107', 'system', NULL, 3, 'backend-1771464800498'),
('1ea1ab10-9f2b-4ccf-8e58-1db64c3a35a4', 'Organizers 1771465513498', '2026-02-19 07:30:13.727335', '2026-02-19 07:30:13.727335', 'system', NULL, 1, 'teams'),
('23578be3-98ba-4819-9317-501a2c96e956', 'Backend 1771465720718', '2026-02-19 07:33:40.883720', '2026-02-19 07:33:40.883720', 'system', NULL, 3, 'teams'),
('2d520dfa-ae05-4d3b-b612-d35298add0c2', 'Design 1771464800498', '2026-02-19 07:18:20.677529', '2026-02-19 07:18:20.677529', 'system', NULL, 4, 'design-1771464800498'),
('310ac0d0-46d4-41ba-a85e-3afbda513424', 'Frontend', '2026-02-19 07:13:01.378077', '2026-02-19 07:13:01.378077', 'system', NULL, 2, 'frontend'),
('3400f931-22ce-44d0-8d63-67606410996b', 'marketing', '2026-02-22 21:39:25.422939', '2026-02-22 21:44:28.000000', 'system', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 2, 'teams'),
('35f823d6-0bcc-483c-a31e-d8ae208117d1', 'Frontend 1771465720718', '2026-02-19 07:33:40.904534', '2026-02-19 07:33:40.904534', 'system', NULL, 2, 'teams'),
('3a44ff3d-ca3a-4be5-8019-8993a4645b90', 'Design', '2026-02-19 07:13:01.340474', '2026-02-19 07:13:01.340474', 'system', NULL, 4, 'design'),
('3f824e66-c54b-4815-bd59-e7efc799440c', 'Design 1771465720718', '2026-02-19 07:33:40.864482', '2026-02-19 07:33:40.864482', 'system', NULL, 4, 'teams'),
('411afaba-e3a9-41d8-8973-2e175fee59b0', 'Frontend 1771465401386', '2026-02-19 07:28:21.575755', '2026-02-19 07:28:21.575755', 'system', NULL, 2, 'frontend-1771465401386'),
('494ff867-ada6-4a69-8ed7-3b117bac3161', 'Organizers', '2026-02-19 07:13:01.397251', '2026-02-19 07:13:01.397251', 'system', NULL, 1, 'organizers'),
('4b7ff921-ee57-4f23-acbb-c9e0de9232ca', 'Design 1771465584126', '2026-02-19 07:31:24.305398', '2026-02-19 07:31:24.305398', 'system', NULL, 4, 'teams'),
('4e65af79-d00e-49db-9183-bf6e2907082d', 'Frontend 1771464960506', '2026-02-19 07:21:00.725395', '2026-02-19 07:21:00.725395', 'system', NULL, 2, 'frontend-1771464960506'),
('639ee662-43b5-4b42-8719-13e946b4a987', 'Video Edit Team 1771464960506', '2026-02-19 07:21:00.665432', '2026-02-19 07:21:00.665432', 'system', NULL, 5, 'video-edit-1771464960506'),
('64c418e2-526e-4882-bf62-35a4af460fb5', 'Audit Test Category 1771551494568', '2026-02-20 07:23:14.583354', '2026-02-20 07:23:14.583354', 'system', NULL, 10, 'teams'),
('666c946b-7957-490f-96ef-7c0534377d0b', 'Frontend 1771465513498', '2026-02-19 07:30:13.708507', '2026-02-19 07:30:13.708507', 'system', NULL, 2, 'teams'),
('69de9f8c-2f22-4452-8022-293b9983a689', 'Design 1771464960506', '2026-02-19 07:21:00.685920', '2026-02-19 07:21:00.685920', 'system', NULL, 4, 'design-1771464960506'),
('6b7db793-b2ef-47a5-bde3-5cca4bcc24d9', 'Organizers 1771465720718', '2026-02-19 07:33:40.924578', '2026-02-19 07:33:40.924578', 'system', NULL, 1, 'teams'),
('740ba45c-58c6-4653-acf8-080035563dcf', 'Organizers 1771465584126', '2026-02-19 07:31:24.358689', '2026-02-19 07:31:24.358689', 'system', NULL, 1, 'teams'),
('7f5e9218-b1b0-43c0-8883-2d26fb92c642', 'Backend', '2026-02-19 07:13:01.360497', '2026-02-19 07:13:01.360497', 'system', NULL, 3, 'backend'),
('8047c9bf-9689-4ae8-b0fa-06c50f35fdd8', 'Backend 1771464960506', '2026-02-19 07:21:00.704459', '2026-02-19 07:21:00.704459', 'system', NULL, 3, 'backend-1771464960506'),
('8515b80b-ecdb-43ec-833e-d0041bf10d84', 'Video Edit Team 1771465401386', '2026-02-19 07:28:21.514359', '2026-02-19 07:28:21.514359', 'system', NULL, 5, 'video-edit-1771465401386'),
('8cd54135-1105-4556-8335-a936da835030', 'Video Edit Team 1771465584126', '2026-02-19 07:31:24.285894', '2026-02-19 07:31:24.285894', 'system', NULL, 5, 'teams'),
('90fe67a3-6c8d-4adf-8001-b13d83e3af73', 'Frontend 1771465584126', '2026-02-19 07:31:24.341369', '2026-02-19 07:31:24.341369', 'system', NULL, 2, 'teams'),
('9138ba94-b5c2-4b91-b372-e299d3823569', 'Other Category 1771465357088', '2026-02-19 07:27:37.258202', '2026-02-19 07:27:37.258202', 'system', NULL, 2, 'not-teams'),
('9668d70a-24c2-4ff0-a830-d74211026aba', 'Video Edit Team', '2026-02-19 07:13:01.316455', '2026-02-19 07:13:01.316455', 'system', NULL, 5, 'video-edit'),
('af61eb65-7bbc-43b2-8e0e-25232df5f739', 'Backend 1771465401386', '2026-02-19 07:28:21.556149', '2026-02-19 07:28:21.556149', 'system', NULL, 3, 'backend-1771465401386'),
('b08ef0ee-681c-4886-8414-45b2de54ad48', 'Backend 1771465584126', '2026-02-19 07:31:24.324542', '2026-02-19 07:31:24.324542', 'system', NULL, 3, 'teams'),
('b8ad5738-0cd2-47e8-b347-b401cbd4467a', 'Teams Category 1771465357088', '2026-02-19 07:27:37.238832', '2026-02-19 07:27:37.238832', 'system', NULL, 1, 'teams'),
('becff02b-aafa-4249-ae2c-4eef96299743', 'Video Edit Team 1771464800498', '2026-02-19 07:18:20.652983', '2026-02-19 07:18:20.652983', 'system', NULL, 5, 'video-edit-1771464800498'),
('c472a3bd-55e8-4671-8b6c-de59f962fc78', 'web dev', '2026-02-22 21:34:17.059303', '2026-02-22 21:34:17.059303', 'system', NULL, 1, 'team'),
('c5475a6e-bc35-453a-bc83-f486a6fb7576', 'Video Edit Team 1771465720718', '2026-02-19 07:33:40.844971', '2026-02-19 07:33:40.844971', 'system', NULL, 5, 'teams'),
('ca3aeb31-7317-4710-bc05-5d8c46042a6c', 'Organizers 1771465401386', '2026-02-19 07:28:21.595603', '2026-02-19 07:28:21.595603', 'system', NULL, 1, 'organizers-1771465401386'),
('ce71c60b-58dd-4090-94ab-ce62a25ce484', 'Design 1771465401386', '2026-02-19 07:28:21.534701', '2026-02-19 07:28:21.534701', 'system', NULL, 4, 'design-1771465401386'),
('cf2f1961-06cb-43e1-91d9-925a6b9852e6', 'Design 1771465513498', '2026-02-19 07:30:13.669244', '2026-02-19 07:30:13.669244', 'system', NULL, 4, 'teams'),
('e100fb39-7e57-4913-b43b-3f412969b414', 'Frontend 1771464800498', '2026-02-19 07:18:20.717286', '2026-02-19 07:18:20.717286', 'system', NULL, 2, 'frontend-1771464800498'),
('e4da3a34-c618-4b5b-b546-e1bffa0466ad', 'string', '2026-02-18 21:34:08.838442', '2026-02-18 21:34:08.838442', NULL, NULL, 1, 'string'),
('f4ff414f-3fe5-4b42-a879-7221afe88919', 'Organizers 1771464960506', '2026-02-19 07:21:00.742668', '2026-02-19 07:21:00.742668', 'system', NULL, 1, 'organizers-1771464960506');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `name`) VALUES
('135d2384-f07a-4a7b-be40-0a8bf415b49e', '2026-02-19 06:12:09.020307', '2026-02-19 06:12:09.020307', NULL, NULL, 'string'),
('13b88cb3-44db-4c1b-b30f-58a8eec7e0a2', '2026-02-19 07:31:24.397927', '2026-02-19 07:31:24.397927', 'system', NULL, 'Vice-President 1771465584126'),
('148c947c-e08f-405e-8efe-02c876054a5e', '2026-02-19 07:18:20.831807', '2026-02-19 07:18:20.831807', 'system', NULL, 'Co-Lead 1771464800498'),
('154dd39a-4655-404d-b11a-a222a96e6efa', '2026-02-19 07:33:41.019299', '2026-02-19 07:33:41.019299', 'system', NULL, 'Lead 1771465720718'),
('19d0e381-1a93-4cea-a942-98479352b034', '2026-02-19 07:31:24.415785', '2026-02-19 07:31:24.415785', 'system', NULL, 'Executive Members 1771465584126'),
('24c44c02-f067-404e-b698-6762963a784a', '2026-02-19 06:12:14.332516', '2026-02-19 06:12:14.332516', NULL, NULL, 'string'),
('2b6d9ebd-0633-4da7-8e03-0e526fa2df46', '2026-02-19 07:18:20.816252', '2026-02-19 07:18:20.816252', 'system', NULL, 'Lead 1771464800498'),
('2eb7c381-be36-4d28-8ff5-da38a3c6e53e', '2026-02-22 21:35:31.250113', '2026-02-22 21:46:27.000000', 'system', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', 'Co-lead 123'),
('309b524b-e910-4336-8c1b-f6eafc54e109', '2026-02-19 07:31:24.378251', '2026-02-19 07:31:24.378251', 'system', NULL, 'President 1771465584126'),
('353a421a-0f0f-43c7-9f79-fe4c7480accf', '2026-02-19 07:31:24.436001', '2026-02-19 07:31:24.436001', 'system', NULL, 'Lead 1771465584126'),
('386be7a7-a0b3-46ad-bf83-0d6f62a731ae', '2026-02-19 07:30:13.803920', '2026-02-19 07:30:13.803920', 'system', NULL, 'Lead 1771465513498'),
('408e29ec-3ef5-4827-817a-24a278932c3d', '2026-02-19 07:21:00.844745', '2026-02-19 07:21:00.844745', 'system', NULL, 'Co-Lead 1771464960506'),
('40969962-188b-4953-9d69-1e21475d05ea', '2026-02-19 07:33:41.000082', '2026-02-19 07:33:41.000082', 'system', NULL, 'Executive Members 1771465720718'),
('43999aab-6185-41ef-95e9-2b63d40e9d8d', '2026-02-19 07:28:21.661907', '2026-02-19 07:28:21.661907', 'system', NULL, 'Executive Members 1771465401386'),
('4be1d8bc-2d17-46af-9eaf-a08aa2754ac6', '2026-02-19 07:21:00.781624', '2026-02-19 07:21:00.781624', 'system', NULL, 'Vice-President 1771464960506'),
('4c67175c-37b4-47f2-8308-979dcc1deb40', '2026-02-19 07:33:40.980344', '2026-02-19 07:33:40.980344', 'system', NULL, 'Vice-President 1771465720718'),
('5948f300-d45e-4c9b-8daa-c77f2ed4e748', '2026-02-19 07:18:20.797002', '2026-02-19 07:18:20.797002', 'system', NULL, 'Executive Members 1771464800498'),
('706e7537-d949-4d2c-a017-b5e8038c070b', '2026-02-19 07:13:01.416420', '2026-02-19 07:13:01.416420', 'system', NULL, 'President'),
('73a91348-4e5e-4871-99c0-6a5ce0674b31', '2026-02-19 07:30:13.820325', '2026-02-19 07:30:13.820325', 'system', NULL, 'Co-Lead 1771465513498'),
('783e84aa-db27-4155-b69a-e08e00ef7321', '2026-02-19 07:33:40.962766', '2026-02-19 07:33:40.962766', 'system', NULL, 'President 1771465720718'),
('7a024cfe-1362-463b-9e8e-2979b748486b', '2026-02-19 07:28:21.683466', '2026-02-19 07:28:21.683466', 'system', NULL, 'Lead 1771465401386'),
('7d5c8ef9-1802-48e5-be6f-d87172b90d84', '2026-02-19 07:27:37.278435', '2026-02-19 07:27:37.278435', 'system', NULL, 'Role 1771465357088'),
('84fee24a-7d95-4563-a959-dfd5afe00bb8', '2026-02-19 07:31:24.454397', '2026-02-19 07:31:24.454397', 'system', NULL, 'Co-Lead 1771465584126'),
('8621c1da-5fef-4304-8ac4-082c07ab4f0f', '2026-02-19 06:46:04.638806', '2026-02-19 06:46:04.638806', 'system', NULL, 's111111tring'),
('87ff5c25-7c45-41c5-a5b3-40e0797c936d', '2026-02-19 07:28:21.704063', '2026-02-19 07:28:21.704063', 'system', NULL, 'Co-Lead 1771465401386'),
('9382116c-ed41-42c0-8d7f-573738495de0', '2026-02-19 06:12:16.815126', '2026-02-19 06:12:16.815126', NULL, NULL, 'string'),
('9483b276-9c0e-4849-b705-b782acee19f9', '2026-02-19 07:30:13.764871', '2026-02-19 07:30:13.764871', 'system', NULL, 'Vice-President 1771465513498'),
('9ab1f7e3-adeb-486c-9ebb-41904aa06b5f', '2026-02-19 07:21:00.760801', '2026-02-19 07:21:00.760801', 'system', NULL, 'President 1771464960506'),
('a0bc0af1-ea4c-4e99-92da-706bbf57303c', '2026-02-19 07:13:01.453909', '2026-02-19 07:13:01.453909', 'system', NULL, 'Executive Members'),
('a608946d-578d-42c5-8012-22fb51ec6c4e', '2026-02-19 07:18:20.778071', '2026-02-19 07:18:20.778071', 'system', NULL, 'Vice-President 1771464800498'),
('b70fd86b-571e-4272-9cdd-ffd1a0a94430', '2026-02-19 07:18:20.756918', '2026-02-19 07:18:20.756918', 'system', NULL, 'President 1771464800498'),
('b98e220a-dd77-498f-a315-5cdf1e1724e8', '2026-02-19 06:12:06.460285', '2026-02-19 06:12:06.460285', NULL, NULL, 'string'),
('c19b943e-e392-4a6c-b536-3857ed2f09bc', '2026-02-19 06:12:20.901759', '2026-02-19 06:12:20.901759', NULL, NULL, 'string'),
('c269316a-7a2c-47a6-99ac-84ef9a6d4107', '2026-02-19 06:12:10.970408', '2026-02-19 06:12:10.970408', NULL, NULL, 'string'),
('c2723d10-4dcf-434a-8d1c-a4b55b930fe6', '2026-02-19 07:33:41.037126', '2026-02-19 07:33:41.037126', 'system', NULL, 'Co-Lead 1771465720718'),
('c4bd66c0-a4d5-465c-8c3b-f07df86d44f1', '2026-02-19 07:13:01.490023', '2026-02-19 07:13:01.490023', 'system', NULL, 'Co-Lead'),
('c920b23f-d173-45b3-ae49-13d4db5a3805', '2026-02-19 07:21:00.820215', '2026-02-19 07:21:00.820215', 'system', NULL, 'Lead 1771464960506'),
('d5b0470a-2050-4fc1-bc7f-eb9729a2eb78', '2026-02-19 07:13:01.433961', '2026-02-19 07:13:01.433961', 'system', NULL, 'Vice-President'),
('e015abf7-8f74-4f85-a074-a2aac0d82905', '2026-02-19 07:28:21.636795', '2026-02-19 07:28:21.636795', 'system', NULL, 'Vice-President 1771465401386'),
('e1b6757a-c161-4427-a654-a9072a0c16ae', '2026-02-19 07:28:21.615816', '2026-02-19 07:28:21.615816', 'system', NULL, 'President 1771465401386'),
('e3dfdcce-6484-4f8d-9935-9c39ec8117cb', '2026-02-19 07:30:13.745585', '2026-02-19 07:30:13.745585', 'system', NULL, 'President 1771465513498'),
('edcc2d23-416c-425d-9009-76dfe13a83b4', '2026-02-19 07:21:00.801562', '2026-02-19 07:21:00.801562', 'system', NULL, 'Executive Members 1771464960506'),
('f041f68e-96a5-4758-8508-2a8456421dc7', '2026-02-19 07:30:13.785682', '2026-02-19 07:30:13.785682', 'system', NULL, 'Executive Members 1771465513498'),
('f5173ddd-0c8d-4ebe-b37a-b214308613cd', '2026-02-19 07:13:01.471561', '2026-02-19 07:13:01.471561', 'system', NULL, 'Lead'),
('ff02261f-081c-4693-a35f-6a1700132e3a', '2026-02-20 07:23:14.614472', '2026-02-20 07:23:14.614472', 'system', NULL, 'Audit Test Designation 1771551494604');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `flagship_event_version_id` varchar(36) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text
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
-- Table structure for table `hero_sections`
--

CREATE TABLE `hero_sections` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `flagship_event_version_id` varchar(36) NOT NULL,
  `heading` text,
  `paragraph` text,
  `extra_options` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(2, 1770942791462, 'Change1770942791462'),
(3, 1771375946911, 'AddDesignationTable1771375946911'),
(4, 1771808520235, 'AddDesignationTable1771808520235');

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

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `token`, `expiresAt`, `userId`, `ipAddress`, `userAgent`, `isRevoked`) VALUES
('03b28cc0-31fa-4855-b0dc-e4c83378ac87', '2026-02-19 07:18:20.620089', '2026-02-19 07:18:20.620089', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDgwMCwiZXhwIjoxNzcyMDY5NjAwfQ.SGh6xRuE75qbFdxGiPooBFKo23DFEwSbAKgrxHTpj1Q', '2026-02-26 07:18:21', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('04c49d7b-54f9-40ae-bd63-ac2670b3d3e8', '2026-02-18 21:14:09.949088', '2026-02-18 21:14:09.949088', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQyODU0OSwiZXhwIjoxNzcyMDMzMzQ5fQ.zHpCp7WvSaaJiddmsEV8p7DMUy9bH8TtqRbkxtcuehw', '2026-02-25 21:14:10', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 0),
('04f03378-9185-4234-b92c-059341b1716a', '2026-02-18 21:50:47.049426', '2026-02-18 21:50:47.049426', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDc0NywiZXhwIjoxNzcyMDM1NTQ3fQ.J6yX5vboIUdwUhJCwzegOK3QfQo0InA9AF1IJow1aLE', '2026-02-25 21:50:47', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('09524107-dbf7-4d14-9894-a8994b306c11', '2026-02-18 21:27:38.453376', '2026-02-19 06:11:30.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQyOTM1OCwiZXhwIjoxNzcyMDM0MTU4fQ.NsnViL3LlAdWmhcoNa3HNc92HybNu_xRSNwGEYgALLQ', '2026-02-25 21:27:38', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1),
('10a6b616-8129-49a3-b970-26fde4fcd18f', '2026-02-19 06:11:30.780198', '2026-02-19 06:36:15.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2MDc5MCwiZXhwIjoxNzcyMDY1NTkwfQ.3qWNGI1mzPagkok2chcq4QiRXOENUQBA57GVxl_uCkE', '2026-02-26 06:11:31', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1),
('18d3eee4-f325-4150-9964-6a6dd7326c99', '2026-02-23 07:11:40.799071', '2026-02-23 07:11:40.799071', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTgxMDAwMCwiZXhwIjoxNzcyNDE0ODAwfQ.RUY1-tES0ZyrFZDrHij87q_wjt7CXNt8zpQ1yq9x5c4', '2026-03-02 07:11:41', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 0),
('1ef2fe91-1240-4915-9d15-f6390903b91c', '2026-02-20 07:23:43.680819', '2026-02-20 07:23:43.680819', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTU1MTUyMywiZXhwIjoxNzcyMTU2MzIzfQ.2QUbYUtLKnq9fWxp2PLHmCX9MfjK1vIIWhtgKnhpOjU', '2026-02-27 07:23:44', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('2263d950-e5e3-44c3-b1ff-be264daa3a86', '2026-02-18 21:25:59.091100', '2026-02-18 21:27:38.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQyOTI1OSwiZXhwIjoxNzcyMDM0MDU5fQ.U8Boad5E2BicTPvOJ_hdJ_aYB8jgG9t9IwFrcYVwyaA', '2026-02-25 21:25:59', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1),
('22896f52-046d-4997-8ae2-b1ca33241885', '2026-02-23 07:06:45.031859', '2026-02-23 07:06:45.031859', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTgwOTcwNCwiZXhwIjoxNzcyNDE0NTA0fQ.qCSxNqZdYh8oyYIo--31pF6756DhxW02mYBIlJAKQcI', '2026-03-02 07:06:45', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'PostmanRuntime/7.49.1', 0),
('2cbff35c-5d17-4b03-a245-b06be24af708', '2026-02-19 07:27:37.206682', '2026-02-19 07:27:37.206682', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTM1NywiZXhwIjoxNzcyMDcwMTU3fQ.xp5KQ1v_x5tHT8eK-EJmLfNR8GQnvkbowkLdQq-JxTM', '2026-02-26 07:27:37', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('2e7388b4-53c3-4f21-b8d3-1d9c1d6c2ef3', '2026-02-19 06:40:02.301382', '2026-02-19 06:40:02.301382', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2MjUwMiwiZXhwIjoxNzcyMDY3MzAyfQ.BZHmd_F1WIc65nFddm4H_sfhnICuhKLWzgfdMPKew2M', '2026-02-26 06:40:02', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('2f941fa4-1215-4047-b5c6-3ba73c365cbd', '2026-02-22 21:24:43.220532', '2026-02-22 21:24:43.220532', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTc3NDc4MywiZXhwIjoxNzcyMzc5NTgzfQ.RbDwKHFyIRqt8qMkOVcaANE9JqB1iTdA9WlVtmM3b7w', '2026-03-01 21:24:43', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 0),
('37a43b88-11ee-4b27-82b0-4a9c3f01bb72', '2026-02-22 21:38:38.166734', '2026-02-22 21:38:38.166734', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTc3NTYxOCwiZXhwIjoxNzcyMzgwNDE4fQ.w8FG2z09X4q4Uo0nztn2baPspaafPXuL8JmLLHh2yds', '2026-03-01 21:38:38', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', 0),
('390291e1-06aa-4be0-9b9b-41f6285fa976', '2026-02-20 07:24:18.088472', '2026-02-20 07:24:18.088472', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTU1MTU1OCwiZXhwIjoxNzcyMTU2MzU4fQ.R8zmw44rlaccRRSyKCLqDE43ZFnxzktxf3PPL_43Ldc', '2026-02-27 07:24:18', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('3b92b4b3-8f07-4ba7-9869-dfe993248c03', '2026-02-19 07:13:01.284084', '2026-02-19 07:13:01.284084', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDQ4MSwiZXhwIjoxNzcyMDY5MjgxfQ.2e4Pw_QzmIQ01pbIQHjbR0QFsINxlwWYGaNmVdh2AB8', '2026-02-26 07:13:01', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('3cc43a2b-bdfd-4d98-b7cf-6a49a3e931b7', '2026-02-20 07:23:14.545366', '2026-02-20 07:23:14.545366', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTU1MTQ5NCwiZXhwIjoxNzcyMTU2Mjk0fQ.P7JkArk7NVI5tx2XEyhZm5O3Y0L-Iynu2X0ZRBZelV0', '2026-02-27 07:23:15', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('3f6bb5a0-dae4-4aad-9d34-b1f4179dcb74', '2026-02-19 07:27:06.037499', '2026-02-19 07:27:06.037499', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTMyNiwiZXhwIjoxNzcyMDcwMTI2fQ.ffHVfGjtjMS110oi6tI1C7CR47DoWvIdrG6I0VxojwI', '2026-02-26 07:27:06', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('427de378-74e0-4269-808d-22264eb700da', '2026-02-18 21:43:55.267498', '2026-02-18 21:43:55.267498', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDMzNSwiZXhwIjoxNzcyMDM1MTM1fQ.DgzchToH2X_Ekpw33ewtnM_aD9Ixm65URH17_7RvD04', '2026-02-25 21:43:55', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('44c9240c-02eb-4e73-b3ab-62de3aef529a', '2026-02-18 21:53:22.190522', '2026-02-18 21:53:22.190522', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDkwMiwiZXhwIjoxNzcyMDM1NzAyfQ.QXxIFt6CdsRNUPqXKjGwRwdFDlW0Iz7CSBS6Ug3TlLg', '2026-02-25 21:53:22', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('4abb2b34-338e-4f6f-8804-3d621a8c2afc', '2026-02-19 07:33:40.819909', '2026-02-19 07:33:40.819909', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTcyMCwiZXhwIjoxNzcyMDcwNTIwfQ.YhWYjqA9O5HZCwQmbT8-M0g3ZJCzJu3H3Z2o-FCdOc0', '2026-02-26 07:33:41', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('4ed4c1e2-9d2e-40d1-8e6d-15c0e8a5b6e4', '2026-02-18 21:54:01.533764', '2026-02-18 21:54:01.533764', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDk0MSwiZXhwIjoxNzcyMDM1NzQxfQ.7_Y4Cwk7QAvkMKXl-gfZ9oP6fvQ-tfIxCGAWhjlaBvo', '2026-02-25 21:54:02', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('505ae183-e75a-42fd-9bc6-9fcf985f2c36', '2026-02-19 07:31:24.251464', '2026-02-19 07:31:24.251464', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTU4NCwiZXhwIjoxNzcyMDcwMzg0fQ.ez8mkBI9Dw2HHgz_IO2A6ggQop8gBbnTE5y2swZTbDU', '2026-02-26 07:31:24', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('51f5316d-7d47-4f81-be0c-cdedc901eb29', '2026-02-19 07:12:02.918816', '2026-02-19 07:12:02.918816', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDQyMiwiZXhwIjoxNzcyMDY5MjIyfQ.UtZh09Pf7HXv7dyV8ioTLMF97vgviOyfcjBEk8GWoi4', '2026-02-26 07:12:03', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('54f18a75-5893-4241-becf-f429a67fd5da', '2026-02-19 06:36:15.123904', '2026-02-19 07:03:26.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2MjI3NSwiZXhwIjoxNzcyMDY3MDc1fQ.fCkX5eo3pL2N_qxRy4p6DA5O05cO-RcMsXMKCSWd8BQ', '2026-02-26 06:36:15', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1),
('5887eb34-d44c-4b12-b87e-07d5caa864df', '2026-02-19 07:21:00.631033', '2026-02-19 07:21:00.631033', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDk2MCwiZXhwIjoxNzcyMDY5NzYwfQ.QNXWU_C89fkZ61ip2B0sgnI13DcB6EO2xc1DWEIqCMA', '2026-02-26 07:21:01', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('5af72cb3-f412-4bad-bcc3-cab48bacb68e', '2026-02-18 21:52:53.857480', '2026-02-18 21:52:53.857480', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDg3MywiZXhwIjoxNzcyMDM1NjczfQ.zw-5xdEBZH1tqFmidB5RRGW7VM_olHhCZ8HU8AzXOXU', '2026-02-25 21:52:54', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('604a267d-1bc0-4382-bdc9-3d482cd595cb', '2026-02-19 07:30:46.207964', '2026-02-19 07:30:46.207964', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTU0NiwiZXhwIjoxNzcyMDcwMzQ2fQ.vGcQlKovWFLX6zxI9e9Q4M58YtiOGoEAyDAnUIpfPHk', '2026-02-26 07:30:46', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('6575ec75-83c1-4275-b5a4-80d361ea440f', '2026-02-19 07:03:26.844166', '2026-02-20 06:33:47.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2MzkwNiwiZXhwIjoxNzcyMDY4NzA2fQ.ChfUchodDh25vKBg2SUGDMHU3qZtwE7-mSv_MSkbpPk', '2026-02-26 07:03:27', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1),
('6f56a445-1900-4a63-816f-1f99f53486fd', '2026-02-18 21:56:45.667189', '2026-02-18 21:56:45.667189', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMTEwNSwiZXhwIjoxNzcyMDM1OTA1fQ.0HlCI9CsyF1W07K9_ShJDQPKI7FnJGWOfOHVdfF3-Qo', '2026-02-25 21:56:46', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('735b1a90-a5d3-462f-b307-5d469acab958', '2026-02-23 07:01:43.054768', '2026-02-23 07:01:43.054768', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTgwOTQwMywiZXhwIjoxNzcyNDE0MjAzfQ.mOWEKgIsQS3rdVzALi00oKywI43IkIu8ThDCPf7F1e4', '2026-03-02 07:01:43', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'PostmanRuntime/7.49.1', 0),
('781bc24d-f76e-44dd-b200-491b3947b7fc', '2026-02-19 07:28:21.489255', '2026-02-19 07:28:21.489255', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTQwMSwiZXhwIjoxNzcyMDcwMjAxfQ.uYUd6RzUuy8OtFFzyyqPbGCgZcOq68rQelJyUvnoYFk', '2026-02-26 07:28:21', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('8477d11e-9191-4e39-b0e1-2a425bd412c7', '2026-02-18 21:51:31.724946', '2026-02-18 21:51:31.724946', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDc5MSwiZXhwIjoxNzcyMDM1NTkxfQ.hCyDda7nFeI54BSTGsOX6haCkQTwREy1DQGtD-vTVkA', '2026-02-25 21:51:32', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('8b657e4f-1922-478c-9b92-f2766d0d4389', '2026-02-20 07:25:03.122305', '2026-02-20 07:25:03.122305', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTU1MTYwMywiZXhwIjoxNzcyMTU2NDAzfQ.xh3B5ro0pWpjBdk144nQVypKVDC7Kv_b1UbHVUxmqHU', '2026-02-27 07:25:03', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('9517e4f4-e073-439a-b9cb-d0c3c814ba69', '2026-02-18 21:49:36.463747', '2026-02-18 21:49:36.463747', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDY3NiwiZXhwIjoxNzcyMDM1NDc2fQ.FADuEsVyaucLaiC1-wnpxaBlVH0XUK3Kofj1-PLMdWs', '2026-02-25 21:49:36', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('9c9e35c7-0c9b-4d16-8650-d03b375dabba', '2026-02-22 21:41:21.742641', '2026-02-22 21:41:21.742641', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTc3NTc4MSwiZXhwIjoxNzcyMzgwNTgxfQ.SpfZ5kDIAhquXrQpEWjj1Yd79qZ0BXM1F-IOde7fD6k', '2026-03-01 21:41:22', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 0),
('adbfbdb9-267f-48ca-aafc-7ccc8e1b91c9', '2026-02-18 21:51:12.917268', '2026-02-18 21:51:12.917268', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDc3MiwiZXhwIjoxNzcyMDM1NTcyfQ.Kg4bl70FckDrTtVg7ci3gLA0_4hz2ussQxSqc3m3alY', '2026-02-25 21:51:13', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('b7d5cd14-643f-40f4-a798-12c7aa4e921d', '2026-02-19 07:17:34.371131', '2026-02-19 07:17:34.371131', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDc1NCwiZXhwIjoxNzcyMDY5NTU0fQ.qcZKtrXHGWQK0dEftmFdqfu6DEn_QjxR_uEuBE2wKqk', '2026-02-26 07:17:34', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('c3b3d6d8-0706-4b78-bce8-3b32e5ca3f09', '2026-02-22 21:21:03.167041', '2026-02-22 21:38:38.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTc3NDU2MywiZXhwIjoxNzcyMzc5MzYzfQ.qqp9DLryxLOtrBtS6B3-bfgwjea6kWANNn0eQN1f5Io', '2026-03-01 21:21:03', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0', 1),
('c4433e05-5d89-4d54-9cd8-1bdca442aff9', '2026-02-18 21:45:16.940174', '2026-02-18 21:45:16.940174', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDQxNiwiZXhwIjoxNzcyMDM1MjE2fQ.goOJiWVNH9B47QNhV-0P043hMmdlydnjGi0knAOmWrM', '2026-02-25 21:45:17', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('c4a12d9b-14e6-419c-b037-4ecdd42c760e', '2026-02-19 07:17:57.836155', '2026-02-19 07:17:57.836155', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NDc3NywiZXhwIjoxNzcyMDY5NTc3fQ.VBCnG3KkIGw1ncdGPgP9rTf9PksC2B7CsfdK3WpUMSE', '2026-02-26 07:17:58', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('cb006f68-c01b-48eb-bd20-7c0893020569', '2026-02-18 21:48:57.443573', '2026-02-18 21:48:57.443573', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDYzNywiZXhwIjoxNzcyMDM1NDM3fQ.EWpIhE0cT2XOi2rPrtNqmiwN6a4v9n8GdhTOpGQ0tr8', '2026-02-25 21:48:57', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('daea3a49-4c97-4107-bbb2-fd95bb07e6c5', '2026-02-22 21:16:50.531713', '2026-02-22 21:16:50.531713', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTc3NDMxMCwiZXhwIjoxNzcyMzc5MTEwfQ.uBrMRwtwN-T17Pnfb7cI_Fi-ZULGm37nitanwgtIGUM', '2026-03-01 21:16:51', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', 0),
('de14c9de-18ff-4d24-aac5-35400fe5702d', '2026-02-18 21:44:55.395426', '2026-02-18 21:44:55.395426', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDM5NSwiZXhwIjoxNzcyMDM1MTk1fQ.qMt3dqJwu6xAlNWe2o3n8KatHbVinmZLsAner3VWKhw', '2026-02-25 21:44:55', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('e63229db-649d-48f5-8b01-6be59e87f25a', '2026-02-18 21:44:26.701779', '2026-02-18 21:44:26.701779', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDM2NiwiZXhwIjoxNzcyMDM1MTY2fQ.QE0nWMB50WnP6-ZHHYZsCgvITAr6gA_yRGCvlxlBsDI', '2026-02-25 21:44:27', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('eb0db8e1-9ed4-41e3-9661-f38a924e1182', '2026-02-18 21:48:06.504251', '2026-02-18 21:48:06.504251', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQzMDU4NiwiZXhwIjoxNzcyMDM1Mzg2fQ.8aRsImGzQU6aphnaKAiPO_ttL9tu4IzK43UrEzB0mxs', '2026-02-25 21:48:07', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('ed3cf8bc-5f6f-4862-aa7a-b7e8cd49ff79', '2026-02-19 07:30:13.617747', '2026-02-19 07:30:13.617747', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTUxMywiZXhwIjoxNzcyMDcwMzEzfQ.h-NTAvAilfzOS6TbgksAbMbrXAb_2aHKTi3QEeA9ULc', '2026-02-26 07:30:14', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('f47285b4-6cd4-4272-b991-ed47d7477d79', '2026-02-19 07:26:28.193513', '2026-02-19 07:26:28.193513', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTQ2NTI4OCwiZXhwIjoxNzcyMDcwMDg4fQ.odspazZH9L8EI4Mh2-GNp2D2RPHDurgBqZdFZUY-MTM', '2026-02-26 07:26:28', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::ffff:127.0.0.1', 'axios/1.13.5', 0),
('f8b967fa-f813-4065-aefe-76129ae38e97', '2026-02-20 06:33:47.959482', '2026-02-23 07:11:40.000000', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzMTY3ZTUyZC0wNWZhLTQyY2UtOTFlNy0xYjBiM2RmY2I4OWYiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MTU0ODUyNywiZXhwIjoxNzcyMTUzMzI3fQ.nWqvYLGzoLXhCDIhOBk9tuqZrG20VTXcLpZI42EXruk', '2026-02-27 06:33:48', '3167e52d-05fa-42ce-91e7-1b0b3dfcb89f', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 1);

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` varchar(36) NOT NULL,
  `version_id` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `name` varchar(150) NOT NULL,
  `role` varchar(100) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `socialLinks` json NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `designation_order` int NOT NULL DEFAULT '1',
  `designation_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `version_id`, `category_id`, `name`, `role`, `image_path`, `image_url`, `socialLinks`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `designation_order`, `designation_id`) VALUES
('81342f4b-aff4-42f4-a4dd-c5ef65042f0f', 'a20e1639-119e-4a91-bd70-5e1b4962dd18', 'b8ad5738-0cd2-47e8-b347-b401cbd4467a', 'string', 'string', '/public/assets/undefined/undefined/1771810328495-7c2e8ed6-0b14-4392-955c-d4b6261a56ec.webp', 'https://res.cloudinary.com/dmjgb9sfv/image/upload/v1771810331/assets/undefined/undefined/rrvfseakobfihsenb8kv.webp', '{\"linkedin\": \"https://linkedin.com/in/user\", \"instagram\": \"https://instagram.com/user\"}', '2026-02-23 07:17:12.747790', '2026-02-23 07:17:12.747790', NULL, NULL, 1, '135d2384-f07a-4a7b-be40-0a8bf415b49e');

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
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_b075a04749a5969dfa73f8e4db` (`version_id`),
  ADD KEY `IDX_80c1bc4ded05bd07883fffb30c` (`category_id`),
  ADD KEY `IDX_ca3eae89dcf20c9fd95bf7460a` (`id`),
  ADD KEY `IDX_33692aeb17710f5c6c8d58ee73` (`createdAt`),
  ADD KEY `IDX_b652f5b22b5487f4f1f1f9fbde` (`updatedAt`),
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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `about_sections`
--
ALTER TABLE `about_sections`
  ADD CONSTRAINT `FK_f2bc0c7b791530383185fa16e12` FOREIGN KEY (`flagship_event_version_id`) REFERENCES `flagship_event_versions` (`id`);

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
-- Constraints for table `faqs`
--
ALTER TABLE `faqs`
  ADD CONSTRAINT `FK_08afb9a6481ba19d5ff82c17546` FOREIGN KEY (`flagship_event_version_id`) REFERENCES `flagship_event_versions` (`id`);

--
-- Constraints for table `hero_sections`
--
ALTER TABLE `hero_sections`
  ADD CONSTRAINT `FK_6cce9bbd2662cf132bb5fd719be` FOREIGN KEY (`flagship_event_version_id`) REFERENCES `flagship_event_versions` (`id`);

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `FK_610102b60fea1455310ccd299de` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `FK_369d86343d1e0db80fb9ac9788a` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `FK_80c1bc4ded05bd07883fffb30c7` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `FK_b075a04749a5969dfa73f8e4db8` FOREIGN KEY (`version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
