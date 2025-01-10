import { Component, OnInit } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Database } from '../shared/providers/database';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.page.html',
  styleUrls: ['./relatorio.page.scss'],
  standalone: false,
})
export class RelatorioPage implements OnInit {
  @LocalStorage('infoIniciais') infoIniciais: any;
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('areaid') areaid: any;
  @LocalStorage('levantamento') levantamento: boolean;
  @LocalStorage('horaInicio') horaInicio: any;
  @LocalStorage('mostrarbtnassinardepois') mostrarbtnassinardepois: boolean;

  areasCompletas: any;
  modulos: any = [];
  pragas: any = [];
  ordemProdutos: any = [];
  ordemModulos: any = [];
  pragasByArea = [];
  hasSignature: boolean = false;
  dispositivos: any = [];

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private db: Database,
    private localSt: LocalStorageService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.getAssinatura();
    await this.getProdutos();
    await this.getModulos();
    await this.getPragaByArea();
    await this.getDispositivos();
    await this.metodoInicial();
  }

  async metodoInicial() {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.voltar();
    });

    this.areasCompletas = await this.db.getAreaByOsCompleta(
      this.ordemDetalhes.id
    );
    this.pragas = await this.db.getByOs('pragaOs', this.ordemDetalhes.id);
  }

  async getPragaByArea() {
    this.pragasByArea = await this.db.createQuery(
      'SELECT p.idArea, p.nivel , p.id_praga, p.id, praga.nome FROM pragaOS p JOIN praga as praga on p.id_praga = praga.id where p.os = ' +
        this.ordemDetalhes.id +
        ' GROUP BY p.id_praga'
    );
  }

  async getDispositivos() {
    this.dispositivos = [];
    const dispositivos = await this.db.getOsDispositivos(this.ordemDetalhes.id);
    for (const dispositivo of dispositivos) {
      const pragas = await this.db.getDispositivoPragas(
        this.ordemDetalhes.id,
        dispositivo.id
      );

      let pragaStr = '';
      if (dispositivo.deConsumo === 'true') {
        pragaStr =
          pragas[0].consumido === 'true' ? 'Consumido' : 'Não consumido';
      } else if (pragas && pragas.length > 0) {
        pragaStr = pragas.reduce((res, prox) => {
          const str = `${prox.quantidade} ${prox.praga}`;
          return res ? `${res}, ${str}` : str;
        }, '');
      }
      this.dispositivos.push({
        id_area: dispositivo.id_area,
        sequencia: dispositivo.sequencia,
        tipo: dispositivo.tipo,
        pragas: pragaStr,
      });
    }
  }

  voltar() {
    if (!this.levantamento) {
      this.navCtrl.pop().then(() => {
        this.navCtrl.navigateBack('/lista-areas/qtd');
      });
    } else {
      this.navCtrl.pop().then(() => {
        this.navCtrl.navigateBack('/lista-areas');
      });
    }
  }

  async assinatura() {
    if (!this.hasSignature) {
      this.mostrarbtnassinardepois = false;
      this.navCtrl.navigateForward('/assinatura');
    } else {
      this.modalSucesso();
    }
  }

  getInfestacao(nivel: number) {
    switch (nivel) {
      case 1:
        return 'Baixa';
      case 2:
        return 'Média';
      case 3:
        return 'Alta';
      default:
        return '-';
    }
  }

  async getProdutos() {
    this.ordemProdutos = await this.db.createQuery(
      `SELECT a.id, SUM(a.qtd_modulo) as qtd ,  a.os, b.nome as produto from produtoOs a
     join produto b on a.id_produto = b.id join metodo m on a.id_metodo = m.id 
    where m.modulo = 0 and a.os = ` +
        this.ordemDetalhes.id +
        ` group by a.id_produto`
    );
  }

  async getModulos() {
    if (!this.levantamento) {
      this.ordemModulos = await this.db.createQuery(
        `SELECT a.id, SUM(a.qtd_modulo) as qtd ,  a.os, b.nome as produto from produtoOs a
      join produto b on a.id_produto = b.id join metodo m on a.id_metodo = m.id 
      where m.modulo = 1 and a.os = ` +
          this.ordemDetalhes.id +
          ` group by a.id_produto`
      );
    } else {
      this.ordemModulos = await this.db.createQuery(
        `SELECT a.id, SUM(a.qtd_modulo) as qtd ,  a.os, m.nome as produto from produtoOs a
      join metodo m on a.id_metodo = m.id where m.modulo = 1 and a.os = ` +
          this.ordemDetalhes.id +
          ` group by a.id_metodo`
      );
    }
  }

  async getAssinatura() {
    const res = await this.db.createQuery(
      'SELECT assinatura FROM os WHERE id = ' + this.ordemDetalhes.id
    );
    if (res.length > 0) {
      if (
        res[0].assinatura != null &&
        res[0].assinatura != '' &&
        res[0].assinatura != undefined
      ) {
        if (res[0].assinatura.length > 1) {
          this.hasSignature = true;
        }
      }
    }
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

  detalhesTecnicos() {
    this.navCtrl.navigateForward('/tela-info-tecnicas');
  }
}
