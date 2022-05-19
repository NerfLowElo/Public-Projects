table CLIENTES
(
  _ IdCliente_,
  _Nif_,
  Nome,
  Email?,
  EmpresaParticular,
  PagamentosEfetuados,
  IdObra --> OBRA.IdObra
)

table NUMTELEMOVELCLIENTE
(
  _ IdCliente_ --> CLIENTES.IdCliente,
  _Nif_ --> CLIENTES.Nif,
  _NumTelemovelCliente_
)

table OBRA
(
  _IdObra_,
  DataInicio,
  DataFim,
  Preço,
  IdColaborador --> COLABORADOR.IdColaborador
)

table COLABORADOR
(
  _IdColaborador_,
  _Nif_,
  Nome,
  Cargo,
  SBruto,
  SPremios,
  NomeArea --> AREA.Nome
)

table NUMTELEMOVELCOLABORADOR
(
  _IdColaborador_ --> COLABORADOR.IdColaborador,
  _Nif_ --> COLABORADOR.Nif,
  _NumTelemovelColaborador_
)

table AREA
(
  _Nome_
)

table FERRAMENTA
(
  _Nome_,
  PreçoFerramenta,
  DataAquisiçao
)

table UTILIZADA
(
  _NomeServiço_ --> SERVIÇO.Nome, 
  _NomeFerramenta_ --> FERRAMENTA.Nome
)

table UTILIZA
(
  _IdColaborador_ --> COLABORADOR.IdColaborador,
  _Nome_ --> FERRAMENTA.Nome
)

table TRABALHA
(
  _IdColaborador_ --> COLABORADOR.IdColaborador,
  IdObra --> OBRA.IdObra
)

table PRESTADO
(
  _Nome_ --> SERVIÇO.Nome,
  IdObra --> OBRA.IdObra
)

table SERVIÇO
(
  _IdObra_ --> OBRA.IdObra,
  _Nome_,
  ValorBase
)
