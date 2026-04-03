-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2026 at 06:23 PM
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

--
-- Dumping data for table `about_sections`
--

INSERT INTO `about_sections` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `title`, `content`, `image_url`, `image_path`, `flagship_event_version_id`) VALUES
('fa6f5b8d-ab00-4884-8403-393edfa4a0d3', '2026-04-02 13:31:53.160848', '2026-04-02 13:31:53.160848', '8c9bbd1b-7d13-472f-9374-52074bde1225', NULL, 'What is Ict?', 'This year Ict', 'https://res.cloudinary.com/dmjgb9sfv/image/upload/v1775116011/assets/ict-meetup-v7/about-sections/mo98apti4qcuuumd8zj4.jpg', 'C:\\Users\\Mandip Shrestha\\Desktop\\ict-meetup-api\\public\\assets\\ict-meetup-v7\\about-sections\\1775116009702-85405efb-18a6-4477-8d41-bb01d83b2f40.jpeg', '7d286505-6579-4cf7-9f0e-03363c5a314f');

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

--
-- Dumping data for table `access_tokens`
--

INSERT INTO `access_tokens` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `token`, `expiresAt`, `userId`, `ipAddress`, `userAgent`, `isRevoked`) VALUES
('055e9aae-0c97-42e4-8e78-8bc49b569caa', '2026-04-02 13:55:42.216327', '2026-04-02 13:55:42.216327', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNzQ0MiwiZXhwIjoxNzc1MTE4MzQyfQ.dLSV9yN-248PO0LtN72leGM9ye585fOeW2snC0e4pt4', '2026-04-02 14:10:42', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('181ca273-9079-4641-899b-fa5278ef539e', '2026-04-02 12:59:43.718914', '2026-04-02 12:59:43.718914', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNDA4MywiZXhwIjoxNzc1MTE0OTgzfQ.ZNATUHeJE51z1DuQTrC1xNwp6BbFPU3g3KKz6lrWOdY', '2026-04-02 13:14:43', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('27b0d7a2-10cd-44a8-89db-95fbb9f2d69c', '2026-04-02 21:21:06.778677', '2026-04-02 21:21:06.778677', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NDE2NiwiZXhwIjoxNzc1MTQ1MDY2fQ.-lg2VRM25VeQdjDs_WGcmDTVvzeybbgZQu7OP6glf0o', '2026-04-02 21:36:06', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('2f65ebe1-c0a3-4a73-93f7-391335e76364', '2026-04-02 13:10:27.310672', '2026-04-02 13:10:27.310672', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNDcyNywiZXhwIjoxNzc1MTE1NjI3fQ.D68nfEY96o4j1F-R68ZOrA2xueMdrW9fTAv6y_efnQA', '2026-04-02 13:25:27', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('3c05f4b9-ae4a-4897-848d-98cf1a83d0ce', '2026-04-02 13:30:03.987330', '2026-04-02 13:30:03.987330', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNTkwMywiZXhwIjoxNzc1MTE2ODAzfQ.9Ls1ay_yumEeHecfcZui2NAKggkp9iJi1lOAgB8gdOw', '2026-04-02 13:45:03', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('49f8eeec-22c5-49b2-90fd-60615dec5900', '2026-04-02 21:40:25.279851', '2026-04-02 21:40:25.279851', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NTMyNSwiZXhwIjoxNzc1MTQ2MjI1fQ.zRgSCA1zMJnw4djcyatSI_uMx70WM-ZlUO67GLb5VyI', '2026-04-02 21:55:25', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('4b548d6a-815e-469b-926f-18d1337e41c8', '2026-04-02 13:07:43.392298', '2026-04-02 13:07:43.392298', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNDU2MywiZXhwIjoxNzc1MTE1NDYzfQ.hjMNZwvVBit9nkrw750nIND0DGmtD9a3vrsK6zK2_3E', '2026-04-02 13:22:43', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('4b961bfc-f019-4250-973a-c0d707418620', '2026-04-02 20:52:15.779768', '2026-04-02 20:52:15.779768', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0MjQzNSwiZXhwIjoxNzc1MTQzMzM1fQ.Cmam12kWejUz_nCwckBAeiXa0AxP0H9cGyV1y_iMTvE', '2026-04-02 21:07:15', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('6248d983-c1a1-4b52-8dce-76781207e412', '2026-04-02 12:52:28.968220', '2026-04-02 12:52:28.968220', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExMzY0OCwiZXhwIjoxNzc1MTE0NTQ4fQ.qduLiFgPkH3rx4MpsvDnkavzqQhYduZ1EFief74c3TU', '2026-04-02 13:07:28', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('62a87181-fa28-481d-b185-02517b786898', '2026-04-02 21:43:04.635902', '2026-04-02 21:43:04.635902', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NTQ4NCwiZXhwIjoxNzc1MTQ2Mzg0fQ.to5d_uoHByMviwWd0JBWXmpBG4M6ElJfB0j9em3eCl8', '2026-04-02 21:58:04', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('6f00c8c6-3909-441d-b81f-4839c1397564', '2026-04-02 20:34:53.529725', '2026-04-02 20:34:53.529725', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0MTM5MywiZXhwIjoxNzc1MTQyMjkzfQ.SexJ-5Zj6EBHr-NyCJNMuG58Mam0KkWBAq5NcftSiMI', '2026-04-02 20:49:53', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('79518c7e-92e5-42f6-a1e7-45baef155a8a', '2026-04-02 12:56:54.079330', '2026-04-02 12:56:54.079330', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExMzkxNCwiZXhwIjoxNzc1MTE0ODE0fQ.gGShtLpWzGPJ0gF1OH0zdSgVAFBmDk0y7alBjoTJThQ', '2026-04-02 13:11:54', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('82fdf9ed-8287-4448-8b05-72c4dc44508b', '2026-04-02 13:16:52.157191', '2026-04-02 13:16:52.157191', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNTExMiwiZXhwIjoxNzc1MTE2MDEyfQ.1Lc_T1i-sSo6ZjoGTaq5kljHMVn7eRC9pP-LZ2sO7wE', '2026-04-02 13:31:52', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('9043c792-c239-4597-8578-ce196cb0176b', '2026-04-02 11:29:25.772481', '2026-04-02 11:29:25.772481', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTEwODY2NSwiZXhwIjoxNzc1MTA5NTY1fQ.a1QL4TcoYCpd6E7p1a0JDjbe8VnZ0foG4JkD_Y8COhU', '2026-04-02 11:44:25', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('94754b99-6e84-474d-8067-92b92fcb1062', '2026-04-02 13:25:00.784090', '2026-04-02 13:25:00.784090', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNTYwMCwiZXhwIjoxNzc1MTE2NTAwfQ.WquKWZeuMCpQENsf6i4gk46yd82igDwydiCyAdQ3ZkI', '2026-04-02 13:40:00', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('a9469010-f1b6-4d76-be7d-9e1aa9e4f48a', '2026-04-02 12:54:43.654136', '2026-04-02 12:54:43.654136', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExMzc4MywiZXhwIjoxNzc1MTE0NjgzfQ.p8Jb9yAvwhVOLiIkdCKMV0ua6fwBTfmQHCbrnAUeuRI', '2026-04-02 13:09:43', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('acfe3275-4799-4d5f-be41-2b3f6a2462f8', '2026-04-02 21:59:39.651052', '2026-04-02 21:59:39.651052', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NjQ3OSwiZXhwIjoxNzc1MTQ3Mzc5fQ.1MDh0noyjwlpQlcAa2hWVbMnI8GgO9VPf3Y-Z3vuaw4', '2026-04-02 22:14:39', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('aed055af-1e83-4c9f-a9ee-759b5285d7fb', '2026-04-02 13:43:10.466073', '2026-04-02 13:43:10.466073', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNjY5MCwiZXhwIjoxNzc1MTE3NTkwfQ.J4GweDCDEbw9Z9-lsjCRx7kwOVN5cW87ASyQETeGmMA', '2026-04-02 13:58:10', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('aef86d79-ce4e-4c90-a89a-e242ea42f3e4', '2026-04-02 21:23:10.116532', '2026-04-02 21:23:10.116532', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NDI5MCwiZXhwIjoxNzc1MTQ1MTkwfQ.LmbkCsouvUlclGb9pSFI1dDKnOfLPzBHp2fHaHHlgY0', '2026-04-02 21:38:10', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('c122ea12-fa2e-42ba-aad5-23cfd1a12765', '2026-04-02 13:28:34.335958', '2026-04-02 13:28:34.335958', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNTgxNCwiZXhwIjoxNzc1MTE2NzE0fQ.wuXcfH6zQ_lbcNS91skrbc4DnyMUNHBkEYp8_Dfxwvc', '2026-04-02 13:43:34', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('c3410113-0738-4492-8dcf-42c67f2d2d83', '2026-04-02 13:34:31.833751', '2026-04-02 13:34:31.833751', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNjE3MSwiZXhwIjoxNzc1MTE3MDcxfQ.yw9j0fMifEYChUozLtlECL8X9HMcWttB0B6RWodeHxQ', '2026-04-02 13:49:31', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('e7e25cb0-a3a3-4c64-88cf-14236b1e60ee', '2026-04-02 20:39:17.502893', '2026-04-02 20:39:17.502893', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0MTY1NywiZXhwIjoxNzc1MTQyNTU3fQ.ohTGfOaRRvjwqjuZ6uGvIm-xI1kH5U0HorPIFRCCtxI', '2026-04-02 20:54:17', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('f2370409-cbfe-4510-a1e2-89491fa5ea17', '2026-04-02 21:56:12.366675', '2026-04-02 21:56:12.366675', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NjI3MiwiZXhwIjoxNzc1MTQ3MTcyfQ.oHn4F0CupOf3IMw-a_qXMP5B7-tC-6IVj078AhThwDs', '2026-04-02 22:11:12', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0);

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

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `logType`, `userId`, `logActionType`, `message`, `versionId`, `scope`, `ipAddress`) VALUES
('01cd2b80-dc5c-4915-8e4a-e63c1541410d', '2026-04-02 13:34:31.854689', '2026-04-02 13:34:31.854689', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('059a509e-19fd-4f72-858c-71bdd76c39ad', '2026-04-02 13:28:34.361577', '2026-04-02 13:28:34.361577', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('0e5e5dcf-0b8b-4187-85ca-d31ca11b6485', '2026-04-02 21:46:20.762163', '2026-04-02 21:46:20.762163', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'update', 'Flagship event version updated successfully', '146aad9c-2203-4ce4-b38f-247676349a02', 'flagship_event', '::1'),
('0f160535-aaa9-435d-b7d2-ba16b426388d', '2026-04-02 21:23:10.173705', '2026-04-02 21:23:10.173705', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('1571490d-2bec-4765-9aed-f820778f9028', '2026-04-02 20:39:17.576916', '2026-04-02 20:39:17.576916', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('1f4066f1-bff8-4166-b9f9-c52e5e55ccf9', '2026-04-02 13:30:04.011021', '2026-04-02 13:30:04.011021', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('23de18b9-9009-4137-8be7-cbaa1a9492fc', '2026-04-02 20:55:12.107102', '2026-04-02 20:55:12.107102', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'update', 'Flagship event version updated successfully', '4dbb52af-4318-4a4d-9c7c-761f9a01a4ec', 'flagship_event', '::1'),
('27480917-a53d-4177-9b69-6560a62ea564', '2026-04-02 13:25:00.817441', '2026-04-02 13:25:00.817441', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('2782f878-272e-46a8-b067-a2c66a92065c', '2026-04-02 21:41:01.157734', '2026-04-02 21:41:01.157734', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Flagship event version created successfully', 'a47bfe45-08d5-42aa-91e0-fb76b45832b3', 'flagship_event', '::1'),
('356e2dfd-3c28-4105-a7bb-0ba43e7700d3', '2026-04-02 20:42:03.856168', '2026-04-02 20:42:03.856168', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'delete', 'Sponsor 04df59ed-fe57-453f-87b7-595a41f30a7d deleted successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'sponsors', '::1'),
('388233c8-fcd0-4be6-bf29-17f8b3ee09ca', '2026-04-02 11:29:25.800148', '2026-04-02 11:29:25.800148', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('3b08f55b-8b9c-44a6-b3fc-0c12248383d0', '2026-04-02 12:54:43.702498', '2026-04-02 12:54:43.702498', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('414830d6-4626-4fae-b628-c6a2233cda97', '2026-04-02 12:52:29.007334', '2026-04-02 12:52:29.007334', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('41def24b-6817-48c0-a634-2fc87b6a87e8', '2026-04-02 20:53:02.387369', '2026-04-02 20:53:02.387369', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Flagship event version created successfully', '4dbb52af-4318-4a4d-9c7c-761f9a01a4ec', 'flagship_event', '::1'),
('47a779f5-9929-4c35-9833-a6f5ea3d69a5', '2026-04-02 13:31:43.928252', '2026-04-02 13:31:43.928252', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'delete', 'About section deleted successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'about_sections', '::1'),
('4817d85a-8a8f-4889-864a-bcbfb7c86290', '2026-04-02 13:55:42.245640', '2026-04-02 13:55:42.245640', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('51d48c7f-b94a-4a74-953b-c1e639eeacab', '2026-04-02 12:56:54.118450', '2026-04-02 12:56:54.118450', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('5516004c-dd85-46b3-a634-b25501205108', '2026-04-02 20:41:26.408997', '2026-04-02 20:41:26.408997', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'update', 'Sponsor 04df59ed-fe57-453f-87b7-595a41f30a7d updated successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'sponsors', '::1'),
('585403ad-2596-4437-bb04-6f2b97b10f5b', '2026-04-02 20:34:53.608653', '2026-04-02 20:34:53.608653', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('59ecb115-5439-4d8c-a2f9-eaf7020d3924', '2026-04-02 21:40:25.341046', '2026-04-02 21:40:25.341046', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('5a1dd461-635d-46bb-b937-643c9116cfd6', '2026-04-02 21:23:56.999933', '2026-04-02 21:23:56.999933', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Sponsor category 876ef7d1-5d29-4868-a6b5-e8f529af6ccd created successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'sponsors', '::1'),
('65463b3f-2b21-4b7c-bae5-0fa3a4ae8fee', '2026-04-02 21:56:12.429673', '2026-04-02 21:56:12.429673', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('704efcaf-4d81-4bf4-be5a-b77d220468e6', '2026-04-02 20:43:13.101124', '2026-04-02 20:43:13.101124', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'update', 'Sponsor category 138c956a-29a2-4fed-864d-1ce1d99b818c updated successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'sponsors', '::1'),
('759476ae-1cb4-4d2e-986c-226c28632f67', '2026-04-02 21:24:34.558499', '2026-04-02 21:24:34.558499', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Sponsor 16ddbfad-0c14-433e-968c-7e8a30b37bff created successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'sponsors', '::1'),
('82a3d4a4-e601-4df6-9e01-46f77078fb49', '2026-04-02 20:55:27.331228', '2026-04-02 20:55:27.331228', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'delete', 'Flagship event version deleted successfully', '4dbb52af-4318-4a4d-9c7c-761f9a01a4ec', 'flagship_event', '::1'),
('84ec7f0f-a94f-472b-bb2a-938085319d85', '2026-04-02 20:54:38.767843', '2026-04-02 20:54:38.767843', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'delete', 'Flagship event version deleted successfully', '321b930f-b315-4d1c-80d9-5ce57d0eff5e', 'flagship_event', '::1'),
('87c6d512-d57e-4b29-bebe-e8492d5f5bae', '2026-04-02 21:27:10.101059', '2026-04-02 21:27:10.101059', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Sponsor 80b78e3d-7608-4021-bb2c-03a921c8326f created successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'sponsors', '::1'),
('883d86d3-748d-4635-a7d5-81bb472a29fd', '2026-04-02 21:41:14.548089', '2026-04-02 21:41:14.548089', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'delete', 'Flagship event version deleted successfully', 'a47bfe45-08d5-42aa-91e0-fb76b45832b3', 'flagship_event', '::1'),
('9771ac97-fe79-4af3-b4d3-6c599c602847', '2026-04-02 21:21:06.845185', '2026-04-02 21:21:06.845185', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('99266ce3-7ad4-433f-bb8f-6e24ca332abd', '2026-04-02 20:43:33.118588', '2026-04-02 20:43:33.118588', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'delete', 'Sponsor category 138c956a-29a2-4fed-864d-1ce1d99b818c deleted successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'sponsors', '::1'),
('99504595-bed3-4749-a332-e80068981157', '2026-04-02 21:45:41.583336', '2026-04-02 21:45:41.583336', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Flagship event version created successfully', '146aad9c-2203-4ce4-b38f-247676349a02', 'flagship_event', '::1'),
('996d6eda-0caa-48b5-8f25-f16d5d3c3cd1', '2026-04-02 20:52:15.834153', '2026-04-02 20:52:15.834153', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('9c2fb8c9-d98f-4986-87bf-387b280ab29b', '2026-04-02 13:07:43.431040', '2026-04-02 13:07:43.431040', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('9d5e04d9-95fc-489e-88e8-e992deaaba23', '2026-04-02 22:04:40.141678', '2026-04-02 22:04:40.141678', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'update', 'Flagship event version updated successfully', '559b25e2-8eca-4cc4-961e-3bfc6495b5c0', 'flagship_event', '::1'),
('9dea10e8-edea-4904-b4c6-df478850f512', '2026-04-02 21:59:39.701721', '2026-04-02 21:59:39.701721', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('a23b39b3-bc54-4f05-9ab6-791a4c4396e3', '2026-04-02 13:35:18.098616', '2026-04-02 13:35:18.098616', NULL, NULL, 'info', 'system', 'create', 'Faq created successfully', 'ffeca256-fa86-4ec1-a179-d14f4e8aa5c4', 'faq', '::1'),
('a3b1bbb7-2e51-4121-b51e-ff4d2a47c5fe', '2026-04-02 12:59:43.756270', '2026-04-02 12:59:43.756270', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('a7ab637a-fc4d-4329-93ee-b688ad8691fa', '2026-04-02 21:43:04.707449', '2026-04-02 21:43:04.707449', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::ffff:127.0.0.1'),
('b43c9a12-dd61-48d0-9a65-a5b1b44f092f', '2026-04-02 21:46:25.179962', '2026-04-02 21:46:25.179962', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'delete', 'Flagship event version deleted successfully', '146aad9c-2203-4ce4-b38f-247676349a02', 'flagship_event', '::1'),
('b6271998-7fe7-4490-a8bd-92a46638dd43', '2026-04-02 13:10:27.343174', '2026-04-02 13:10:27.343174', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('b9e618fe-bfe0-426f-9a16-99e454c144eb', '2026-04-02 21:25:08.393180', '2026-04-02 21:25:08.393180', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'delete', 'Sponsor 16ddbfad-0c14-433e-968c-7e8a30b37bff deleted successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'sponsors', '::1'),
('bb5621ed-6bc9-4e39-8d8d-5950860778d9', '2026-04-02 13:36:33.682890', '2026-04-02 13:36:33.682890', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Sponsor category 138c956a-29a2-4fed-864d-1ce1d99b818c created successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'sponsors', '::1'),
('c2138341-fb49-4464-96ab-502d68d5c709', '2026-04-02 22:05:07.086984', '2026-04-02 22:05:07.086984', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'delete', 'Flagship event version deleted successfully', '559b25e2-8eca-4cc4-961e-3bfc6495b5c0', 'flagship_event', '::1'),
('d669eb91-abde-4cfb-9e4d-b036f3457708', '2026-04-02 21:43:32.414242', '2026-04-02 21:43:32.414242', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Flagship event version created successfully', 'a5a030a3-2f08-44de-9bff-06e9c49b89d8', 'flagship_event', '::1'),
('dbf29289-4400-4bac-9510-7e3ed6bbf6a8', '2026-04-02 13:31:53.172191', '2026-04-02 13:31:53.172191', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'About section created successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'about_sections', '::1'),
('e092bd98-1a76-4d02-8394-a56bc6fbdbf8', '2026-04-02 13:25:29.341413', '2026-04-02 13:25:29.341413', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Flagship event version created successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'flagship_event', '::1'),
('e34733e5-fd6d-4cfd-8e38-9e722dd7d056', '2026-04-02 13:43:10.501780', '2026-04-02 13:43:10.501780', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('ece8e239-b133-4050-900c-13cc2a801064', '2026-04-02 22:01:51.614757', '2026-04-02 22:01:51.614757', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Flagship event version created successfully', '559b25e2-8eca-4cc4-961e-3bfc6495b5c0', 'flagship_event', '::1'),
('f069e0bc-e937-4fe6-aa5d-04b6cc2bf6f7', '2026-04-02 13:29:04.545478', '2026-04-02 13:29:04.545478', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'About section created successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'about_sections', '::1'),
('f973f347-62b6-4a25-9ace-6a0525a88558', '2026-04-02 20:40:15.637893', '2026-04-02 20:40:15.637893', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Sponsor 04df59ed-fe57-453f-87b7-595a41f30a7d created successfully', '7d286505-6579-4cf7-9f0e-03363c5a314f', 'sponsors', '::1'),
('fb13d3dd-758a-4312-b138-f43d98ac7c2a', '2026-04-02 13:16:52.178233', '2026-04-02 13:16:52.178233', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'login', 'User logged in successfully', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'users', '::1'),
('fc3a1000-3943-46d3-a79d-bb0338ce6c2a', '2026-04-02 20:54:13.169877', '2026-04-02 20:54:13.169877', NULL, NULL, 'info', '8c9bbd1b-7d13-472f-9374-52074bde1225', 'create', 'Flagship event version created successfully', '321b930f-b315-4d1c-80d9-5ce57d0eff5e', 'flagship_event', '::1');

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

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `type`, `name`, `displayName`, `display_order`) VALUES
('876ef7d1-5d29-4868-a6b5-e8f529af6ccd', '2026-04-02 21:23:56.981921', '2026-04-02 21:23:56.981921', '8c9bbd1b-7d13-472f-9374-52074bde1225', NULL, 'sponsors', 'Platinum', 'string', 1);

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

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `title`, `description`, `flagship_event_version_id`) VALUES
('ffeca256-fa86-4ec1-a179-d14f4e8aa5c4', '2026-04-02 13:35:18.086558', '2026-04-02 13:35:18.086558', 'system', NULL, 'What is ICT?', 'This year iCT', '7d286505-6579-4cf7-9f0e-03363c5a314f');

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

--
-- Dumping data for table `flagship_event_versions`
--

INSERT INTO `flagship_event_versions` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `version_name`, `slug`, `version_number`, `status`, `start_date`, `end_date`, `is_current`, `logo`) VALUES
('7d286505-6579-4cf7-9f0e-03363c5a314f', '2026-04-02 13:25:29.331344', '2026-04-02 20:53:02.000000', '8c9bbd1b-7d13-472f-9374-52074bde1225', NULL, 'ict-meetup-v7', 'string', 7.0, 'archived', '2026-04-02', '2026-04-12', 0, ''),
('a5a030a3-2f08-44de-9bff-06e9c49b89d8', '2026-04-02 21:43:32.392857', '2026-04-02 21:45:41.000000', '8c9bbd1b-7d13-472f-9374-52074bde1225', NULL, 'ictmeetuop', 'stringsss', 2.0, 'archived', '2026-04-02', '2026-04-12', 0, '');

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

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1, 1775108573553, ' $npmConfigName1775108573553'),
(2, 1775109549208, ' $npmConfigName1775109549208'),
(3, 1775113247263, ' $npmConfigName1775113247263'),
(4, 1775114521922, ' $npmConfigName1775114521922'),
(5, 1775115487979, ' $npmConfigName1775115487979'),
(6, 1775143058036, ' $npmConfigName1775143058036'),
(7, 1775146203593, ' $npmConfigName1775146203593');

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

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `token`, `expiresAt`, `userId`, `ipAddress`, `userAgent`, `isRevoked`) VALUES
('02a438b6-c657-44ce-84d8-b250a27e9edc', '2026-04-02 21:59:39.680465', '2026-04-02 21:59:39.680465', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NjQ3OSwiZXhwIjoxNzc1NzUxMjc5fQ.rOfE322t4HKgDv3fLZbTguQygCbhJjYcdM8ZYb4WsJA', '2026-04-09 21:59:39', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('14edbe23-8879-49ab-bca2-a4ef57abd2ef', '2026-04-02 13:43:10.484389', '2026-04-02 13:43:10.484389', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNjY5MCwiZXhwIjoxNzc1NzIxNDkwfQ.uM1837tTwv2BUps9FTTT8dIF_xll9sloi6UwGlQWU_U', '2026-04-09 13:43:10', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('1cd85cc1-c072-461d-b9aa-21ab44d81aa6', '2026-04-02 13:55:42.232502', '2026-04-02 13:55:42.232502', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNzQ0MiwiZXhwIjoxNzc1NzIyMjQyfQ.WqzbtpfuDzKkdmDKYVNBabcgOXHIhf0LJM7JfZCX9OM', '2026-04-09 13:55:42', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('21b7bd8e-e8ac-4485-8c43-804658f0f3dd', '2026-04-02 13:16:52.169675', '2026-04-02 13:16:52.169675', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNTExMiwiZXhwIjoxNzc1NzE5OTEyfQ.ZZvZdcAa9orpz5bc8gX37nTABXi_SYHJdtiOIjsuQlo', '2026-04-09 13:16:52', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('3822c14b-2f0e-4699-a6e8-796ded5ee014', '2026-04-02 21:23:10.147205', '2026-04-02 21:23:10.147205', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NDI5MCwiZXhwIjoxNzc1NzQ5MDkwfQ.DivtywhcvR2El-2w6_lnjGriFlwxLF__9zUdnlbeoIE', '2026-04-09 21:23:10', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('3a4ef1e4-2963-4437-b9a4-31cca2675f97', '2026-04-02 12:54:43.681404', '2026-04-02 12:54:43.681404', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExMzc4MywiZXhwIjoxNzc1NzE4NTgzfQ.4EfZiRj3RXCquk5Eaz6nwkKklJKRQ4UA1gofHdSAqwA', '2026-04-09 12:54:43', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('441d9316-ca3f-4ff8-8857-4d3eb4de3ab7', '2026-04-02 12:52:28.993343', '2026-04-02 12:52:28.993343', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExMzY0OCwiZXhwIjoxNzc1NzE4NDQ4fQ.wbrWSSZfXIngvrAqDqfnrcw3UBwpvcA696rBIOlSv5g', '2026-04-09 12:52:28', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('45cf86bc-5780-4200-9d06-ee5b864bfc17', '2026-04-02 21:21:06.820016', '2026-04-02 21:21:06.820016', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NDE2NiwiZXhwIjoxNzc1NzQ4OTY2fQ.hsw3-HvbuYN4_ZnH3lZzp_4_573kSVnIa3nibw8IVnk', '2026-04-09 21:21:06', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('48a998d4-fdd6-4dba-9330-a597bc7241d0', '2026-04-02 13:34:31.843943', '2026-04-02 13:34:31.843943', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNjE3MSwiZXhwIjoxNzc1NzIwOTcxfQ.8Lz1aovdW15K9PLE1QqLVpRCqK0ZMd4x1tnfvhNxjfY', '2026-04-09 13:34:31', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('57de7293-317f-4b1c-b1a9-8462535d2e60', '2026-04-02 13:30:04.000084', '2026-04-02 13:30:04.000084', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNTkwMywiZXhwIjoxNzc1NzIwNzAzfQ.Vbe9UM6iCj2gFDw5Qoi6SUw_5T0jDU62t4V8EdwcsOs', '2026-04-09 13:30:03', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('6b3d7f57-9443-4801-bf15-8a8f6b720289', '2026-04-02 21:40:25.312481', '2026-04-02 21:40:25.312481', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NTMyNSwiZXhwIjoxNzc1NzUwMTI1fQ.jpjna-ZHGIDxIqQ8FMfArna8sPR_CMeNm4iUj3JguLk', '2026-04-09 21:40:25', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('6e5cdcff-9f46-41d1-bfed-a54fd986cc14', '2026-04-02 21:56:12.400283', '2026-04-02 21:56:12.400283', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NjI3MiwiZXhwIjoxNzc1NzUxMDcyfQ.IfSOm0BrKsWSpxcUgSrMGo7MEMJNpdmAggVs7wNlFGM', '2026-04-09 21:56:12', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('714967b0-623d-4877-a84e-8c679bd3b4d3', '2026-04-02 11:29:25.784736', '2026-04-02 11:29:25.784736', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTEwODY2NSwiZXhwIjoxNzc1NzEzNDY1fQ.yHPNYkIQrJwQftnV24l3M5964p_FJ8d0-hlB0pfXg28', '2026-04-09 11:29:25', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('7194eaa2-ec17-442c-94f5-41d06c827ce5', '2026-04-02 20:39:17.547483', '2026-04-02 20:39:17.547483', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0MTY1NywiZXhwIjoxNzc1NzQ2NDU3fQ.6sxgukB0YFgngibu1hp5QLHomDvGEHNwQTtuatrGzfw', '2026-04-09 20:39:17', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('75aad1d0-6f22-4b58-b0a7-f4bcbc568522', '2026-04-02 12:59:43.743368', '2026-04-02 12:59:43.743368', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNDA4MywiZXhwIjoxNzc1NzE4ODgzfQ.iwFuQmMU3Xh0sz2ImuPyO6sTQCldnX8ccH7XdRJrBqg', '2026-04-09 12:59:43', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('7b497dc0-d328-4085-99db-1e08e3348abd', '2026-04-02 13:28:34.348903', '2026-04-02 13:28:34.348903', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNTgxNCwiZXhwIjoxNzc1NzIwNjE0fQ.iB_5MEymKaDqk792AquHUqcqPl19pWRLYiFWiYnPoNk', '2026-04-09 13:28:34', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('8934cb1d-bc09-48cc-bfce-727006eb2e49', '2026-04-02 12:56:54.100857', '2026-04-02 12:56:54.100857', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExMzkxNCwiZXhwIjoxNzc1NzE4NzE0fQ.hmEtm8Lwte3WfCogEHz2q56muRBoAoSYZnJGPipuuh4', '2026-04-09 12:56:54', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('8d26b36f-da47-4676-8e42-e1418436f975', '2026-04-02 13:07:43.416264', '2026-04-02 13:07:43.416264', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNDU2MywiZXhwIjoxNzc1NzE5MzYzfQ.QxmGUfsBtFeoYG_TC2bp-X-7OZr-CTtQoenWkCYTsxc', '2026-04-09 13:07:43', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('9afa3034-c51e-4ff1-9a3a-2d430f574383', '2026-04-02 13:10:27.330111', '2026-04-02 13:10:27.330111', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNDcyNywiZXhwIjoxNzc1NzE5NTI3fQ.NEz8GwGyfoXXhYTReJbAa8QnnPtI6eEyjhAyfwOjNjY', '2026-04-09 13:10:27', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('b0f4b086-37cf-4cca-b3d8-074431a79164', '2026-04-02 20:52:15.809163', '2026-04-02 20:52:15.809163', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0MjQzNSwiZXhwIjoxNzc1NzQ3MjM1fQ.kyAjfQ0q0KH7Y9vdtCLdGoti81mgAJVHCcCBvQ-XmlY', '2026-04-09 20:52:15', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('c64d9102-9b7f-46c8-a9c7-48f0cb0dee33', '2026-04-02 20:34:53.575178', '2026-04-02 20:34:53.575178', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0MTM5MywiZXhwIjoxNzc1NzQ2MTkzfQ.yF6FDmQmXTK3SpgaUvcXXzlRBvtj9mhvyuS613vCz7s', '2026-04-09 20:34:53', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('c8679172-b581-4a4c-be2d-11ef1ffaf794', '2026-04-02 13:25:00.804420', '2026-04-02 13:25:00.804420', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTExNTYwMCwiZXhwIjoxNzc1NzIwNDAwfQ.GBWkZs5xGW6diJnF6OxE95A1KaRoMmqRrUSd-tMqXk8', '2026-04-09 13:25:00', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0),
('dcbd22f8-7780-4cbf-8966-325c692cc68b', '2026-04-02 21:43:04.673545', '2026-04-02 21:43:04.673545', NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YzliYmQxYi03ZDEzLTQ3MmYtOTM3NC01MjA3NGJkZTEyMjUiLCJlbWFpbCI6ImNyZWF0aXZlaHViQGljdG1lZXR1cC5jb20iLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc3NTE0NTQ4NCwiZXhwIjoxNzc1NzUwMjg0fQ.mw7R9US2DkCzDwcW8vEDmUKBIOB9GYNT16V6XmHaEiQ', '2026-04-09 21:43:04', '8c9bbd1b-7d13-472f-9374-52074bde1225', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 0);

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
  `category_id` varchar(36) NOT NULL,
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

--
-- Dumping data for table `sponsors`
--

INSERT INTO `sponsors` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `version_id`, `image_path`, `name`, `link`, `category_id`, `display_order`) VALUES
('80b78e3d-7608-4021-bb2c-03a921c8326f', '2026-04-02 21:27:10.069922', '2026-04-02 21:27:10.069922', '8c9bbd1b-7d13-472f-9374-52074bde1225', NULL, '7d286505-6579-4cf7-9f0e-03363c5a314f', 'C:\\Users\\Mandip Shrestha\\Desktop\\ict-meetup-api\\public\\assets\\ict-meetup-v7\\sponsors\\1775144525143-713a4115-c0bf-43e8-9330-4e179a8cc22f.jpeg', 'Ncell', NULL, '876ef7d1-5d29-4868-a6b5-e8f529af6ccd', 1);

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
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `createdAt`, `updatedAt`, `createdById`, `modifiedById`, `name`, `email`, `password`, `role`) VALUES
('8c9bbd1b-7d13-472f-9374-52074bde1225', '2026-04-02 11:28:58.823240', '2026-04-02 11:28:58.823240', NULL, NULL, 'creativehubadmin', 'creativehub@ictmeetup.com', '$2b$10$krcB/bCS3P9T82.uDL4KxOBzkwQvS1Pwnm8gWywLQwZUv3qgrfTHW', 'superadmin');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  ADD CONSTRAINT `FK_0dfe7e56f20f556e3f04ece9d91` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE NO ACTION,
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
