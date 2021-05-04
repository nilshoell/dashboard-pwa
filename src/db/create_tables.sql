CREATE TABLE IF NOT EXISTS `kpis` (
  `id` VARCHAR(12) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `shortname` VARCHAR(12) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `parent` VARCHAR(12) NOT NULL,
  `unit` VARCHAR(45) NOT NULL,
  `direction` VARCHAR(45) NOT NULL,
  `help` LONGTEXT NULL DEFAULT NULL,
  `formula` VARCHAR(255) NULL DEFAULT 'Direct Measurement',
  PRIMARY KEY (`id`));
CREATE TABLE IF NOT EXISTS `partners` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `shortname` VARCHAR(12) NOT NULL,
  `region` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `shortname` VARCHAR(12) NOT NULL,
  `parent` INT NOT NULL,
  PRIMARY KEY (`id`));
CREATE TABLE IF NOT EXISTS `measures` (
  `id` INT NOT NULL,
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
    REFERENCES `kpis` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `partner_id`
    FOREIGN KEY (`partner`)
    REFERENCES `partners` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `product_id`
    FOREIGN KEY (`product`)
    REFERENCES `products` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
INSERT INTO `kpis` (`id`, `name`, `shortname`, `type`, `parent`, `unit`, `direction`, `formula`) VALUES ('74351e8d7097', 'Gross Sales', 'Gross Sales', 'KPI', 'NONE', '$', '+', '{4b9ad3f2ec7c} * {066642e39dac}');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `type`, `parent`, `unit`, `direction`) VALUES ('4b9ad3f2ec7c', 'Sales Volume', 'Sales Volume', 'KPI', '74351e8d7097', 't', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `type`, `parent`, `unit`, `direction`) VALUES ('066642e39dac', 'Sales Price per Ton', 'Sales Price', 'KPI', '74351e8d7097', '$', '+');