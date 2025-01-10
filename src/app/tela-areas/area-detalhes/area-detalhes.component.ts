import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { Area, Praga } from 'src/app/shared/modelos/os';
import { CompararArrayService } from 'src/app/shared/servicos/comparar-array.service';
import {
  Platform,
  IonItemSliding,
  AlertController,
  NavController,
  IonContent,
} from '@ionic/angular';
import { Database } from 'src/app/shared/providers/database';

@Component({
  selector: 'app-area-detalhes',
  templateUrl: './area-detalhes.component.html',
  styleUrls: ['./area-detalhes.component.scss'],
  standalone: false,
})
export class AreaDetalhesComponent implements OnInit {
  // dados salvos no local storage e session storage
  @LocalStorage('areaId') areaId: any;
  @LocalStorage('areaLista') areaLista: any;
  @LocalStorage('pragasLista') pragasLista: any;
  @LocalStorage('areaPraga') areaPraga: Praga[];
  @LocalStorage('areaMetodologia') areaMetodologia: any;
  @LocalStorage('areasCompletadas') areasCompletadas: any;
  @LocalStorage('iscasConsumidas') iscasConsumidas: any;
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('levantamento') levantamento: boolean;

  @ViewChild(IonItemSliding) sliding: IonItemSliding;
  @Output() backBtn = new EventEmitter();

  @ViewChild(IonItemSliding) slide: IonItemSliding;

  infestacaoValores = {
    1: 'Baixa',
    2: 'Média',
    3: 'Alta',
  };

  @ViewChild(IonContent) ioncontent: IonContent;

  area: Area;
  @LocalStorage('areaid') areaid;
  areaReco: any;
  modulosGravados: any;

  salvarBtn: boolean;

  tabs: any[] = [
    { title: 'PRAGAS', valor: 'pragas' },
    { title: 'METODOLOGIAS', valor: 'met' },
    { title: 'OBSERVAÇÕES', valor: 'obs' },
  ];

  constructor(
    private localSt: LocalStorageService,
    private compararService: CompararArrayService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private db: Database
  ) {}

  ngOnInit() {
    this.metodoInicial();
  }

  // ====

  async ionViewWillEnter() {
    this.areaReco = await this.db.createQuery(
      'SELECT a.id as idReco, a.*, b.recomendacao as textoFrase from recomendacao a join frase b on a.id_frase = b.id where os = ' +
        this.ordemDetalhes.id +
        ' and id_area = ' +
        this.areaid.id
    );

    this.areaPraga = await this.db.createQuery(
      'SELECT a.*, b.nome from pragaOs a join praga b on a.id_praga = b.id where os = ' +
        this.ordemDetalhes.id +
        ' and idArea = ' +
        this.areaid.id +
        ' GROUP BY a.id_praga'
    );

    if (!this.levantamento) {
      this.areaMetodologia = await this.db.createQuery(
        `SELECT P.id, P.id_produto, M.nome as metodologia, MD.nome as metodo, PRO.nome as produto FROM produtoOs P JOIN metodologia M ON P.id_metodologia = M.id
      JOIN metodo MD ON P.id_metodo = MD.id JOIN produto AS PRO ON P.id_produto = PRO.id WHERE P.idArea = ` +
          this.areaid.id +
          ` AND P.os = ` +
          this.ordemDetalhes.id
      );
    } else {
      this.areaMetodologia = await this.db.createQuery(
        `SELECT P.id, P.id_produto, M.nome as metodologia, MD.nome as metodo, ' - ' as produto FROM produtoOs P JOIN metodologia M ON P.id_metodologia = M.id
      JOIN metodo MD ON P.id_metodo = MD.id WHERE P.idArea = ` +
          this.areaid.id +
          ` AND P.os = ` +
          this.ordemDetalhes.id
      );
    }

    this.mostrarSalvar();
    this.backSub();
  }

  // ====

  async metodoInicial() {
    const areas = await this.db.getById('area', this.areaId.id);
    this.area = areas[0];
    this.mostrarSalvar();
  }

  // ====

  voltar() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.navigateBack('/lista-areas').then(() => {
        const lista = [
          'iscasConsumidas',
          'areaId',
          'areaMetodologia',
          'areaReco',
          'areaPraga',
          'areaCods',
          'posicao',
        ];
        lista.forEach((item: any) => {
          this.localSt.clear(item);
        });
      });
    });
  }

  // ====

  backSub(e?: any) {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.abrirModal();
    });
  }

  // ====

  async abrirModal() {
    const areas = await this.db.getAreaByOs(this.ordemDetalhes.id);
    if (areas.length !== 0) {
      const buscaId = areas.find((area: any) => area.id === this.areaId.id);

      if (buscaId !== undefined) {
        const pragasTemp = buscaId.pragas;
        const metTemp = buscaId.metodologias;
        const recoTemp = buscaId.recomendacoes;
        const pragas = this.areaPraga;
        const met = this.areaMetodologia;
        const reco = this.areaReco;
        let pragasTempQtd = 0;
        let metTempQtd = 0;
        let recTempQtd = 0;
        let pragasQtd = 0;
        let metQtd = 0;
        let recoQtd = 0;

        if (buscaId.pragas !== null && buscaId.pragas !== undefined) {
          pragasTempQtd = buscaId.pragas.length;
        }
        if (
          buscaId.metodologias !== null &&
          buscaId.metodologias !== undefined
        ) {
          metTempQtd = buscaId.metodologias.length;
        }
        if (
          buscaId.recomendacoes !== null &&
          buscaId.recomendacoes !== undefined
        ) {
          recTempQtd = buscaId.recomendacoes.length;
        }
        if (this.areaPraga !== null && this.areaPraga !== undefined) {
          pragasQtd = this.areaPraga.length;
        }
        if (
          this.areaMetodologia !== null &&
          this.areaMetodologia !== undefined
        ) {
          metQtd = this.areaMetodologia.length;
        }
        if (this.areaReco !== null && this.areaReco !== undefined) {
          recoQtd = this.areaReco.length;
        }

        if (
          pragasTempQtd !== pragasQtd ||
          metTempQtd !== metQtd ||
          recTempQtd !== recoQtd
        ) {
          // console.log('qtds diferentes');
          this.alertaConfirmacao();
        } else {
          // console.log('qtd iguais');
          if (
            this.compararService.compararItensBoolean(pragas, pragasTemp) ===
              true &&
            this.compararService.compararItensBoolean(met, metTemp) === true &&
            this.compararService.compararItensBoolean(reco, recoTemp) === true
          ) {
            // console.log('tudo igual');
            return this.voltar();
          } else {
            // console.log('tem diferença');
            return this.alertaConfirmacao();
          }
        }
      } else {
        if (
          this.areaPraga !== null ||
          this.areaReco !== null ||
          this.areaMetodologia !== null
        ) {
          // console.log('mensagem de confirmar saida sem salvar 1');
          return this.alertaConfirmacao();
        } else {
          // console.log('sem informação gravada');
          return this.voltar();
        }
      }
    } else {
      if (
        this.areaPraga !== null ||
        this.areaReco !== null ||
        this.areaMetodologia !== null
      ) {
        // console.log('mensagem de confirmar saida sem salvar 2');
        return this.alertaConfirmacao();
      } else {
        // console.log('sem informação gravada');
        return this.voltar();
      }
    }
  }

  // ====

  areaObj() {
    return {
      metodologia: this.areaMetodologia,
      observacao: this.areaReco,
      praga: this.areaPraga,
    };
  }

  // ====

  async finalizar() {
    await this.db.createQuery(
      'UPDATE areaOs SET status = "true" WHERE id = ' + this.areaid.id
    );
    this.navCtrl.pop().then(() => {
      this.navCtrl.navigateBack('/lista-areas');
    });
  }

  // ====

  async mostrarSalvar() {
    this.areaReco = await this.db.createQuery(
      'SELECT a.id as idReco, a.*, b.recomendacao as textoFrase from recomendacao a join frase b on a.id_frase = b.id where os = ' +
        this.ordemDetalhes.id +
        ' and id_area = ' +
        this.areaid.id
    );

    this.areaPraga = await this.db.createQuery(
      'SELECT a.*, b.nome from pragaOs a join praga b on a.id_praga = b.id where os = ' +
        this.ordemDetalhes.id +
        ' and idArea = ' +
        this.areaid.id +
        ' GROUP BY a.id_praga'
    );

    if (!this.levantamento) {
      this.areaMetodologia = await this.db.createQuery(
        `SELECT P.id, P.id_produto, M.nome as metodologia, MD.nome as metodo, PRO.nome as produto FROM produtoOs P JOIN metodologia M ON P.id_metodologia = M.id
      JOIN metodo MD ON P.id_metodo = MD.id JOIN produto AS PRO ON P.id_produto = PRO.id WHERE P.idArea = ` +
          this.areaid.id +
          ` AND P.os = ` +
          this.ordemDetalhes.id
      );
    } else {
      this.areaMetodologia = await this.db.createQuery(
        `SELECT P.id, P.id_produto, M.nome as metodologia, MD.nome as metodo, ' - ' as produto FROM produtoOs P JOIN metodologia M ON P.id_metodologia = M.id
      JOIN metodo MD ON P.id_metodo = MD.id WHERE P.idArea = ` +
          this.areaid.id +
          ` AND P.os = ` +
          this.ordemDetalhes.id
      );
    }
    if (!this.levantamento && this.areaReco.length > 0) {
      return (this.salvarBtn = true);
    } else if (
      this.areaPraga.length > 0 &&
      this.areaReco.length > 0 &&
      this.levantamento
    ) {
      return (this.salvarBtn = true);
    } else {
      return (this.salvarBtn = false);
    }
  }

  // ====

  async alertaConfirmacao() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar saída',
      message: 'Informações não gravadas. Deseja sair mesmo assim?',
      cssClass: 'alertas',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secundario',
        },
        {
          text: 'Ok',
          cssClass: 'primario',
          handler: () => {
            alert.dismiss().then(() => {
              this.voltar();
            });
          },
        },
      ],
    });

    alert.onWillDismiss().then(() => {
      this.backSub();
    });

    return alert.present().finally(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        alert.dismiss();
      });
    });
  }

  // ====

  scrollTo(e: any) {
    const elementId = e.target.value;

    const div = document.getElementById(elementId);
    const position = div.getBoundingClientRect();
    const x = position.left;
    const y = position.top - 110;

    this.ioncontent.scrollByPoint(x, y, 200);
  }

  // FUNCOES DA LISTA DE RECO

  adicionarConteudo() {
    this.navCtrl.navigateForward('/lista-areas/nova-reco');
  }

  // ======

  async editarConteudo(i: number) {
    this.navCtrl.navigateForward(['/lista-areas/editar-reco', i]);
  }
  //  =====

  async removerConteudo(i: number) {
    await this.sliding.closeOpened();
    await this.db.deleteById('recomendacao', i);
    this.areaReco = await this.db.createQuery(
      'SELECT a.id as idReco, a.*, b.recomendacao as textoFrase from recomendacao a join frase b on a.id_frase = b.id where os = ' +
        this.ordemDetalhes.id +
        ' and id_area = ' +
        this.areaid.id
    );
    this.mostrarSalvar();
  }

  // FUNÇÔES PRAGAS LISTA

  async adicionarConteudoPraga() {
    this.navCtrl.navigateForward('/lista-areas/nova-praga');
  }

  // ====

  editarConteudoPraga() {
    this.navCtrl.navigateForward('/lista-areas/nova-praga');
  }

  // ====

  removerConteudoPraga(i: number) {
    this.slide.closeOpened();
    if (i !== -1) {
      this.areaPraga.splice(i, 1);
      this.areaPraga = this.areaPraga;
    }
    if (this.areaPraga.length === 0) {
      this.localSt.clear('areaPraga');
      this.mostrarSalvar();
    }
  }

  adicionarConteudoMet() {
    this.navCtrl.navigateForward('/lista-areas/nova-met');
  }
  // ====

  editarConteudoMet(i: number) {
    this.navCtrl.navigateForward(['/lista-areas/editar-met', i]);
  }

  // ====

  async apagarConteudoMet(i: number) {
    await this.sliding.closeOpened();
    await this.db.deleteById('produtoOs', i);
    if (!this.levantamento) {
      this.areaMetodologia = await this.db.createQuery(
        `SELECT P.id, P.id_produto, M.nome as metodologia, MD.nome as metodo, PRO.nome as produto FROM produtoOs P JOIN metodologia M ON P.id_metodologia = M.id
      JOIN metodo MD ON P.id_metodo = MD.id JOIN produto AS PRO ON P.id_produto = PRO.id WHERE P.idArea = ` +
          this.areaid.id +
          ` AND P.os = ` +
          this.ordemDetalhes.id
      );
    } else {
      this.areaMetodologia = await this.db.createQuery(
        `SELECT P.id, P.id_produto, M.nome as metodologia, MD.nome as metodo, ' - ' as produto FROM produtoOs P JOIN metodologia M ON P.id_metodologia = M.id
      JOIN metodo MD ON P.id_metodo = MD.id WHERE P.idArea = ` +
          this.areaid.id +
          ` AND P.os = ` +
          this.ordemDetalhes.id
      );
    }
    this.mostrarSalvar();
  }

  async gerenciarDispositivos() {
    this.navCtrl.navigateForward('/lista-areas/dispositivo/lista');
  }

  acessarIscasConsumidas(modulo: any) {
    const id = modulo.id;
    this.localSt.store('moduloSelecionado', modulo);
    this.navCtrl.navigateForward(['/lista-areas/consumidas', id]);
  }
}
