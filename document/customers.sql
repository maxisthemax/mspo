-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2019 at 04:54 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.1.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mpso`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `custId` int(11) NOT NULL,
  `custNo` varchar(100) NOT NULL,
  `custName` varchar(100) NOT NULL,
  `custIC` varchar(100) NOT NULL,
  `custTel` varchar(100) NOT NULL,
  `custAdd1` varchar(100) DEFAULT NULL,
  `custAdd2` varchar(100) DEFAULT NULL,
  `custAdd3` varchar(100) DEFAULT NULL,
  `deactivated` smallint(6) NOT NULL DEFAULT '0',
  `createDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`custId`, `custNo`, `custName`, `custIC`, `custTel`, `custAdd1`, `custAdd2`, `custAdd3`, `deactivated`, `createDate`) VALUES
(1, '1', 'Ali Baba', '213123213-12-21312312', '123', '222', '333', '444', 0, '2019-05-06 14:48:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`custId`),
  ADD UNIQUE KEY `custNo` (`custNo`),
  ADD UNIQUE KEY `custIC` (`custIC`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `custId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
