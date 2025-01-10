import { Os } from 'src/app/shared/modelos/os';

export class Franquia {
  constructor(
    public id: number,
    public nome: string,
    public rota: Rota
  ) {}
}

export class Rota {
  constructor(
    public inicio: number,
    public fim: number
  ) {}
}
