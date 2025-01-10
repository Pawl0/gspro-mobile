import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { Area } from 'src/app/shared/modelos/os';
import { FormGroup } from '@angular/forms';
import { IonItemSliding, NavController, ToastController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Database } from 'src/app/shared/providers/database';

@Component({
  selector: 'app-tela-areas',
  templateUrl: './tela-areas.page.html',
  styleUrls: ['./tela-areas.page.scss'],
  standalone: false,
})
export class TelaAreasPage implements OnInit {
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('ordemAreasQtdInicial') ordemAreasQtdInicial: any;
  @LocalStorage('ordemProdutos') ordemProdutos: any;
  @LocalStorage('levantamento') levantamento: boolean;

  prodTemp: any = [];

  @ViewChild('select') select: IonicSelectableComponent;

  @ViewChild(IonItemSliding) sliding: IonItemSliding;

  formArea: FormGroup;

  selectAreas: Area;

  areasPre = [];

  // barra de progresso
  areaLista: any;
  areasOsQtd: any;
  areasCompletas: any;
  areasCompletasQtd: any;
  corBarra: any;

  salvarAreas: any;
  mostrarAguardando = true;
  mostrarCompletas: any;

  valorBarra: any;

  prodNovo: any = [];

  constructor(
    private localSt: LocalStorageService,
    private navCtrl: NavController,
    private db: Database,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  // ====

  ionViewWillEnter() {
    this.metodoIncial();
    this.mostrarSalvarFun();
  }

  // ====

  async metodoIncial() {
    this.areasPre = await this.db.getAll('area');
    this.areaLista = await this.db.getAreaByOsAguardando(this.ordemDetalhes.id);
    this.areasCompletas = await this.db.getAreaByOsCompleta(
      this.ordemDetalhes.id
    );

    if (this.areaLista.length !== 0) {
      this.mostrarAguardando = true;
    } else {
      this.mostrarAguardando = false;
    }

    this.valorBarra =
      this.areasCompletas.length /
      (parseInt(this.areasCompletas.length, 0) +
        parseInt(this.areaLista.length, 0));

    if (this.areasCompletas.length !== 0) {
      this.mostrarCompletas = true;
    } else {
      this.mostrarCompletas = false;
    }

    if (this.mostrarAguardando === false && this.mostrarCompletas === true) {
      this.salvarAreas = false;
    }

    if (this.areaLista.length <= 0 && this.areasCompletas.length >= 1) {
      this.salvarAreas = false;
    }

    if (this.valorBarra < 0.5) {
      this.salvarAreas = true;
      this.corBarra = 'danger';
    } else if (this.valorBarra >= 0.5 && this.valorBarra !== 1) {
      this.salvarAreas = true;
      this.corBarra = 'warning';
    } else if (this.valorBarra === 1) {
      this.salvarAreas = false;
      this.corBarra = 'success';
    }
  }

  // ====

  async listarAreasPre() {
    this.areasPre = await this.db.getAll('area');
    return this.areasPre;
  }

  // ====

  voltar() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.pop().then(() => {
        this.navCtrl.navigateBack('/info-os');
      });
    });
    setTimeout(() => {
      this.localSt.clear('areaLista');
    }, 10);
  }

  // ====

  async acessarDetalheArea(id: number, nome: string, idArea: number) {
    this.localSt.store('areaId', { id: id, nome: nome, idArea: idArea });
    this.navCtrl.navigateForward(['/lista-areas/area-detalhes', id]);
  }

  // ====

  abrirSelect() {
    this.select.clear();
    this.select.open();
  }

  // ====

  async adicionarArea(e: any) {
    const novaArea: any = e.value;
    await this.db.insert('areaOs', 'idArea, os, status, nova', [
      novaArea.id,
      this.ordemDetalhes.id,
      false,
      true,
    ]);
    this.metodoIncial();
    this.areasCompletasQtd = this.areasCompletasQtd;
    this.localSt.store('ordemAreasQtdInicial', this.ordemAreasQtdInicial + 1);

    this.formArea.get('areaInp').patchValue(null);
    this.mostrarSalvarFun();
  }

  // ====

  async removerAreaAguardando(area: any) {
    if (!this.isAreaNova(area)) {
      return;
    }

    await this.sliding.closeOpened();
    await this.db.createQuery('DELETE FROM areaOs WHERE id = ' + area.id);
    await this.db.createQuery(
      'DELETE FROM produtoOs WHERE idArea = ' +
        area.id +
        ' AND os = ' +
        this.ordemDetalhes.id
    );
    if (this.levantamento) {
      await this.db.createQuery(
        `DELETE FROM levDispositivo WHERE id_area = ${area.id} AND id_levantamento = ${this.ordemDetalhes.id}`
      );
    } else {
      await this.db.createQuery(
        `DELETE FROM osDispositivo WHERE id_area = ${area.id} AND os = ${this.ordemDetalhes.id}`
      );
    }

    await this.metodoIncial();
    this.areasCompletasQtd = await this.areasCompletasQtd;
    await this.mostrarSalvarFun();
  }

  async mostrarSalvarFun() {
    this.salvarAreas = true;
    const r = await this.db.getAreaByOsAguardando(this.ordemDetalhes.id);
    const c = await this.db.getAreaByOsCompleta(this.ordemDetalhes.id);
    if (r.length > 0) {
      this.salvarAreas = true;
    } else {
      if (c.length > 0) {
        this.salvarAreas = false;
      }
    }
  }

  inserirQtd() {
    this.navCtrl.navigateForward('/lista-areas/qtd');
  }

  relatorio() {
    this.navCtrl.navigateForward('/relatorio');
  }

  objProd(id: number, nome: string, quantidade?: number) {
    if (this.ordemProdutos) {
      return {
        id: id,
        nome: nome,
        quantidade: quantidade,
      };
    } else {
      return {
        id: id,
        nome: nome,
      };
    }
  }

  isAreaNova(area: any) {
    return area.nova == 'true';
  }

  getDeleteAreaOptionLabel(area: any) {
    return this.isAreaNova(area) ? 'Apagar área' : 'Sem ações';
  }

  getDeleteAreaOptionColor(area: any) {
    return this.isAreaNova(area) ? 'danger' : 'medium';
  }
}
