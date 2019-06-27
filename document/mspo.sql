-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2019 at 01:41 AM
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
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `coId` int(11) NOT NULL,
  `coName` varchar(100) NOT NULL,
  `coAdd` varchar(100) DEFAULT NULL,
  `coTel` varchar(100) DEFAULT NULL,
  `deactivated` mediumint(9) NOT NULL DEFAULT '0',
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`coId`, `coName`, `coAdd`, `coTel`, `deactivated`, `createdDate`) VALUES
(1, 'Maxisthemax', 'bukit jelutong', NULL, 0, '2019-05-09 23:39:47'),
(2, 'xxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxx', NULL, 0, '2019-05-09 23:39:47');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `coId` int(11) NOT NULL,
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

INSERT INTO `customers` (`coId`, `custId`, `custNo`, `custName`, `custIC`, `custTel`, `custAdd1`, `custAdd2`, `custAdd3`, `deactivated`, `createDate`) VALUES
(1, 1, '1', 'Leong Chee Nang', 'xxxxxxxxxxxxxxxxxx', '0164423372', '31, Jalan Adang U8/18', 'Bukit Jelutong', 'xxxxxxxxxxxxxxxxxx', 0, '2019-06-26 14:52:52'),
(2, 2, '1', 'Leong Chee Nang', 'xxxxxxxxxxxxxxxxxx', '0164423372', '31, Jalan Adang U8/18', 'Bukit Jelutong', 'xxxxxxxxxxxxxx', 0, '2019-06-26 14:54:42'),
(2, 4, '123qweasdzxc', 'Leong Chee Nangx', 'x', '0164423372x', '31, Jalan Adang U8/18x', 'Bukit Jelutongx', 'x', 0, '2019-06-26 15:01:31'),
(2, 7, '1zx', 'Leong Chee Nangxz', 'xxxxxxxxxxxxxxxxxxzx', '0164423372zx', '31, Jalan Adang U8/18zx', 'Bukit Jelutongzx', 'xxxxxxxxxxxxxxxxxxzx', 0, '2019-06-26 15:02:04'),
(1, 10, '12', 'Leong Chee Nang	', 'xxxxxxxxxxxxxxxxxx1', 'xxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxx', 0, '2019-06-27 13:08:46');

-- --------------------------------------------------------

--
-- Table structure for table `lands`
--

CREATE TABLE `lands` (
  `lotId` int(11) NOT NULL,
  `lotNo` varchar(200) NOT NULL,
  `titleNo` varchar(200) NOT NULL,
  `area` double NOT NULL,
  `custId` int(11) NOT NULL,
  `usageOfLand` varchar(200) NOT NULL,
  `typeOfCondition` varchar(200) NOT NULL,
  `gpsLocationLng` double NOT NULL,
  `gpsLocationLat` double NOT NULL,
  `coId` int(11) NOT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `lands`
--

INSERT INTO `lands` (`lotId`, `lotNo`, `titleNo`, `area`, `custId`, `usageOfLand`, `typeOfCondition`, `gpsLocationLng`, `gpsLocationLat`, `coId`, `createdDate`) VALUES
(1, 'abc', 'abcedf', 12.6, 1, 'sdsa', 'asdasds', 11, 22, 1, '2019-06-27 21:49:47'),
(2, '222222', '', 2222222, 2222222, '22222222', '22222222222', 2222222, 222222222222, 1, '0000-00-00 00:00:00'),
(3, '111111', '', 11111111111, 11111111, '111111111', '1111111111111', 111111111, 111111111, 1, '0000-00-00 00:00:00'),
(4, '323', '', 323, 23, '232', '32323232', 3232, 323, 1, '0000-00-00 00:00:00'),
(5, '333333333333', '33333333', 33333333333, 3333333, '3333333333', '33333333333333333', 33333333, 333333333333, 1, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `userpassword` varchar(200) NOT NULL,
  `displayname` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `deactivated` smallint(6) NOT NULL DEFAULT '0',
  `administrator` smallint(6) NOT NULL,
  `coId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `username`, `userpassword`, `displayname`, `email`, `deactivated`, `administrator`, `coId`) VALUES
(1, 'maxisthemax', 'test123', 'Max Test', 'maxisthemax89@gmail.com', 0, 1, 1),
(2, 'yy', 'yy', 'yy', '123@123.com', 0, 1, 2),
(3, 'xx', 'xx', 'xx', 'xxx@xxx.com', 0, 0, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`coId`) USING BTREE;

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`custId`),
  ADD UNIQUE KEY `custId` (`custId`,`custIC`),
  ADD UNIQUE KEY `uniq_coId_custNo` (`coId`,`custNo`) USING BTREE,
  ADD UNIQUE KEY `uniq_coId_custIC` (`coId`,`custIC`) USING BTREE;

--
-- Indexes for table `lands`
--
ALTER TABLE `lands`
  ADD PRIMARY KEY (`lotId`),
  ADD UNIQUE KEY `uniq_lotId_coId` (`lotId`,`coId`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`) USING BTREE,
  ADD UNIQUE KEY `userName` (`username`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `coId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `custId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `lands`
--
ALTER TABLE `lands`
  MODIFY `lotId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
