-- -----------------------------------------------------
-- PARTNERS
-- -----------------------------------------------------
INSERT INTO `partners` (`id`, `name`, `shortname`, `region`) VALUES ('1001', 'International Material Supplies', 'IMS', 'US');
INSERT INTO `partners` (`name`, `shortname`, `region`) VALUES ('European Wholesales', 'EWS', 'EU');
INSERT INTO `partners` (`name`, `shortname`, `region`) VALUES ('Yet Another Customer', 'YAC', 'EU');
INSERT INTO `partners` (`name`, `shortname`, `region`) VALUES ('Detroit Buyers Consortium', 'DBC', 'US');
INSERT INTO `partners` (`name`, `shortname`, `region`) VALUES ('A Real Customer', 'ARC', 'EU');
INSERT INTO `partners` (`name`, `shortname`, `region`) VALUES ('Bejing Best Buy', 'BBB', 'ASIA');
INSERT INTO `partners` (`name`, `shortname`, `region`) VALUES ('Business Analytics Intelligence', 'BAI', 'US');
INSERT INTO `partners` (`name`, `shortname`, `region`) VALUES ('Arbis Financial', 'AF', 'ASIA');
INSERT INTO `partners` (`name`, `shortname`, `region`) VALUES ('Metricon', 'MC', 'US');
INSERT INTO `partners` (`name`, `shortname`, `region`) VALUES ('Cronos Inc.', 'Cronos', 'EU');

-- -----------------------------------------------------
-- PRODUCTS
-- -----------------------------------------------------
INSERT INTO `products` (`id`, `name`, `shortname`, `parent`) VALUES ('1001', 'Consumer Products', 'Consumer', '0');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Wholesale Products', 'Wholesale', '0');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Service Parts', 'Service', '0');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Product 1101', 'P1101', '1001');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Product 1102', 'P1102', '1001');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Product 1103', 'P1103', '1001');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Product 1104', 'P1104', '1001');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Product 1201', 'P1201', '1002');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Product 1202', 'P1201', '1002');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Product 1301', 'P1301', '1003');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Product 1302', 'P1302', '1003');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Product 1303', 'P1303', '1003');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Product 1303-I', 'P1303-I', '1012');
INSERT INTO `products` (`name`, `shortname`, `parent`) VALUES ('Product 1303-II', 'P1303-II', '1012');

-- -----------------------------------------------------
-- KPIs
-- -----------------------------------------------------
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`, `formula`) VALUES ('74351e8d7097', 'Gross Sales', 'Sales', '9efcb5361969', '$', '+', '{4b9ad3f2ec7c} * {066642e39dac}');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('4b9ad3f2ec7c', 'Sales Volume', 'Sales Volume', '74351e8d7097', '', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('066642e39dac', 'Sales Price', 'Sales Price', '74351e8d7097', '$', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`, `formula`) VALUES ('7a0c8fcbc047', 'Conversion Rate', 'CR', 'NONE', '%', '+', '{28053d385141} / {2983c4e7082f}');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('28053d385141', 'Sales Wins', 'Wins', '7a0c8fcbc047', '', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('2983c4e7082f', 'Sales Leads', 'Leads', '7a0c8fcbc047', '', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('dd751c6b67fb', 'Team Wins', 'Wins', 'NONE', '', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`, `formula`) VALUES ('a474fee353a1', 'Workload', 'Workload', 'NONE', '%', '+', '{250e42977eb7} / {54de7813948a}');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('54de7813948a', 'Total Hours Worked', 'Hours', 'a474fee353a1', 'h', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('250e42977eb7', 'Billable Worked', 'Billable Hours', 'a474fee353a1', 'h', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`, `formula`) VALUES ('9efcb5361969', 'Net Profit', 'Profit', '53c6cd0b443b', '$', '+', '{74351e8d7097} - {c0b0067928e3}');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`, `formula`) VALUES ('53c6cd0b443b', 'Profit Margin', 'Margin', 'NONE', '%', '+', '{9efcb5361969} / {74351e8d7097}');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('c0b0067928e3', 'Total Costs', 'Costs', '9efcb5361969', '$', '-');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('255e926dc950', 'Open Orders', 'Orders', 'NONE', '', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('3f6e4e8df453', 'Production Volume', 'Production', 'a9d7701c54d1', '', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('eb9f9dc3efb7', 'Stock Price', 'Stock', 'NONE', '$', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`, `formula`) VALUES ('a9d7701c54d1', 'Fault Rate', 'FR', 'NONE', '%', '-', '{37337445197e} / ({37337445197e} + {3f6e4e8df453})');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('37337445197e', 'Faulty Parts', 'Faults', 'a9d7701c54d1', '$', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('02141abb649b', 'Production Efficiency', 'Efficiency', 'NONE', '%', '+');
INSERT INTO `kpis` (`id`, `name`, `shortname`, `parent`, `unit`, `direction`) VALUES ('215570b6b5dd', 'Machine Failures', 'Failures', 'NONE', '', '-');