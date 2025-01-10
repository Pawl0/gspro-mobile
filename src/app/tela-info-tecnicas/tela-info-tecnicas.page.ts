import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { Database } from '../shared/providers/database';

@Component({
  selector: 'app-tela-info-tecnicas',
  templateUrl: './tela-info-tecnicas.page.html',
  styleUrls: ['./tela-info-tecnicas.page.scss'],
  standalone: false,
})
export class TelaInfoTecnicasPage implements OnInit {
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('horaFim') horaFim: any;
  @LocalStorage('horaInicio') horaInicio: any;
  @LocalStorage('detalhesTecnicos') detalhesTecnicos: any;

  escada: boolean = false;
  fog: boolean = false;
  inicialQtdTecnicos: number;
  inicialQtdHoras: number;
  manutencaoQtdTecnicos: number;
  manutencaoQtdHoras: number;
  obsTecnicas: string;
  isValid: boolean = false;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private localSt: LocalStorageService,
    private db: Database
  ) {}

  ngOnInit() {}

  voltar() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.navigateBack('/relatorio');
    });
  }

  checkValid() {
    if (
      this.inicialQtdTecnicos &&
      this.inicialQtdHoras &&
      this.manutencaoQtdTecnicos &&
      this.manutencaoQtdHoras
    ) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  async finalizar() {
    const detail = [
      this.ordemDetalhes.id,
      this.escada,
      this.fog,
      this.obsTecnicas,
      this.inicialQtdHoras,
      this.inicialQtdTecnicos,
      this.manutencaoQtdTecnicos,
      this.manutencaoQtdHoras,
    ];
    await this.db.insertReplace(
      'detalhe',
      'id, escada, fog, obs, inicialHora, inicialTecnico, manutencaoTecnico, manutencaoHora',
      detail
    );
    await this.modalSucesso();
  }

  async modalSucesso() {
    await this.db.createQuery(
      'UPDATE os SET status = 1, horaInicio = "' +
        this.horaInicio +
        '", horaFim = "' +
        Date.now() +
        '" WHERE id = ' +
        this.ordemDetalhes.id
    );
    await this.localSt.clear('horaInicio');
    const alert = await this.alertCtrl.create({
      message: 'Ordem de serviço finalizada!',
    });
    await alert.present();
    setTimeout(() => {
      alert.dismiss().then(() => {
        this.navCtrl.navigateForward('/lista-os');
      });
    }, 2500);
  }
}
