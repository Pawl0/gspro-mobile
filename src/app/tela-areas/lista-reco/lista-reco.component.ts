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
  selector: 'app-lista-reco',
  templateUrl: './lista-reco.component.html',
  styleUrls: ['./lista-reco.component.scss'],
  standalone: false,
})
export class ListaRecoComponent implements OnInit {
  @LocalStorage('ordemDetalhes') ordemDetalhes;
  @LocalStorage('areaid') areaid;
  areaReco: any;

  @Output() mostrarSalvar = new EventEmitter();
  @Output() backBtn = new EventEmitter();

  @ViewChild(IonItemSliding) slide: IonItemSliding;

  constructor(
    private localSt: LocalStorageService,
    private navCtrl: NavController,
    private db: Database
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.areaReco = await this.db.createQuery(
      'SELECT * from recomendacao where os = ' +
        this.ordemDetalhes.id +
        ' and id_area = ' +
        this.areaid.id
    );
    const reco = await this.db.createQuery('SELECT * from recomendacao');
  }

  // ======

  adicionarConteudo() {
    this.navCtrl.navigateForward('/lista-areas/nova-reco');
  }

  // ======

  async editarConteudo(i: number) {
    this.navCtrl.navigateForward(['/lista-areas/editar-reco', i]);
  }

  //  =====

  removerConteudo(i: number) {
    this.slide.closeOpened();
    if (i !== -1) {
      this.areaReco.splice(i, 1);
      this.areaReco = this.areaReco;
      if (this.areaReco.length === 0) {
        this.localSt.clear('areaReco');
      }
      this.mostrarSalvar.emit();
    }
  }
}
