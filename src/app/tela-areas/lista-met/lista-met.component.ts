import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { IonItemSliding, NavController } from '@ionic/angular';
import { Database } from 'src/app/shared/providers/database';

@Component({
  selector: 'app-lista-met',
  templateUrl: './lista-met.component.html',
  styleUrls: ['./lista-met.component.scss'],
  standalone: false,
})
export class ListaMetComponent implements OnInit {
  @LocalStorage('areaMetodologia') areaMetodologia: any;
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('areaId') areaId: any;
  @LocalStorage('iscasConsumidas') iscasConsumidas: any;

  @Output() mostrarSalvar = new EventEmitter();
  @Output() backBtn = new EventEmitter();

  @ViewChild(IonItemSliding) slide: IonItemSliding;

  mostrarModulos: boolean;

  modulosGravados: any;

  constructor(
    private localSt: LocalStorageService,
    private navCtrl: NavController,
    private db: Database
  ) {}

  async ngOnInit() {
    const area = await this.db.getById('area', this.areaId.id);
    const areaAberta = area[0];

    if (areaAberta.modulo !== undefined && areaAberta.modulo !== null) {
      if (areaAberta.modulo.length > 0) {
        this.modulosGravados = areaAberta.modulo;
      }
    }
  }

  // ====

  adicionarConteudo() {
    this.navCtrl.navigateForward('/lista-areas/nova-met');
  }
  // ====

  editarConteudo(i: number) {
    this.navCtrl.navigateForward(['/lista-areas/editar-met', i]);
  }

  // ====

  apagarConteudo(i: number) {
    this.slide.closeOpened();
    if (i !== -1) {
      this.areaMetodologia.splice(i, 1);
      this.areaMetodologia = this.areaMetodologia;
      if (this.areaMetodologia.length === 0) {
        this.localSt.clear('areaMetodologia');
      }
    }
    this.mostrarSalvar.emit();
  }

  // ====

  acessarIscasConsumidas(modulo: any) {
    const id = modulo.id;
    this.localSt.store('moduloSelecionado', modulo);
    this.navCtrl.navigateForward(['/lista-areas/consumidas', id]);
  }
}
