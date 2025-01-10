export class Os {
  constructor(
    public id: number,
    public os: number,
    public status: string,
    public nomeCliente: string,
    public data: string,
    public horario: string,
    public horaInicio: string,
    public horaFim: string,
    public turno: string,
    public duracao: string,
    public tipoContrato: string,
    public servico: string,
    public numServico: number,
    public qtdTec: string,
    // endereço
    public nomeContato: string,
    public endereco: string,
    public enderecoGoogleMaps: string,
    public latitude: string,
    public longitude: string,
    public telefoneContato: any,
    // public logradouro: string,
    // public numeroEnd: string,
    // public complemento: string,
    // public bairro: number,
    // public cep: string,
    public zona: string,
    public foneContato: string,
    public reclamacoes: Reclamacao,
    public solicitacoes: Solicitacao,
    public observacoes: Observacao,
    public horaInfo: any,

    public armadilha: number,
    public fog: number,
    public modulo: number,
    public escada: number,

    public area: Area
  ) {}
}

export class Reclamacao {
  constructor(
    public id: number,
    public data: string,
    public conteudo: string
  ) {}
}

export class Solicitacao {
  constructor(
    public id: number,
    public data: string,
    public conteudo: string
  ) {}
}

export class Observacao {
  constructor(
    public id: number,
    public data: string,
    public conteudo: string
  ) {}
}

export class Area {
  constructor(
    public id: number,
    public cod: number,
    public nome: string,
    // public praga: Praga,
    // public obsArea: ObsArea,
    public metodologia: Metodologia
  ) {}
}

export class Praga {
  constructor(
    public id: number,
    public nome: string,
    public ninfestacao: string,
    public nivel: string
  ) {}
}

export class Metodologia {
  constructor(public id: number, public nome: string, public metodos: Metodo) {}
}

export class Metodo {
  constructor(
    public id: number,
    public nome: string,
    public produtos: Produto
  ) {}
}

export class Produto {
  constructor(public id: number, public nome: string) {}
}

// export class ObsArea {
//   constructor(
//     public id: string,
//     public data: string,
//     public recomendacao: Recomendacao,
//     public foto: string
//   ) {}
// }

// export class Recomendacao {
//   constructor(
//     public id: string,
//     public conteudo: string
//     ) {}
// }
