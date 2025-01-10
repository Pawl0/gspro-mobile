import { Component, OnInit } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { NavController, Platform } from '@ionic/angular';
import { Database } from 'src/app/shared/providers/database';

@Component({
  selector: 'app-nova-praga',
  templateUrl: './nova-praga.component.html',
  styleUrls: ['./nova-praga.component.scss'],
  standalone: false,
})
export class NovaPragaComponent implements OnInit {
  @LocalStorage('areaPraga') areaPraga: any;
  @LocalStorage('areaid') areaid: any;
  @LocalStorage('ordemdetalhes') ordemDetalhes: any;

  listaPragas: any;
  repeticoes: any;

  constructor(
    private localSt: LocalStorageService,
    private navCtrl: NavController,
    private platform: Platform,
    private db: Database
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.metodoInicial();
  }

  async metodoInicial() {
    this.repeticoes = await Array(15)
      .fill(0)
      .map((x, i) => i);

    this.areaPraga = await this.db.createQuery(
      'SELECT * FROM pragaOs WHERE os = ' +
        this.ordemDetalhes.id +
        ' AND idArea = ' +
        this.areaid.id
    );
    await this.getListaPragas();

    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.voltar();
    });
  }

  async getListaPragas() {
    this.listaPragas = await this.db.getAll('praga');
    if (this.areaPraga) {
      this.carregarStorage();
    }
  }

  definirPraga(e: any, nome: string, id: number) {
    const valor = e.detail.value;
    const praga = {
      id: id,
      nome: nome,
      ninfestacao: valor,
    };
    this.gravarPragas(praga);
  }

  carregarStorage() {
    this.areaPraga.forEach((pragaGravada: any) => {
      this.setarPressionado(pragaGravada.id_praga, pragaGravada.nivel);
    });
  }

  async gravarPragas(praga: any) {
    await this.db.createQuery(
      'DELETE FROM pragaOs WHERE idArea = ' +
        this.areaid.id +
        ' AND os = ' +
        this.ordemDetalhes.id +
        ' AND id_praga = ' +
        praga.id
    );
    await this.db.insert('pragaOs', 'os, idArea, id_praga, nivel', [
      this.ordemDetalhes.id,
      this.areaid.id,
      praga.id,
      praga.ninfestacao,
    ]);
  }

  voltar() {
    this.navCtrl.back();
  }

  async setPraga(nivel, id, nome) {
    //this.db.createQuery("delete from pragaOs");
    //console.log("entrou set pragars");

    this.areaPraga = await this.db.createQuery(
      'SELECT * FROM pragaOs WHERE os = ' +
        this.ordemDetalhes.id +
        ' AND idArea = ' +
        this.areaid.id
    );

    let res;
    if (this.areaPraga !== null && this.areaPraga !== undefined) {
      //console.log("prencheu res");
      res = await this.areaPraga.find((x) => x.id_praga === id);
      //console.log(res);
    }
    if (res !== undefined && res !== null) {
      if (res.nivel === nivel) {
        //console.log("desclionar");
        await this.desselecionarPressionado(id, nivel);
      } else {
        //console.log("seelecionar e inseirr");
        await this.setarPressionado(id, nivel);
        await this.gravarPragas({
          id: id,
          nome: nome,
          ninfestacao: nivel,
        });
      }
    } else {
      //console.log("seelecionar e inseirr 2");
      await this.setarPressionado(id, nivel);
      await this.gravarPragas({
        id: id,
        nome: nome,
        ninfestacao: nivel,
      });
    }
  }

  setarPressionado(praga, nivel) {
    const time = setInterval(() => {
      const btn = document.getElementById(nivel + '' + praga);
      if (btn !== null) {
        btn.classList.add('pressed');
        if (nivel === 1) {
          document.getElementById(2 + '' + praga).classList.remove('pressed');
          document.getElementById(3 + '' + praga).classList.remove('pressed');
        } else if (nivel === 2) {
          document.getElementById(1 + '' + praga).classList.remove('pressed');
          document.getElementById(3 + '' + praga).classList.remove('pressed');
        } else {
          document.getElementById(1 + '' + praga).classList.remove('pressed');
          document.getElementById(2 + '' + praga).classList.remove('pressed');
        }
        clearInterval(time);
      }
    }, 2);
  }

  async desselecionarPressionado(praga, nivel) {
    const btn = document.getElementById(nivel + '' + praga);
    if (btn !== null) {
      btn.classList.remove('pressed');
    }
    await this.db.createQuery(
      'DELETE FROM pragaOs WHERE id_praga = ' +
        praga +
        ' AND idArea = ' +
        this.areaid.id +
        ' AND os = ' +
        this.ordemDetalhes.id
    );
    this.areaPraga = await this.db.createQuery(
      'SELECT * FROM pragaOs WHERE os = ' +
        this.ordemDetalhes.id +
        ' AND idArea = ' +
        this.areaid.id
    );
  }
}
