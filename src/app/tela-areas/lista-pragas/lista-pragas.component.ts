import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { IonItemSliding, NavController } from '@ionic/angular';

@Component({
  selector: 'app-lista-pragas',
  templateUrl: './lista-pragas.component.html',
  styleUrls: ['./lista-pragas.component.scss'],
  standalone: false,
})
export class ListaPragasComponent implements OnInit {
  @LocalStorage('areaPraga') areaPraga: any;

  @Output() mostrarSalvar = new EventEmitter();
  @Output() backBtn = new EventEmitter();

  @ViewChild(IonItemSliding) slide: IonItemSliding;

  infestacaoValores = {
    1: 'Baixa',
    2: 'Média',
    3: 'Alta',
  };

  constructor(
    private localSt: LocalStorageService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  // ====

  async adicionarConteudo() {
    this.navCtrl.navigateForward('/lista-areas/nova-praga');
  }

  // ====

  editarConteudo() {
    this.navCtrl.navigateForward('/lista-areas/nova-praga');
  }

  // ====

  removerConteudo(i: number) {
    this.slide.closeOpened();
    if (i !== -1) {
      this.areaPraga.splice(i, 1);
      this.areaPraga = this.areaPraga;
    }
    if (this.areaPraga.length === 0) {
      this.localSt.clear('areaPraga');
      this.mostrarSalvar.emit();
    }
  }
}
