-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 07, 2026 at 04:00 PM
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
('32a534a4-ed0f-4163-ab7f-80db81e5dd11', '2026-03-03 10:20:09.692210', '2026-03-03 10:20:09.692210', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjUwOSwiZXhwIjoxNzcyNTEzNDA5fQ.Ty-BEK82vUrnE4NpjFwM3EdC88yQnvVXFCexDM7gSaI', '2026-03-03 10:35:10', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('3a71e69b-ce5d-444b-a6f7-aad1476f9191', '2026-03-03 10:06:29.179161', '2026-03-03 10:06:29.179161', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTY4OSwiZXhwIjoxNzcyNTEyNTg5fQ.ulEjIOkZ-kfWpx0LGmetGnIv21nfilAJgml-3IHQUWw', '2026-03-03 10:21:29', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('3f77d26d-df5f-473d-bdb8-a2497d19e370', '2026-03-03 10:06:48.355894', '2026-03-03 10:06:48.355894', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTcwOCwiZXhwIjoxNzcyNTEyNjA4fQ.X8wMfo4hV0IuTEAy5MhC4QRuIJEX7cOKS0vrqOy9o-4', '2026-03-03 10:21:48', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('55ede1e0-9ca7-4e21-a42f-cc89ac88e122', '2026-03-03 10:05:05.221798', '2026-03-03 10:05:05.221798', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTYwNSwiZXhwIjoxNzcyNTEyNTA1fQ.ZzObYJLpoNJ7XcvL3EpOz4jmva1WEXqBG8ZL7zpa5i0', '2026-03-03 10:20:05', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('58b898c4-d886-4336-bbbb-dcd54d16cfc6', '2026-03-03 10:05:50.883482', '2026-03-03 10:05:50.883482', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTY1MCwiZXhwIjoxNzcyNTEyNTUwfQ.qSG_tSHRS-dcgZ7aYD1fLg8gJxn7T73KoQDJ3pgJVGs', '2026-03-03 10:20:51', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('62a07a9a-d507-4f55-90a7-05a4f3ac5e79', '2026-03-03 10:19:30.915608', '2026-03-03 10:19:30.915608', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjQ3MCwiZXhwIjoxNzcyNTEzMzcwfQ.ANPeLJPbsaEHpeTzYC80YdSAV2Nwyn6cxEH5QYr2yhU', '2026-03-03 10:34:31', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('6719398b-eed6-49c8-936e-c8f1ef69d60c', '2026-03-03 10:03:24.410028', '2026-03-03 10:03:24.410028', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTUwNCwiZXhwIjoxNzcyNTEyNDA0fQ.7NJI1Obrv57-98oAEylc4jtO1Lm4dxyigSx1kIhLnsE', '2026-03-03 10:18:24', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::1', 'curl/8.5.0', 0),
('67fe37d9-eebe-4dad-80ea-b51270f0e8fe', '2026-03-03 10:08:09.074551', '2026-03-03 10:08:09.074551', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTc4OSwiZXhwIjoxNzcyNTEyNjg5fQ.Ey0P-YXKAcLxWRZ4TSixxAIH3brfvU5H-vrmPE9bNSU', '2026-03-03 10:23:09', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('74a33a46-d30c-4878-ab8d-69f937629735', '2026-03-07 20:50:11.277689', '2026-03-07 20:50:11.277689', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3Mjg5NTkxMSwiZXhwIjoxNzcyODk2ODExfQ.yzs5Sf4vOGv3FP0tO1F8W_dx0m5z0d6G7qsl1BEusWE', '2026-03-07 21:05:11', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 0),
('854614db-f03a-4a7c-b96f-5a92a6d5410a', '2026-03-03 10:17:21.495827', '2026-03-03 10:17:21.495827', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjM0MSwiZXhwIjoxNzcyNTEzMjQxfQ.zCWe-0SEDSod3_bSVNm_Q-VfDAwKfIWCVSx-5AsAhP4', '2026-03-03 10:32:21', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('85afc09a-acf8-44b0-842a-aaaf7746a2cf', '2026-03-03 10:17:11.039693', '2026-03-03 10:17:11.039693', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjMzMSwiZXhwIjoxNzcyNTEzMjMxfQ.BOb0VIxokV4Q1F-uiyYglIboNUmgbfL2zsrEa0jXv1o', '2026-03-03 10:32:11', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('897b6721-3279-49bd-b614-2dc2211b2bf1', '2026-03-03 10:18:13.273780', '2026-03-03 10:18:13.273780', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjM5MywiZXhwIjoxNzcyNTEzMjkzfQ.f3V-cbUHhoPr9-GrezDr2SHD12_FIz_-xBJZ2cTqBsg', '2026-03-03 10:33:13', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('92bf68c1-2914-49d9-a9e2-49e5bb869453', '2026-03-03 10:04:39.497822', '2026-03-03 10:04:39.497822', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTU3OSwiZXhwIjoxNzcyNTEyNDc5fQ.IP23ZDcRUlJmAW3WT9dSiY2hSOoejTqEXb9IWqVAYpU', '2026-03-03 10:19:39', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('92e4db4d-c0c8-4c2f-bd70-bb01adefe024', '2026-03-03 10:08:50.371321', '2026-03-03 10:08:50.371321', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTgzMCwiZXhwIjoxNzcyNTEyNzMwfQ.OmxmtxyuFGAGx0pB-u7AP5G3SeD-qdOGDUPrdZZlrB8', '2026-03-03 10:23:50', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('940ec511-3c07-4358-a05e-1cd982df7015', '2026-03-03 10:09:11.124908', '2026-03-03 10:09:11.124908', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTg1MSwiZXhwIjoxNzcyNTEyNzUxfQ.HPI_ao2WHCzPCW0f7WgM4EykBJquzvKjL-hXXNddNkw', '2026-03-03 10:24:11', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('9d480a13-0c3d-4815-bf48-7affdf422af6', '2026-03-03 10:19:13.121804', '2026-03-03 10:19:13.121804', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjQ1MywiZXhwIjoxNzcyNTEzMzUzfQ.6qwZiYXNAbDAIySixVwzOdsOj3VSkDBs-Jtd67sPg1I', '2026-03-03 10:34:13', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('bd887b43-e2a9-4367-96e8-15eedce95e5a', '2026-03-03 10:06:12.818611', '2026-03-03 10:06:12.818611', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTY3MiwiZXhwIjoxNzcyNTEyNTcyfQ.xgeJeF_XOfND5fw3CEKwO1wWa_K_E2ecBnqcPy58lwU', '2026-03-03 10:21:13', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('c985fe66-faae-4cc5-ad50-71176b8686e1', '2026-03-03 10:20:19.680282', '2026-03-03 10:20:19.680282', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjUxOSwiZXhwIjoxNzcyNTEzNDE5fQ.po3vk9C5CwjcUJnWrEdNHSFIFt-xk5j-HDsi_jFn17E', '2026-03-03 10:35:20', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('d804d7eb-c129-4439-aaa1-0b1ab1d012d5', '2026-03-03 10:20:34.990119', '2026-03-03 10:20:34.990119', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjUzNCwiZXhwIjoxNzcyNTEzNDM0fQ.kdMYZEj7gcBmDO18AooHI4j5AF612JjW9vSF27cjgBw', '2026-03-03 10:35:35', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('da45b6cf-99d0-4bb1-9082-be688533abdc', '2026-03-03 10:09:30.714524', '2026-03-03 10:09:30.714524', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTg3MCwiZXhwIjoxNzcyNTEyNzcwfQ.PrSEPkWm9czUYdhqgSqtrThZxl_xMrYXIvoggCKytZ0', '2026-03-03 10:24:31', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('f52e7e61-0d2a-4b0b-85df-89cab0d90344', '2026-03-03 10:05:28.533527', '2026-03-03 10:05:28.533527', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTYyOCwiZXhwIjoxNzcyNTEyNTI4fQ.IPK-Y-XmpQgx5KweDzIsoa__hfouAhGS0paWtI8QOeY', '2026-03-03 10:20:29', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0);

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
('14602d20-ea4c-4470-ba52-c8f0651d25d9', '2026-03-07 20:50:11.313974', '2026-03-07 20:50:11.313974', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::1'),
('164392b9-eb63-4b61-a653-db6a2a9600bb', '2026-03-03 10:17:24.372246', '2026-03-03 10:17:24.372246', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 671aefad-5712-4f1d-8837-3d3029caed3a created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('1729bd09-ea06-43ea-b581-23e51688ff7d', '2026-03-03 10:05:28.565422', '2026-03-03 10:05:28.565422', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('176f0cd9-cbba-4dda-916a-3e033e4c5d47', '2026-03-03 10:20:14.422634', '2026-03-03 10:20:14.422634', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration aaf652e3-9576-405b-b7ba-a560641d3f94 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('1967860c-6b46-4984-a522-9e66a9798ca4', '2026-03-03 10:09:15.272408', '2026-03-03 10:09:15.272408', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration caa9ba36-f7b2-4667-9f65-46bdf4147ad0 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('1bd7962e-3f94-4d0b-80b8-4a3bf4d96ce4', '2026-03-03 10:08:50.421322', '2026-03-03 10:08:50.421322', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('1e64ed24-a427-4b76-8bf6-373702d23faa', '2026-03-03 10:09:33.748468', '2026-03-03 10:09:33.748468', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 3693f0f1-d48b-4e30-90ba-44595e9a5d6e created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('2171a367-d12f-4a19-b735-cfa5c222b2fc', '2026-03-03 10:03:25.661683', '2026-03-03 10:03:25.661683', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Flagship event version created successfully', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'flagship_event', '::1'),
('31ca1bf4-2b05-45ef-878c-45378345b40a', '2026-03-03 10:17:25.493167', '2026-03-03 10:17:25.493167', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 953b7303-9af4-425e-a907-9f6e3dc28978 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('32b34bfb-9ab0-4882-83ca-dfabd21c75f4', '2026-03-03 10:18:13.311100', '2026-03-03 10:18:13.311100', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('33f6b8ea-9a87-422e-a137-f1f02144ccd4', '2026-03-03 10:03:42.362258', '2026-03-03 10:03:42.362258', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Category 8356978b-f5f3-477e-93cb-798fc4e48375 created successfully', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'events', '::1'),
('3845da1f-3faf-46b2-a9dc-ea69bcee25c6', '2026-03-03 10:20:35.018568', '2026-03-03 10:20:35.018568', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('3974dc3c-0fa9-45d6-9304-62dc919d2c57', '2026-03-03 10:17:14.196313', '2026-03-03 10:17:14.196313', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration d376da8e-a244-44e8-8c41-5279ed5a521c created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', NULL),
('3a78932a-c3ae-4163-b294-90139cf51430', '2026-03-03 10:19:13.159998', '2026-03-03 10:19:13.159998', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('3cd82661-8c1f-4a70-9ff3-586f20980797', '2026-03-03 10:03:24.450192', '2026-03-03 10:03:24.450192', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::1'),
('4e7e5178-04fd-4b58-a21e-cc7ae0b81399', '2026-03-03 10:09:30.743266', '2026-03-03 10:09:30.743266', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('5c2366f4-463e-40ee-bf44-b144dbcaa03a', '2026-03-03 10:05:05.252931', '2026-03-03 10:05:05.252931', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('5f62a41c-f47e-4845-b319-131a377e8ab4', '2026-03-03 10:09:11.156815', '2026-03-03 10:09:11.156815', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('606a9557-1b3b-46a0-8d8d-b2f304b72a4f', '2026-03-03 10:08:09.115006', '2026-03-03 10:08:09.115006', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('61fea601-284b-4c0f-a712-501327cc124e', '2026-03-03 10:20:43.817716', '2026-03-03 10:20:43.817716', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'delete', 'Event Registration 0f1ce477-ec1b-4783-8d9f-9f654b0f95ca deleted successfully', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('7002dae6-bd26-4b18-a367-69ea3bddf731', '2026-03-03 10:06:48.385987', '2026-03-03 10:06:48.385987', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('73059f49-a02a-4aaf-9fae-f4135d32800c', '2026-03-03 10:06:51.415704', '2026-03-03 10:06:51.415704', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 825ca9a9-aeb6-4f51-ae62-50d027e333dc created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('7319f843-d7e7-4c28-80d2-1a82b8967179', '2026-03-03 10:19:32.352321', '2026-03-03 10:19:32.352321', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 7cdb89b5-2cb5-4882-a484-56d92b37e027 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('75276eef-687a-4962-95d1-50c529bb36f0', '2026-03-03 10:18:16.573687', '2026-03-03 10:18:16.573687', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration c2331d00-e9c2-4aa6-8e8a-2160077c40d3 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('7b0809a0-5b26-490a-a016-1014eaea5516', '2026-03-03 10:20:19.713589', '2026-03-03 10:20:19.713589', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('7dd49a37-64e7-48d8-8e2c-4f5476bf4d6f', '2026-03-03 10:19:16.440773', '2026-03-03 10:19:16.440773', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 29ceba43-dafc-453d-a6e4-27161512c6e0 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('873c2426-2201-4a6b-bbc4-8482834ec830', '2026-03-03 10:20:39.512989', '2026-03-03 10:20:39.512989', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 0f1ce477-ec1b-4783-8d9f-9f654b0f95ca created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('8c74a014-4921-468c-8db3-bc87ee6356f1', '2026-03-03 10:20:18.542898', '2026-03-03 10:20:18.542898', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'update', 'Event Registration 1af2ffdf-e384-4c17-b64b-e042316851c9 updated successfully', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('8c99c70c-be1e-4791-8513-5bd4c8cc0dd2', '2026-03-03 10:18:21.612470', '2026-03-03 10:18:21.612470', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'update', 'Event Registration 1af2ffdf-e384-4c17-b64b-e042316851c9 updated successfully', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('8d9c4f39-269e-4eee-84ed-4af55faad5d2', '2026-03-03 10:19:35.163017', '2026-03-03 10:19:35.163017', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration d538de01-502b-42dc-85db-acc29befc286 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('91b57dc1-3a3d-4c82-822c-7db97d5eb779', '2026-03-03 10:18:17.599765', '2026-03-03 10:18:17.599765', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 1f3be7bc-3f3f-4744-bc8b-4ed6a4c4f703 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('9350a25d-b46f-443e-8de2-b71d834b68cd', '2026-03-03 10:17:11.068937', '2026-03-03 10:17:11.068937', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('961085a5-e3b5-4cda-8450-c5197e43a666', '2026-03-03 10:09:14.102180', '2026-03-03 10:09:14.102180', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 1af2ffdf-e384-4c17-b64b-e042316851c9 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('9e574e88-ca8a-4e6e-aff6-890547856dca', '2026-03-03 10:04:20.574618', '2026-03-03 10:04:20.574618', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event f8b51ee0-1561-4d1e-9cd2-827ac6488a57 created successfully', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'events', '::1'),
('a15ea9cc-e399-4bda-b5cc-963b80087e85', '2026-03-03 10:20:13.231741', '2026-03-03 10:20:13.231741', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 1d90d02c-9f25-4676-bab3-a268a43bcd3a created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('a44866fd-4ee2-43ea-a20b-40519f999252', '2026-03-03 10:04:39.529656', '2026-03-03 10:04:39.529656', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('aa45e70a-9360-4260-82a2-3b42b63d82de', '2026-03-03 10:19:27.057408', '2026-03-03 10:19:27.057408', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'update', 'Event Registration 1af2ffdf-e384-4c17-b64b-e042316851c9 updated successfully', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('ac64132c-4591-4838-b417-1e457eb99596', '2026-03-03 10:19:30.944407', '2026-03-03 10:19:30.944407', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('cdd054be-44d1-460d-a394-3b8916dce541', '2026-03-03 10:20:22.182821', '2026-03-03 10:20:22.182821', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 4c134017-77b0-408a-8f23-f6cb9a7a3975 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('d6866b7f-28a6-4b81-b65b-4f08df7def24', '2026-03-03 10:19:23.752748', '2026-03-03 10:19:23.752748', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration ee517349-5156-4e1c-ac8e-4f51f94dda21 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('d968eec3-4681-4332-b6b6-e8b7eee817c6', '2026-03-03 10:20:38.141887', '2026-03-03 10:20:38.141887', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 8be0b889-6b21-46c3-83a1-fe0cf7e65417 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('d9c544a6-71e7-4595-b44a-1f4daf5eddca', '2026-03-03 10:06:52.424424', '2026-03-03 10:06:52.424424', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration d4a32fc0-a47c-4325-bc13-7bd901ec77b7 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('e882c7b6-4a61-4a90-acfd-411edbf3e12c', '2026-03-03 10:06:12.859390', '2026-03-03 10:06:12.859390', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('ea69d607-d6cc-40f6-99f8-cf3ae473f8f9', '2026-03-03 10:20:43.781132', '2026-03-03 10:20:43.781132', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'update', 'Event Registration 0f1ce477-ec1b-4783-8d9f-9f654b0f95ca updated successfully', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('ec8d77a3-51f1-4723-ac21-7992ce086300', '2026-03-03 10:17:21.526991', '2026-03-03 10:17:21.526991', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('f1e14551-ae0b-4bd2-9a5d-36fb548bc72e', '2026-03-03 10:05:50.915955', '2026-03-03 10:05:50.915955', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('f220ceb0-7c07-4a5a-a1ef-a964bd69c338', '2026-03-03 10:06:29.214164', '2026-03-03 10:06:29.214164', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('f30e8eb9-57c1-4e49-80c6-2f3330c981db', '2026-03-03 10:09:34.865910', '2026-03-03 10:09:34.865910', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 4fedfa97-c405-4551-b6a3-d701318b7567 created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1'),
('f8fd46f3-e63e-4b12-bda5-26852d99be95', '2026-03-03 10:20:09.730872', '2026-03-03 10:20:09.730872', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'login', 'User logged in successfully', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'users', '::ffff:127.0.0.1'),
('ff40e76e-41da-4d13-a1f2-48463e91a0a9', '2026-03-03 10:20:20.947711', '2026-03-03 10:20:20.947711', NULL, NULL, 'info', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'create', 'Event Registration 47133962-650f-4867-9615-da40e452714c created', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'event_registrations', '::ffff:127.0.0.1');

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
  `type` enum('teams','designations','events','speakers','sponsors') NOT NULL,
  `displayName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `display_order`, `type`, `displayName`) VALUES
('8356978b-f5f3-477e-93cb-798fc4e48375', 'Main Events', '2026-03-03 10:03:42.346417', '2026-03-03 10:03:42.346417', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', NULL, 1, 'events', 'Main Events');

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

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `description` varchar(255) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `date` date DEFAULT NULL,
  `category_id` varchar(36) NOT NULL,
  `version_id` varchar(36) NOT NULL,
  `speaker_id` varchar(36) DEFAULT NULL,
  `total_seats` int NOT NULL DEFAULT '0',
  `feeType` enum('free','paid') NOT NULL,
  `fee` decimal(10,2) NOT NULL,
  `location` varchar(255) NOT NULL,
  `status` enum('draft','published','archived') NOT NULL,
  `registration_deadline` timestamp NOT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `is_highlighted` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `title`, `description`, `image_path`, `start_time`, `end_time`, `date`, `category_id`, `version_id`, `speaker_id`, `total_seats`, `feeType`, `fee`, `location`, `status`, `registration_deadline`, `display_order`, `is_highlighted`) VALUES
('f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '2026-03-03 10:04:20.551270', '2026-03-03 10:04:20.551270', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', NULL, 'Tech Talk 1', 'A talk about AI', '/public/assets/ICT Meetup 2026/events/1772511557735-55850a3d-6a29-419b-9a3a-8457925ace7b.png', '10:00:00', '12:00:00', '2026-06-02', '8356978b-f5f3-477e-93cb-798fc4e48375', '5ce563bb-a5ef-414b-852e-af069acf55f4', NULL, 50, 'free', 0.00, 'Hall A', 'published', '2026-06-01 23:59:59', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `event_registration`
--

CREATE TABLE `event_registration` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `username` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contactNumber` varchar(150) NOT NULL,
  `isStudent` tinyint NOT NULL,
  `educationLevel` varchar(150) DEFAULT NULL,
  `faculty` varchar(150) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `attachedPaymentScreenshot` varchar(150) NOT NULL,
  `eventId` varchar(150) NOT NULL,
  `versionId` varchar(150) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL,
  `event_id` varchar(36) DEFAULT NULL,
  `version_id` varchar(36) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_registration`
--

INSERT INTO `event_registration` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `username`, `email`, `contactNumber`, `isStudent`, `educationLevel`, `faculty`, `year`, `attachedPaymentScreenshot`, `eventId`, `versionId`, `status`, `event_id`, `version_id`, `deleted_at`) VALUES
('0f1ce477-ec1b-4783-8d9f-9f654b0f95ca', '2026-03-03 10:20:39.502055', '2026-03-03 10:20:43.000000', NULL, NULL, 'professional_user', 'pro_1772512535043@example.com', '9812345678', 0, NULL, NULL, NULL, '/public/assets/ICT Meetup 2026/event-registrations/1772512538160-af360548-7b65-44b9-b8bc-e9ea25c69d66.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'approved', NULL, NULL, '2026-03-03 10:20:43.000000'),
('1af2ffdf-e384-4c17-b64b-e042316851c9', '2026-03-03 10:09:14.086702', '2026-03-03 10:18:21.000000', NULL, NULL, 'student_user', 'student_1772511851181@example.com', '9876543210', 1, 'Bachelor', 'Computer Science', 2024, '/public/assets/ICT Meetup 2026/event-registrations/1772511851200-018c459c-132e-4050-bc31-22f84d9cd2b6.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'approved', NULL, NULL, NULL),
('1d90d02c-9f25-4676-bab3-a268a43bcd3a', '2026-03-03 10:20:13.213124', '2026-03-03 10:20:13.213124', NULL, NULL, 'student_user', 'student_1772512509750@example.com', '9876543210', 1, 'Bachelor', 'Computer Science', 2024, '/public/assets/ICT Meetup 2026/event-registrations/1772512509770-3afb9339-0426-47aa-8175-6a3f32cda6ab.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('1f3be7bc-3f3f-4744-bc8b-4ed6a4c4f703', '2026-03-03 10:18:17.582896', '2026-03-03 10:18:17.582896', NULL, NULL, 'professional_user', 'pro_1772512393335@example.com', '9812345678', 0, NULL, NULL, NULL, '/public/assets/ICT Meetup 2026/event-registrations/1772512396593-1656288e-bc80-4d49-a5a7-6be75088d407.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('29ceba43-dafc-453d-a6e4-27161512c6e0', '2026-03-03 10:19:16.421952', '2026-03-03 10:19:16.421952', NULL, NULL, 'student_user', 'student_1772512453181@example.com', '9876543210', 1, 'Bachelor', 'Computer Science', 2024, '/public/assets/ICT Meetup 2026/event-registrations/1772512453198-a9570dcd-268b-4eb5-bcdc-874b9eff3cec.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('3693f0f1-d48b-4e30-90ba-44595e9a5d6e', '2026-03-03 10:09:33.737563', '2026-03-03 10:09:33.737563', NULL, NULL, 'student_user', 'student_1772511870763@example.com', '9876543210', 1, 'Bachelor', 'Computer Science', 2024, '/public/assets/ICT Meetup 2026/event-registrations/1772511870781-e8fe6e8b-edf5-47cd-9c28-edf831a6fba0.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('47133962-650f-4867-9615-da40e452714c', '2026-03-03 10:20:20.929371', '2026-03-03 10:20:20.929371', NULL, NULL, 'student_user', 'student_1772512519735@example.com', '9876543210', 1, 'Bachelor', 'Computer Science', 2024, '/public/assets/ICT Meetup 2026/event-registrations/1772512519746-73d2d772-86e8-46ea-944a-51db86eb8a6a.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('4c134017-77b0-408a-8f23-f6cb9a7a3975', '2026-03-03 10:20:22.164829', '2026-03-03 10:20:22.164829', NULL, NULL, 'professional_user', 'pro_1772512519735@example.com', '9812345678', 0, NULL, NULL, NULL, '/public/assets/ICT Meetup 2026/event-registrations/1772512520965-5b41f3cb-3617-47d9-963c-b6bb0188e41a.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('4fedfa97-c405-4551-b6a3-d701318b7567', '2026-03-03 10:09:34.848559', '2026-03-03 10:09:34.848559', NULL, NULL, 'professional_user', 'pro_1772511870763@example.com', '9812345678', 0, NULL, NULL, NULL, '/public/assets/ICT Meetup 2026/event-registrations/1772511873768-9c3af958-1300-44b2-8beb-1b793cf746d8.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('671aefad-5712-4f1d-8837-3d3029caed3a', '2026-03-03 10:17:24.353047', '2026-03-03 10:17:24.353047', NULL, NULL, 'student_user', 'student_1772512341544@example.com', '9876543210', 1, 'Bachelor', 'Computer Science', 2024, '/public/assets/ICT Meetup 2026/event-registrations/1772512341555-c4bbef5a-3a75-4bf3-9922-a81d52538cdd.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('7cdb89b5-2cb5-4882-a484-56d92b37e027', '2026-03-03 10:19:32.334964', '2026-03-03 10:19:32.334964', NULL, NULL, 'student_user', 'student_1772512470962@example.com', '9876543210', 1, 'Bachelor', 'Computer Science', 2024, '/public/assets/ICT Meetup 2026/event-registrations/1772512470974-b4efe683-7a15-4f00-a4da-140ca55a2494.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('825ca9a9-aeb6-4f51-ae62-50d027e333dc', '2026-03-03 10:06:51.393839', '2026-03-03 10:06:51.393839', NULL, NULL, 'student_user', 'student@example.com', '9876543210', 1, 'Bachelor', 'Computer Science', 2024, 'screenshot.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('8be0b889-6b21-46c3-83a1-fe0cf7e65417', '2026-03-03 10:20:38.130738', '2026-03-03 10:20:38.130738', NULL, NULL, 'student_user', 'student_1772512535043@example.com', '9876543210', 1, 'Bachelor', 'Computer Science', 2024, '/public/assets/ICT Meetup 2026/event-registrations/1772512535067-15247ae9-4fe4-497d-b9a2-552e092e419d.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('953b7303-9af4-425e-a907-9f6e3dc28978', '2026-03-03 10:17:25.474062', '2026-03-03 10:17:25.474062', NULL, NULL, 'professional_user', 'pro_1772512341544@example.com', '9812345678', 0, NULL, NULL, NULL, '/public/assets/ICT Meetup 2026/event-registrations/1772512344393-b8806065-248e-4aab-beea-7174492d5ec9.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('aaf652e3-9576-405b-b7ba-a560641d3f94', '2026-03-03 10:20:14.410111', '2026-03-03 10:20:14.410111', NULL, NULL, 'professional_user', 'pro_1772512509750@example.com', '9812345678', 0, NULL, NULL, NULL, '/public/assets/ICT Meetup 2026/event-registrations/1772512513250-88bdf9c2-8d45-4212-a840-c73c99eca7bb.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('c2331d00-e9c2-4aa6-8e8a-2160077c40d3', '2026-03-03 10:18:16.554270', '2026-03-03 10:18:16.554270', NULL, NULL, 'student_user', 'student_1772512393335@example.com', '9876543210', 1, 'Bachelor', 'Computer Science', 2024, '/public/assets/ICT Meetup 2026/event-registrations/1772512393358-da553da0-7bf6-4fdd-a74c-8c870eb12d94.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('caa9ba36-f7b2-4667-9f65-46bdf4147ad0', '2026-03-03 10:09:15.260074', '2026-03-03 10:09:15.260074', NULL, NULL, 'professional_user', 'pro_1772511851181@example.com', '9812345678', 0, NULL, NULL, NULL, '/public/assets/ICT Meetup 2026/event-registrations/1772511854123-fb3eac6f-be1e-4074-8e49-73eacfeede2d.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('d376da8e-a244-44e8-8c41-5279ed5a521c', '2026-03-03 10:17:14.185556', '2026-03-03 10:17:14.185556', NULL, NULL, 'student_user', 'student_1772512331090@example.com', '9876543210', 1, 'Bachelor', 'Computer Science', 2024, '/public/assets/ICT Meetup 2026/event-registrations/1772512331113-bf1349ad-d9a8-41ea-ab77-f02155e0521e.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('d4a32fc0-a47c-4325-bc13-7bd901ec77b7', '2026-03-03 10:06:52.412031', '2026-03-03 10:06:52.412031', NULL, NULL, 'professional_user', 'pro@example.com', '9812345678', 0, NULL, NULL, NULL, 'screenshot.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('d538de01-502b-42dc-85db-acc29befc286', '2026-03-03 10:19:35.143576', '2026-03-03 10:19:35.143576', NULL, NULL, 'professional_user', 'pro_1772512470962@example.com', '9812345678', 0, NULL, NULL, NULL, '/public/assets/ICT Meetup 2026/event-registrations/1772512472370-2625471c-e441-4749-a2ee-9e4dd3d8d5b6.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL),
('ee517349-5156-4e1c-ac8e-4f51f94dda21', '2026-03-03 10:19:23.737666', '2026-03-03 10:19:23.737666', NULL, NULL, 'professional_user', 'pro_1772512453181@example.com', '9812345678', 0, NULL, NULL, NULL, '/public/assets/ICT Meetup 2026/event-registrations/1772512456461-bd232b8f-4ae9-4aee-806c-75be1a3a2bed.png', 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57', '5ce563bb-a5ef-414b-852e-af069acf55f4', 'pending', NULL, NULL, NULL);

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
('5ce563bb-a5ef-414b-852e-af069acf55f4', '2026-03-03 10:03:25.651032', '2026-03-03 10:03:25.651032', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', 'ICT Meetup 2026', 'ict-meetup-2026', 1.0, 'active', '2026-06-01', '2026-06-05', 1, NULL);

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
(1, 1771808520235, 'AddDesignationTable1771808520235'),
(2, 1772449780055, 'NewMigration1772449780055');

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
('06397237-a705-4661-80a8-97cab1ad6203', '2026-03-03 10:06:48.371473', '2026-03-03 10:06:48.371473', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTcwOCwiZXhwIjoxNzczMTE2NTA4fQ.8KDfumHyqFpBg4miimVcLRsAah06dBwEMNJOWOM82A4', '2026-03-10 10:06:48', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('07b706d0-1cb1-40ea-b827-3d0a8c0731f6', '2026-03-03 10:20:09.715030', '2026-03-03 10:20:09.715030', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjUwOSwiZXhwIjoxNzczMTE3MzA5fQ.DZHJJWURtWaksnLWuoO50hWSIyRH2mw_ZabbDpsSO_k', '2026-03-10 10:20:10', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('0f2766b6-c109-45d0-ae99-e79ad7025f66', '2026-03-07 20:50:11.296579', '2026-03-07 20:50:11.296579', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3Mjg5NTkxMSwiZXhwIjoxNzczNTAwNzExfQ.VKzgiNPTKyz-dxTzQQNFIHdy6QYHolZt5ZawIOIKIJM', '2026-03-14 20:50:11', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 0),
('18f6c561-1185-43bf-a0af-c9b27297567f', '2026-03-03 10:17:11.054569', '2026-03-03 10:17:11.054569', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjMzMSwiZXhwIjoxNzczMTE3MTMxfQ.ig-qblfb2lrJ0aJvkbuWhSjntGpi021umaGqPLWS_4c', '2026-03-10 10:17:11', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('1bc214da-eeb0-461c-9e11-a3e86e97b2f5', '2026-03-03 10:08:50.399345', '2026-03-03 10:08:50.399345', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTgzMCwiZXhwIjoxNzczMTE2NjMwfQ.ikT7vhY7Rp7F_4EB7RcqMVmLuQ8WdVqQKwwNnGBVfC0', '2026-03-10 10:08:50', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('23c2a39a-12f6-40a6-9f93-ad543e2b6a22', '2026-03-03 10:18:13.298415', '2026-03-03 10:18:13.298415', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjM5MywiZXhwIjoxNzczMTE3MTkzfQ.-iFmsUk6HRbkjyRlk60PhzJ4teoW5illqiVKyfV_Z5k', '2026-03-10 10:18:13', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('2b9943ef-573f-4706-9825-ce3b5fe66d5b', '2026-03-03 10:09:11.141540', '2026-03-03 10:09:11.141540', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTg1MSwiZXhwIjoxNzczMTE2NjUxfQ.XKsQPzN4XHhPxgE5-iq6lHhaS5Id6tsQN8CwuLJMESo', '2026-03-10 10:09:11', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('56fe4497-8c12-4ab2-a709-d8846c6374e3', '2026-03-03 10:05:28.549815', '2026-03-03 10:05:28.549815', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTYyOCwiZXhwIjoxNzczMTE2NDI4fQ.WN4MVch6vXr17Po02jxUnlFToyZvJqrChVV5qDghG2w', '2026-03-10 10:05:29', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('5c61660a-cd94-443c-b3cf-dc14c58b2fda', '2026-03-03 10:08:09.100225', '2026-03-03 10:08:09.100225', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTc4OSwiZXhwIjoxNzczMTE2NTg5fQ.iJ5yK6v7R5RZlBU-zKBbUtJJ8UXitORaTOI4nGyMG0k', '2026-03-10 10:08:09', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('68ab2335-5e3c-496f-a819-5f5b41481391', '2026-03-03 10:05:05.237209', '2026-03-03 10:05:05.237209', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTYwNSwiZXhwIjoxNzczMTE2NDA1fQ.BihBmUCR_0EIBJ0kPPnxdWZVoPFI8wIeShoZEvUQw4g', '2026-03-10 10:05:05', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('6fc5ce90-741c-4e10-a3c3-e14cd6db59b1', '2026-03-03 10:20:35.005007', '2026-03-03 10:20:35.005007', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjUzNCwiZXhwIjoxNzczMTE3MzM0fQ.yzf-_R6cHq007OlFMkyUJjkz8rZUQOXTXBqLOizGwsQ', '2026-03-10 10:20:35', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('7d26bf0f-7a01-459d-aaae-f72647175a81', '2026-03-03 10:19:13.142953', '2026-03-03 10:19:13.142953', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjQ1MywiZXhwIjoxNzczMTE3MjUzfQ.8MI5_FF2ewYSwc-s6yvXH2q08iwMpQWxdYfdikwur2A', '2026-03-10 10:19:13', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('802b226e-35bb-46d3-ae5d-2456736f6367', '2026-03-03 10:06:29.200733', '2026-03-03 10:06:29.200733', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTY4OSwiZXhwIjoxNzczMTE2NDg5fQ.HmtE3P5nyN59z2nXIuSWcyKbASUyudGaQ0Or5O7tWKo', '2026-03-10 10:06:29', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('81e27846-e0db-4191-b0df-21d96d7d57b6', '2026-03-03 10:09:30.728280', '2026-03-03 10:09:30.728280', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTg3MCwiZXhwIjoxNzczMTE2NjcwfQ._pXLYJ8WAwGUe4gslRMfeClAsJ2HZCquYMPYZ9FbeMU', '2026-03-10 10:09:31', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('86e46747-fd1e-4d21-949b-d8f8dd28ce8f', '2026-03-03 10:19:30.933056', '2026-03-03 10:19:30.933056', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjQ3MCwiZXhwIjoxNzczMTE3MjcwfQ.HUWuFPxHp-V4lD84-Sf6N49pqthZexmsjuD__qDgEBQ', '2026-03-10 10:19:31', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('9728988d-d212-44e7-a4c2-12c693993e58', '2026-03-03 10:06:12.843938', '2026-03-03 10:06:12.843938', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTY3MiwiZXhwIjoxNzczMTE2NDcyfQ.Q22GWGPlWbOlIch-NCV40Pk4RHhgc0QqO9J9EIV3So0', '2026-03-10 10:06:13', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('b8ce1557-1c7a-42e5-9e50-db1316804dde', '2026-03-03 10:20:19.701583', '2026-03-03 10:20:19.701583', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjUxOSwiZXhwIjoxNzczMTE3MzE5fQ.fgrbvtj6aRmEYLqAFVRPBS4z_UVOe_CJGhZo4_gzRjo', '2026-03-10 10:20:20', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('c0162939-44bd-4e63-969f-15620350aed7', '2026-03-03 10:05:50.899128', '2026-03-03 10:05:50.899128', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTY1MCwiZXhwIjoxNzczMTE2NDUwfQ.gB0PKr1Ni6AjIrbxxu2CJL-cv_PRzP_ulgZ7hSTCp7k', '2026-03-10 10:05:51', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('cec5b2e6-e81d-4bba-80b5-4b9072cf85d5', '2026-03-03 10:04:39.515627', '2026-03-03 10:04:39.515627', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTU3OSwiZXhwIjoxNzczMTE2Mzc5fQ.-7uqvHoq6e-U0jEQzavAoZLR_oF5DZw8kT0jKUR1_oI', '2026-03-10 10:04:40', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('f68c3eec-3bd8-4aee-ab90-19be8befd3af', '2026-03-03 10:17:21.513151', '2026-03-03 10:17:21.513151', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMjM0MSwiZXhwIjoxNzczMTE3MTQxfQ.SdTQ8qopPaYm7qmPK_-7yESKB31CYNDXdwD00AJJmPA', '2026-03-10 10:17:22', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::ffff:127.0.0.1', 'node', 0),
('fd9c7bc9-b56b-4aa8-957c-753c83646b61', '2026-03-03 10:03:24.432736', '2026-03-03 10:03:24.432736', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlYWY2OGI2Zi0wYzcxLTQ4ZWItYThmMi1hODAxMzY3NTU1ZTEiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3MjUxMTUwNCwiZXhwIjoxNzczMTE2MzA0fQ.RWeFCJZQYYhu2gPGbEdJJ57LWNSVqhK5xXHg-UiL6e0', '2026-03-10 10:03:24', 'eaf68b6f-0c71-48eb-a8f2-a801367555e1', '::1', 'curl/8.5.0', 0);

-- --------------------------------------------------------

--
-- Table structure for table `speakers`
--

CREATE TABLE `speakers` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `designation` varchar(150) NOT NULL,
  `company` varchar(150) DEFAULT NULL,
  `version_id` varchar(36) NOT NULL,
  `category_id` varchar(36) NOT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `socialLinks` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sponsors`
--

CREATE TABLE `sponsors` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `version_id` varchar(255) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `name` varchar(150) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `category_id` varchar(36) NOT NULL,
  `display_order` int NOT NULL DEFAULT '0'
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
  `role` varchar(100) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `socialLinks` json NOT NULL,
  `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` varchar(36) DEFAULT NULL,
  `modifiedById` varchar(36) DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '1',
  `designation_id` varchar(255) NOT NULL
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
('eaf68b6f-0c71-48eb-a8f2-a801367555e1', '2026-03-03 10:03:17.092187', '2026-03-03 10:03:17.092187', NULL, NULL, 'creativehubadmin', 'creativehub@ictmeetup.com', '$2b$10$DfAPU/0wsi1wXjv38iKwfuNqQSrAVVRURvSp36zm5POBwZASMRadK', 'superadmin');

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
  ADD KEY `FK_0e21b8c3902f3487632401239db` (`version_id`),
  ADD KEY `FK_0dfe7e56f20f556e3f04ece9d91` (`category_id`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `FK_58145e5ce743859cc1e01cc8db8` FOREIGN KEY (`version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `FK_643188b30e049632f80367be4e1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `FK_815f74eeebec35f9c0ab96eb148` FOREIGN KEY (`speaker_id`) REFERENCES `speakers` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `event_registration`
--
ALTER TABLE `event_registration`
  ADD CONSTRAINT `FK_d42836e8ed00e2586af913934a6` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `FK_dd19c9aee647b85117cd6b14ac1` FOREIGN KEY (`version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE RESTRICT;

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
-- Constraints for table `speakers`
--
ALTER TABLE `speakers`
  ADD CONSTRAINT `FK_0dfe7e56f20f556e3f04ece9d91` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `FK_0e21b8c3902f3487632401239db` FOREIGN KEY (`version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `sponsors`
--
ALTER TABLE `sponsors`
  ADD CONSTRAINT `FK_675fa02095fef93fe312fd575db` FOREIGN KEY (`version_id`) REFERENCES `flagship_event_versions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_87cd36c0a72271648acaf04ad73` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT;

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
