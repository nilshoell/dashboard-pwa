-- -----------------------------------------------------
-- PARTNERS
-- -----------------------------------------------------
INSERT INTO `dashboard`.`partners` (`id`, `name`, `shortname`, `region`) VALUES ('1001', 'International Material Supplies', 'IMS', 'US');
INSERT INTO `dashboard`.`partners` (`name`, `shortname`, `region`) VALUES ('European Wholesales', 'EWS', 'EU');
INSERT INTO `dashboard`.`partners` (`name`, `shortname`, `region`) VALUES ('Yet Another Customer', 'YAC', 'EU');
INSERT INTO `dashboard`.`partners` (`name`, `shortname`, `region`) VALUES ('Dallas Buyers Club', 'DBC', 'US');
INSERT INTO `dashboard`.`partners` (`name`, `shortname`, `region`) VALUES ('A Real Customer', 'ARC', 'EU');
INSERT INTO `dashboard`.`partners` (`name`, `shortname`, `region`) VALUES ('Bejing Best Buy', 'BBB', 'ASIA');

-- -----------------------------------------------------
-- PRODUCTS
-- -----------------------------------------------------
INSERT INTO `dashboard`.`products` (`id`, `name`, `shortname`, `parent`) VALUES ('1001', 'Consumer Products', 'Consumer', '0');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Wholesale Products', 'Wholesale', '0');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Service Parts', 'Service', '0');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Product 1101', 'P1101', '1001');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Product 1102', 'P1102', '1001');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Product 1103', 'P1103', '1001');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Product 1104', 'P1104', '1001');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Product 1201', 'P1201', '1002');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Product 1202', 'P1201', '1002');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Product 1301', 'P1301', '1003');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Product 1302', 'P1302', '1003');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Product 1303', 'P1303', '1003');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Product 1303-I', 'P1303-I', '1012');
INSERT INTO `dashboard`.`products` (`name`, `shortname`, `parent`) VALUES ('Product 1303-II', 'P1303-II', '1012');

-- -----------------------------------------------------
-- KPIs
-- -----------------------------------------------------
INSERT INTO `dashboard`.`kpis` (`id`, `name`, `shortname`, `type`, `parent`, `unit`, `direction`, `formula`) VALUES ('74351e8d7097', 'Gross Sales', 'Gross Sales', 'KPI', 'NONE', '$', '+', '{4b9ad3f2ec7c} * {066642e39dac}');
INSERT INTO `dashboard`.`kpis` (`id`, `name`, `shortname`, `type`, `parent`, `unit`, `direction`) VALUES ('4b9ad3f2ec7c', 'Sales Volume', 'Sales Volume', 'KPI', '74351e8d7097', 't', '+');
INSERT INTO `dashboard`.`kpis` (`id`, `name`, `shortname`, `type`, `parent`, `unit`, `direction`) VALUES ('066642e39dac', 'Sales Price per Ton', 'Sales Price', 'KPI', '74351e8d7097', '$', '+');