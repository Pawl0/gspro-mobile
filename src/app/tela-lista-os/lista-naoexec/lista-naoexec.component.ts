import { Component, OnInit, Input } from '@angular/core';
import { Os } from 'src/app/shared/modelos/os';

@Component({
  selector: 'app-lista-naoexec',
  templateUrl: './lista-naoexec.component.html',
  styleUrls: ['./lista-naoexec.component.scss'],
  standalone: false,
})
export class ListaNaoexecComponent implements OnInit {
  @Input() listaNaoExec: {
    os: any;
    nomeCliente: any;
    horaInfo: any;
    status: any;
  }[];

  constructor() {}

  ngOnInit() {}
}
