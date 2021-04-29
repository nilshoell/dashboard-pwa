CREATE TABLE IF NOT EXISTS `kpis` (
  `id` VARCHAR(12) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `shortname` VARCHAR(45) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `parent` VARCHAR(12) NULL DEFAULT NULL,
  `help` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `measures` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `timestamp` DATETIME NOT NULL DEFAULT NOW(),
  `kpi` VARCHAR(12) NOT NULL,
  `value` DECIMAL(10,2) NOT NULL,
  `partner` INT DEFAULT NULL,
  `product` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `kpi_id_idx` (`kpi` ASC),
  CONSTRAINT `kpi_id`
    FOREIGN KEY (`kpi`)
    REFERENCES `kpis` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
  INDEX `partner_id_idx` (`partner` INT),
  CONSTRAINT `partner_id`
    FOREIGN KEY (`partner`)
    REFERENCES `partners` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
  INDEX `product_id_idx` (`product` INT),
  CONSTRAINT `product_id`
    FOREIGN KEY (`product`)
    REFERENCES `products` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `targets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `kpi` VARCHAR(12) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `value` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `kpi_id_idx` (`kpi` ASC),
  CONSTRAINT `kpi_id`
    FOREIGN KEY (`kpi`)
    REFERENCES `kpis` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `partners` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `shortname` VARCHAR(45) NOT NULL,
  `region` VARCHAR(45) NOT NULL
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `shortname` VARCHAR(45) NOT NULL,
  `parent` VARCHAR(45) NOT NULL
  PRIMARY KEY (`id`));