-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 06, 2019 at 05:01 PM
-- Server version: 10.3.15-MariaDB
-- PHP Version: 7.1.30

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
-- Table structure for table `mpobs`
--

CREATE TABLE `mpobs` (
  `mpobId` int(11) NOT NULL,
  `mpobLicNo` varchar(200) NOT NULL,
  `expiredDate` datetime NOT NULL,
  `custId` int(11) NOT NULL,
  `createdDate` datetime NOT NULL DEFAULT current_timestamp(),
  `disabled` int(11) NOT NULL DEFAULT 0,
  `coId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mpobs`
--

INSERT INTO `mpobs` (`mpobId`, `mpobLicNo`, `expiredDate`, `custId`, `createdDate`, `disabled`, `coId`) VALUES
(1, 'LOG 123', '2019-07-31 00:00:00', 1, '2019-07-06 14:51:27', 0, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mpobs`
--
ALTER TABLE `mpobs`
  ADD PRIMARY KEY (`mpobId`),
  ADD UNIQUE KEY `uniq_mpobId_coId` (`mpobId`,`coId`),
  ADD KEY `mpodId` (`mpobId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mpobs`
--
ALTER TABLE `mpobs`
  MODIFY `mpobId` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
