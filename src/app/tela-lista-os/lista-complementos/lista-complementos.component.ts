import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { IonContent, AlertController, NavController } from '@ionic/angular';
import { Database } from 'src/app/shared/providers/database';

@Component({
  selector: 'app-lista-complementos',
  templateUrl: './lista-complementos.component.html',
  styleUrls: ['./lista-complementos.component.scss'],
  standalone: false,
})
export class ListaComplementosComponent implements OnInit {
  @LocalStorage('ordemComplementos') ordemComplementos: any;
  @LocalStorage('osConfirmadas') osConfirmadas: any;
  @LocalStorage('horaInicio') horaInicio: string;
  @LocalStorage('osComplemento') id: number;
  @LocalStorage('infoiniciais') infoiniciais: any;

  @ViewChild(IonContent) ioncontent: IonContent;

  exibirR: boolean;
  exibirO: boolean;
  exibirS: boolean;

  marcarO: boolean;
  marcarR: boolean;
  marcarS: boolean;

  reclamacoes: any;
  solicitacoes: any;
  observacoes: any;
  dispositivos: any;
  osData: any;

  data: any;

  ordemDetalhesId = null;

  dataNegrito: string;

  constructor(
    private alertCtrl: AlertController,
    private localSt: LocalStorageService,
    private navCtrl: NavController,
    private db: Database
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.metodoInicial();
  }

  async metodoInicial() {
    // this.segAtivo = 'reclamacoes';
    this.data = this.dataAtualMenos60();

    this.osData = await this.getOsData();
    this.observacoes = await this.db.createQuery(
      'SELECT * FROM obs WHERE os = ' + this.id
    );
    this.reclamacoes = await this.db.createQuery(
      'SELECT * FROM complemento WHERE tipo = 1 AND os = ' + this.id
    );
    this.solicitacoes = await this.db.createQuery(
      'SELECT * FROM complemento WHERE tipo = 2 AND os = ' + this.id
    );
    this.dispositivos = await this.getDispositivos();

    setTimeout(() => {
      if (this.reclamacoes.length > 0) {
        this.exibirR = true;
        this.marcarR = true;
      }

      if (this.observacoes.length === 0 && this.solicitacoes.length === 0) {
        this.exibirR = false;
      }

      if (this.observacoes.length > 0) {
        this.exibirO = true;
      }

      if (this.observacoes.length > 0 && this.reclamacoes.length === 0) {
        this.marcarO = true;
      }

      if (this.reclamacoes.length === 0 && this.solicitacoes.length === 0) {
        this.exibirO = false;
      }

      if (this.solicitacoes.length > 0) {
        this.exibirS = true;
      }
      if (this.reclamacoes.length === 0 && this.observacoes.length === 0) {
        this.exibirS = false;
      }
    }, 100);
  }

  async getOsData() {
    const osList = await this.db.getById('os', this.id);
    return osList[0];
  }

  async getDispositivos() {
    const dispositivos = await this.db.getOsDispositivos(this.id);

    const dispositivosQtd = dispositivos.reduce((acc, curr) => {
      if (acc[curr.tipo]) {
        acc[curr.tipo] += 1;
      } else {
        acc[curr.tipo] = 1;
      }
      return acc;
    }, {});

    return Object.keys(dispositivosQtd).map((key) => ({
      tipo: key,
      quantidade: dispositivosQtd[key],
    }));
  }

  voltar() {
    this.navCtrl.back();
  }

  ionViewDidLeave() {
    this.localSt.clear('ordemComplementos');
  }

  dataAtualMenos60() {
    const dataAtual = new Date();
    dataAtual.setDate(dataAtual.getDate() - 60);
    return new Date(dataAtual).toISOString().split('T')[0];
  }

  scrollTo(e: any) {
    const elementId = e.target.value;

    const div = document.getElementById(elementId);
    const position = div.getBoundingClientRect();
    const x = position.left;
    const y = position.top - 110;

    this.ioncontent.scrollByPoint(x, y, 200);
  }

  fecharModal(id: number) {
    if (this.horaInicio !== null) {
      this.voltar();
    } else {
      this.conferirConfirmacao(id);
    }
  }

  conferirConfirmacao(id: number) {
    if (this.osConfirmadas === null) {
      this.alertaConfirmacao(id);
    } else {
      const resultado = this.osConfirmadas.find(
        (element: number) => element === id
      );
      if (resultado !== undefined) {
        this.voltar();
      } else {
        this.alertaConfirmacao(id);
      }
    }
  }

  async alertaConfirmacao(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar leitura',
      message: 'Confirma a leitura de todas as informações?',
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
              if (this.osConfirmadas === null) {
                this.salvarId(id);
              } else {
                this.salvarIdArray(id);
              }
              this.voltar();
            });
          },
        },
      ],
    });

    return alert.present();
  }

  salvarId(id: number) {
    this.localSt.store('osConfirmadas', [id]);
  }

  salvarIdArray(id: number) {
    this.osConfirmadas.push(id);
    this.osConfirmadas = this.osConfirmadas;
  }

  showMaterialSection() {
    return (
      (this.dispositivos && this.dispositivos.length > 0) ||
      (this.osData &&
        (this.osData.fog === 1 ||
          this.osData.armadilha === 1 ||
          this.osData.escada === 1 ||
          this.osData.modulo === 1))
    );
  }
}
