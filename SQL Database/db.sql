CREATE DATABASE IF NOT EXISTS trab;

USE trab;

SET foreign_key_checks = 0;

DROP TABLE IF EXISTS `AREA`;

CREATE TABLE `AREA` (
	`NomeArea` varchar(255) NOT NULL,
	PRIMARY KEY(`NomeArea`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `COLABORADOR`;

CREATE TABLE `COLABORADOR` (
	`IdColaborador` int(11) NOT NULL AUTO_INCREMENT,
	`NifColaborador` int(9) NOT NULL,
	`NomeColaborador` varchar(255) NOT NULL,
	`Cargo` varchar(255) NOT NULL,
	`SBruto` int(11) NOT NULL,
	`SPremios` int(11) NOT NULL,
	`NomeArea` varchar(255) NOT NULL,
	PRIMARY KEY(`IdColaborador`,`NifColaborador`),
	FOREIGN KEY(`NomeArea`) REFERENCES `AREA`(`NomeArea`)
) ENGINE=InnoDB AUTO_INCREMENT=5001 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `NUMTELEMOVELCOLABORADOR`;

CREATE TABLE `NUMTELEMOVELCOLABORADOR` (
	`IdColaborador` int(11) NOT NULL,
	`NifColaborador` int(9) NOT NULL,
	`NumTelemovelColaborador` int(9) NOT NULL,
	PRIMARY KEY(`IdColaborador`,`NifColaborador`,`NumTelemovelColaborador`),
	FOREIGN KEY(`IdColaborador`) REFERENCES `COLABORADOR`(`IdColaborador`),
	FOREIGN KEY(`NifColaborador`) REFERENCES `COLABORADOR`(`NifColaborador`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `OBRA`;

CREATE TABLE `OBRA` (
	`IdObra` int(11) NOT NULL AUTO_INCREMENT,
	`DataInicio` date NOT NULL,
	`DataFim` date NOT NULL,
	`Duracao` int(10) NOT NULL,
	`Preco` int(10) NOT NULL,
	`IdColaborador` int(11) NOT NULL,
	PRIMARY KEY (`IdObra`),
	FOREIGN KEY (`IdColaborador`) REFERENCES `COLABORADOR`(`IdColaborador`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `CLIENTE`;

CREATE TABLE `CLIENTE` (
	`IdCliente` int(11) NOT NULL AUTO_INCREMENT,
	`Nif` int(9) NOT NULL,
	`Nome` varchar(255) NOT NULL,
	`Email` varchar(255) DEFAULT NULL,
	`EmpresaParticular` varchar(255) NOT NULL,
	`PagamentosEfetuados` int(11) NOT NULL,
	`IdObra` int(11) NOT NULL,
	PRIMARY KEY (`IdCliente`,`Nif`),
	FOREIGN KEY (`IdObra`) REFERENCES `OBRA`(`IdObra`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `NUMTELEMOVELCLIENTE`;

CREATE TABLE `NUMTELEMOVELCLIENTE` (
	`IdCliente` int(11) NOT NULL,
	`Nif` int(9) NOT NULL,
	`NumTelemovelCliente` int(9) NOT NULL
	/*
 	*PRIMARY KEY (`IdCliente`,`Nif`,`NumTelemovelCliente`),
	*FOREIGN KEY (`IdCliente`) REFERENCES `CLIENTE`(`IdCliente`),
	*FOREIGN KEY (`Nif`) REFERENCES `CLIENTE`(`Nif`)
*/
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `FERRAMENTA`;

CREATE TABLE `FERRAMENTA` (
	`Nome` varchar(255) NOT NULL,
	`PrecoFerramenta` int(11) NOT NULL,
	`DataAquisicao` date NOT NULL,
	PRIMARY KEY (`Nome`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `SERVIÇO`;

CREATE TABLE `SERVIÇO` (
	`IdObra` int(11) NOT NULL,
	`Nome` varchar(255) NOT NULL,
	`ValorBase` int(11) NOT NULL,
	PRIMARY KEY (`IdObra`,`Nome`),
	FOREIGN KEY (`IdObra`) REFERENCES OBRA(`IdObra`) 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `UTILIZADA`;

CREATE TABLE `UTILIZADA` (
	`NomeServiço` varchar(255) NOT NULL,
	`NomeFerramenta` varchar(255) NOT NULL,
	PRIMARY KEY (`NomeServiço`,`NomeFerramenta`),
	FOREIGN KEY (`NomeServiço`) REFERENCES SERVIÇO(`Nome`),
	FOREIGN KEY (`NomeFerramenta` REFERENCES FERRAMENTA(`Nome`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `UTILIZA`;

CREATE TABLE `UTILIZA` (
	`IdColaborador` int(11) NOT NULL,
	`Nome` varchar(255) NOT NULL,
	PRIMARY KEY (`IdColaborador`,`Nome`),
	FOREIGN KEY (`IdColaborador`) REFERENCES COLABORADOR(`IdColaborador`),
	FOREIGN KEY (`Nome`) REFERENCES FERRAMENTA(`Nome`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `TRABALHA`;

CREATE TABLE `TRABALHA` (
	`IdColaborador` int(11) NOT NULL,
	`IdObra` int(11) NOT NULL,
	PRIMARY KEY (`IdColaborador`),
	FOREIGN KEY (`IdColaborador`) REFERENCES COLABORADOR(`IdColaborador`),
	FOREIGN KEY (`IdObra`) REFERENCES OBRA(`IdObra`) 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `PRESTADO`

CREATE TABLE `PRESTADO` (
	`Nome` varchar(255) NOT NULL,
	`IdObra` int(11) NOT NULL,
	PRIMARY KEY (`Nome`),
	FOREIGN KEY (`Nome`) REFERENCES SERVIÇO(`Nome`),
	FOREIGN KEY (`IdObra`) REFERENCES OBRA(`IdObra`) 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


