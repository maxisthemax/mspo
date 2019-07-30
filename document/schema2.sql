ALTER TABLE `mpobs` ADD `mspoId` INT NOT NULL AFTER `landId`;
ALTER TABLE `lands` ADD `mukim` VARCHAR(200) NOT NULL AFTER `disabled`, ADD `yearPlanted` INT NOT NULL AFTER `mukim`, ADD `isMSPO` SMALLINT NOT NULL AFTER `yearPlanted`;
ALTER TABLE `tickets` ADD `transporterId` INT NOT NULL AFTER `vehicleNo`;
ALTER TABLE `transporters` DROP `ticketId`