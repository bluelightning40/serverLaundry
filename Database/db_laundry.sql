-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 12, 2022 at 03:54 AM
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
-- Database: `db_laundry`
--
CREATE DATABASE IF NOT EXISTS `db_laundry` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_laundry`;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `customer_id` varchar(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone_number` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_address` text NOT NULL,
  `customer_create_id` varchar(11) NOT NULL,
  `customer_create_date` date NOT NULL DEFAULT current_timestamp(),
  `customer_create_ip` varchar(15) NOT NULL,
  `customer_update_id` varchar(11) DEFAULT NULL,
  `customer_update_date` date DEFAULT current_timestamp(),
  `customer_update_ip` varchar(15) DEFAULT NULL,
  `customer_notes` text DEFAULT NULL,
  `customer_status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `customer_name`, `customer_phone_number`, `customer_email`, `customer_address`, `customer_create_id`, `customer_create_date`, `customer_create_ip`, `customer_update_id`, `customer_update_date`, `customer_update_ip`, `customer_notes`, `customer_status`) VALUES
('C3107220001', 'Christian Zamorano Setiawan', '081235250435', 'zamoranochristian7@gmail.com', 'Rungkut Mapan Tengah III CC/11a', 'CC310722001', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `d_trans`
--

DROP TABLE IF EXISTS `d_trans`;
CREATE TABLE `d_trans` (
  `d_trans_id` varchar(11) NOT NULL,
  `d_trans_main_photo` varchar(255) DEFAULT NULL,
  `d_trans_main_note` text DEFAULT NULL,
  `d_trans_top_photo` varchar(255) DEFAULT NULL,
  `d_trans_top_note` text DEFAULT NULL,
  `d_trans_left_photo` varchar(255) DEFAULT NULL,
  `d_trans_left_note` text DEFAULT NULL,
  `d_trans_right_photo` varchar(255) DEFAULT NULL,
  `d_trans_right_notes` text DEFAULT NULL,
  `d_trans_below_photo` varchar(255) DEFAULT NULL,
  `d_trans_below_notes` text DEFAULT NULL,
  `d_trans_create_id` varchar(11) NOT NULL,
  `d_trans_create_date` date NOT NULL DEFAULT current_timestamp(),
  `d_trans_create_ip` varchar(15) NOT NULL,
  `d_trans_update_id` varchar(11) DEFAULT NULL,
  `d_trans_update_date` date DEFAULT current_timestamp(),
  `d_trans_update_ip` varchar(15) DEFAULT NULL,
  `d_trans_note` text DEFAULT NULL,
  `d_trans_status` tinyint(1) NOT NULL,
  `FK_h_product_id` varchar(11) NOT NULL,
  `FK_user_id` varchar(11) DEFAULT NULL,
  `FK_h_trans_id` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `d_trans`
--

INSERT INTO `d_trans` (`d_trans_id`, `d_trans_main_photo`, `d_trans_main_note`, `d_trans_top_photo`, `d_trans_top_note`, `d_trans_left_photo`, `d_trans_left_note`, `d_trans_right_photo`, `d_trans_right_notes`, `d_trans_below_photo`, `d_trans_below_notes`, `d_trans_create_id`, `d_trans_create_date`, `d_trans_create_ip`, `d_trans_update_id`, `d_trans_update_date`, `d_trans_update_ip`, `d_trans_note`, `d_trans_status`, `FK_h_product_id`, `FK_user_id`, `FK_h_trans_id`) VALUES
('DT100922001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'DC100922001', '2022-09-10', '::1', NULL, '2022-09-10', NULL, 'data dummy', 1, 'HP310722001', NULL, 'T1009220001'),
('DT310722001', 'adsf', 'adf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'DTC31072201', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'HP310722001', NULL, 'T3107220001'),
('DT310722002', 'asdfas', 'adfasdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'DTC31072202', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'HP310722002', NULL, 'T3107220001');

-- --------------------------------------------------------

--
-- Table structure for table `h_product`
--

DROP TABLE IF EXISTS `h_product`;
CREATE TABLE `h_product` (
  `h_product_id` varchar(11) NOT NULL,
  `h_product_price` bigint(20) NOT NULL,
  `h_product_create_id` varchar(11) NOT NULL,
  `h_product_create_date` date NOT NULL DEFAULT current_timestamp(),
  `h_product_create_ip` varchar(15) NOT NULL,
  `h_product_update_id` varchar(11) DEFAULT NULL,
  `h_product_update_date` date DEFAULT current_timestamp(),
  `h_product_update_ip` varchar(15) DEFAULT NULL,
  `h_product_notes` text DEFAULT NULL,
  `h_product_status` tinyint(1) NOT NULL,
  `FK_product_id` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `h_product`
--

INSERT INTO `h_product` (`h_product_id`, `h_product_price`, `h_product_create_id`, `h_product_create_date`, `h_product_create_ip`, `h_product_update_id`, `h_product_update_date`, `h_product_update_ip`, `h_product_notes`, `h_product_status`, `FK_product_id`) VALUES
('HP310722001', 25000, 'HPC31072201', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'P3107220001'),
('HP310722002', 75000, 'HPC31072202', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'P3107220002');

-- --------------------------------------------------------

--
-- Table structure for table `h_trans`
--

DROP TABLE IF EXISTS `h_trans`;
CREATE TABLE `h_trans` (
  `h_trans_id` varchar(11) NOT NULL,
  `h_trans_estimation` varchar(255) NOT NULL,
  `h_trans_date_trans` date NOT NULL DEFAULT current_timestamp(),
  `h_trans_total_trans` bigint(20) NOT NULL,
  `h_trans_create_id` varchar(11) NOT NULL,
  `h_trans_create_date` date NOT NULL DEFAULT current_timestamp(),
  `h_trans_create_ip` varchar(15) NOT NULL,
  `h_trans_update_id` varchar(11) DEFAULT NULL,
  `h_trans_update_date` date DEFAULT current_timestamp(),
  `h_trans_update_ip` varchar(15) DEFAULT NULL,
  `h_trans_notes` text DEFAULT NULL,
  `h_trans_status` tinyint(1) NOT NULL,
  `FK_customer_id` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `h_trans`
--

INSERT INTO `h_trans` (`h_trans_id`, `h_trans_estimation`, `h_trans_date_trans`, `h_trans_total_trans`, `h_trans_create_id`, `h_trans_create_date`, `h_trans_create_ip`, `h_trans_update_id`, `h_trans_update_date`, `h_trans_update_ip`, `h_trans_notes`, `h_trans_status`, `FK_customer_id`) VALUES
('T3107220001', '3 hari', '2022-07-31', 100000, 'TC310722001', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'C3107220001'),
('T1009220001', '1 hari', '2022-09-10', 250000, 'TC100922001', '2022-09-10', '::1', NULL, '2022-09-10', NULL, 'data dummy coba api', 1, 'C3107220001');

-- --------------------------------------------------------

--
-- Table structure for table `privilege`
--

DROP TABLE IF EXISTS `privilege`;
CREATE TABLE `privilege` (
  `privilege_id` varchar(11) NOT NULL,
  `privilege_name` text NOT NULL,
  `privilege_create_id` varchar(11) NOT NULL,
  `privilege_create_date` date NOT NULL DEFAULT current_timestamp(),
  `privilege_create_ip` varchar(15) NOT NULL,
  `privilege_update_id` varchar(11) DEFAULT NULL,
  `privilege_update_date` date DEFAULT current_timestamp(),
  `privilege_update_ip` varchar(15) DEFAULT NULL,
  `privilege_note` text DEFAULT NULL,
  `privilege_status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `privilege`
--

INSERT INTO `privilege` (`privilege_id`, `privilege_name`, `privilege_create_id`, `privilege_create_date`, `privilege_create_ip`, `privilege_update_id`, `privilege_update_date`, `privilege_update_ip`, `privilege_note`, `privilege_status`) VALUES
('PR310722001', 'View Customer', 'PRC31072201', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722002', 'Create Customer', 'PRC31072202', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722003', 'Update Customer', 'PRC31072203', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722004', 'Delete Customer', 'PRC31072204', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722005', 'View Produk', 'PRC31072205', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722006', 'Create Produk', 'PRC31071220', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722007', 'Update Produk', 'PRC31072207', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722008', 'Delete Produk', 'PRC31072208', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `product_id` varchar(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_price` bigint(20) NOT NULL,
  `product_stock` int(11) NOT NULL,
  `product_category` text NOT NULL,
  `product_create_id` varchar(11) NOT NULL,
  `product_create_date` date NOT NULL DEFAULT current_timestamp(),
  `product_create_ip` varchar(15) NOT NULL,
  `product_update_id` varchar(11) DEFAULT NULL,
  `product_update_date` date DEFAULT current_timestamp(),
  `product_update_ip` varchar(15) DEFAULT NULL,
  `product_notes` text DEFAULT NULL,
  `product_status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `product_name`, `product_price`, `product_stock`, `product_category`, `product_create_id`, `product_create_date`, `product_create_ip`, `product_update_id`, `product_update_date`, `product_update_ip`, `product_notes`, `product_status`) VALUES
('P3107220001', 'Wax', 25000, 50, 'produk', 'PC310722001', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('P3107220002', 'Deep Wash', 75000, 10, 'jasa', 'PC310722002', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` varchar(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_create_id` varchar(11) NOT NULL,
  `user_create_date` date NOT NULL DEFAULT current_timestamp(),
  `user_create_ip` varchar(15) NOT NULL,
  `user_update_id` varchar(11) DEFAULT NULL,
  `user_update_date` date DEFAULT current_timestamp(),
  `user_update_ip` varchar(15) DEFAULT NULL,
  `user_notes` text DEFAULT NULL,
  `user_status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `user_password`, `user_create_id`, `user_create_date`, `user_create_ip`, `user_update_id`, `user_update_date`, `user_update_ip`, `user_notes`, `user_status`) VALUES
('U1009220001', 'doremi', 'doremi', 'UC100922001', '2022-09-10', '::1', NULL, '2022-09-10', NULL, 'dummy data', 1),
('U3107220001', 'bluelightning40', 'bluelightning40', 'UC310722001', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user-privilege`
--

DROP TABLE IF EXISTS `user-privilege`;
CREATE TABLE `user-privilege` (
  `user_privilege_id` varchar(11) NOT NULL,
  `user_privilege_create_id` varchar(11) NOT NULL,
  `user_privilege_create_date` date NOT NULL DEFAULT current_timestamp(),
  `user_privilege_create_ip` varchar(15) NOT NULL,
  `user_privilege_update_id` varchar(11) DEFAULT NULL,
  `user_privilege_update_date` date DEFAULT current_timestamp(),
  `user_privilege_update_ip` varchar(15) DEFAULT NULL,
  `user_privilege_notes` text DEFAULT NULL,
  `user_privilege_status` tinyint(1) NOT NULL,
  `FK_user_id` varchar(11) NOT NULL,
  `FK_privilege_id` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user-privilege`
--

INSERT INTO `user-privilege` (`user_privilege_id`, `user_privilege_create_id`, `user_privilege_create_date`, `user_privilege_create_ip`, `user_privilege_update_id`, `user_privilege_update_date`, `user_privilege_update_ip`, `user_privilege_notes`, `user_privilege_status`, `FK_user_id`, `FK_privilege_id`) VALUES
('UP310722001', 'UPC31072201', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'U3107220001', 'PR310722001'),
('UP310722002', 'UPC31072202', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'U3107220001', 'PR310722002'),
('UP310722003', 'UPC31072203', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'U3107220001', 'PR310722003'),
('UP310722004', 'UPC31072204', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'U3107220001', 'PR310722004'),
('UP310722005', 'UPC31072205', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'U3107220001', 'PR310722005'),
('UP310722006', 'UPC31072206', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'U3107220001', 'PR310722006'),
('UP310722007', 'UPC31072207', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'U3107220001', 'PR310722007'),
('UP310722008', 'UPC31072208', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'U3107220001', 'PR310722008');

-- --------------------------------------------------------

--
-- Table structure for table `user_login`
--

DROP TABLE IF EXISTS `user_login`;
CREATE TABLE `user_login` (
  `login_id` varchar(11) NOT NULL,
  `FK_user_id` varchar(11) NOT NULL,
  `login_date` date NOT NULL DEFAULT current_timestamp(),
  `login_ip` varchar(15) NOT NULL,
  `login_status` tinyint(1) NOT NULL,
  `login_create_id` varchar(11) NOT NULL,
  `login_create_date` date NOT NULL DEFAULT current_timestamp(),
  `login_update_id` varchar(11) DEFAULT NULL,
  `login_update_date` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `d_trans`
--
ALTER TABLE `d_trans`
  ADD PRIMARY KEY (`d_trans_id`);

--
-- Indexes for table `h_product`
--
ALTER TABLE `h_product`
  ADD PRIMARY KEY (`h_product_id`);

--
-- Indexes for table `privilege`
--
ALTER TABLE `privilege`
  ADD PRIMARY KEY (`privilege_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user-privilege`
--
ALTER TABLE `user-privilege`
  ADD PRIMARY KEY (`user_privilege_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
