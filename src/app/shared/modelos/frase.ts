export class Frase {
  constructor (
    public id: number,
    public recomendacao: string
  ) {}
}

export class FraseNaoExec {
  constructor (
    public id: number,
    public frase: string
  ) {}
}
