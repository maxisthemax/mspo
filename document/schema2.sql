ALTER TABLE `mpobs` ADD `mspoId` INT NOT NULL AFTER `landId`;
ALTER TABLE `lands` ADD `mukim` VARCHAR(200) NOT NULL AFTER `disabled`, ADD `yearPlanted` INT NOT NULL AFTER `mukim`, ADD `isMSPO` SMALLINT NOT NULL AFTER `yearPlanted`;
ALTER TABLE `tickets` ADD `transporterId` INT NOT NULL AFTER `vehicleNo`;
ALTER TABLE `transporters` DROP `ticketId`

--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 

-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 30, 2019 at 05:57 PM
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
-- Database: `mspo`
--

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `saleId` int(11) NOT NULL,
  `custId` int(11) NOT NULL,
  `saleDate` datetime NOT NULL,
  `saleNo` varchar(200) NOT NULL,
  `vehicleNo` varchar(200) NOT NULL,
  `transporterId` int(11) NOT NULL,
  `buyerId` int(11) NOT NULL,
  `firstWeight` double NOT NULL,
  `secondWeight` double NOT NULL,
  `deduction` double NOT NULL,
  `nettWeight` double NOT NULL,
  `totalPrice` double NOT NULL,
  `oer` double NOT NULL,
  `priceMt` double NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `coId` int(11) NOT NULL,
  `disabled` smallint(6) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sales`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`saleId`),
  ADD KEY `custId` (`custId`),
  ADD KEY `coId` (`coId`),
  ADD KEY `saleId` (`saleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `saleId` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 
--done --done --done --done --done --done --done --done --done --done --done --done --done --done --done 