-- -----------------------------------------------------
-- Table `dashboard`.`kpis`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dashboard`.`kpis` (
  `id` VARCHAR(12) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `shortname` VARCHAR(12) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `parent` VARCHAR(12) NOT NULL,
  `unit` VARCHAR(45) NOT NULL,
  `direction` VARCHAR(45) NOT NULL,
  `help` LONGTEXT NULL DEFAULT NULL,
  `formula` VARCHAR(255) NULL DEFAULT 'Direct Measurement',
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dashboard`.`partners`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dashboard`.`partners` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `shortname` VARCHAR(12) NOT NULL,
  `region` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dashboard`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dashboard`.`products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `shortname` VARCHAR(12) NOT NULL,
  `parent` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dashboard`.`measures`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dashboard`.`measures` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `timestamp` DATETIME NOT NULL DEFAULT NOW(),
  `kpi` VARCHAR(12) NOT NULL,
  `value` DECIMAL(10,2) NOT NULL,
  `partner` INT NULL,
  `product` INT NULL,
  `scenario` VARCHAR(45) NULL DEFAULT 'AC',
  PRIMARY KEY (`id`),
  INDEX `kpi_id_idx` (`kpi` ASC),
  INDEX `partner_id_idx` (`partner` ASC),
  INDEX `product_id_idx` (`product` ASC),
  CONSTRAINT `kpi_id`
    FOREIGN KEY (`kpi`)
    REFERENCES `dashboard`.`kpis` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `partner_id`
    FOREIGN KEY (`partner`)
    REFERENCES `dashboard`.`partners` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `product_id`
    FOREIGN KEY (`product`)
    REFERENCES `dashboard`.`products` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;