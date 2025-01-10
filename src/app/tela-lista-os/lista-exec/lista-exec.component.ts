import { Component, OnInit, Input } from '@angular/core';
import { Os } from 'src/app/shared/modelos/os';
import { OsService } from 'src/app/shared/servicos/os.service';

@Component({
  selector: 'app-lista-exec',
  templateUrl: './lista-exec.component.html',
  styleUrls: ['./lista-exec.component.scss'],
  standalone: false,
})
export class ListaExecComponent implements OnInit {
  @Input() listaExec: Os[];

  constructor(private osService: OsService) {}

  ngOnInit() {}

  ionViewWillEnter() {}
}
