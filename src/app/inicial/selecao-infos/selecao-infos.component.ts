import { Database } from './../../shared/providers/database';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FranquiasService } from 'src/app/shared/servicos/franquias.service';
import { Rota } from 'src/app/shared/modelos/franquia';
import { Os } from 'src/app/shared/modelos/os';
import { HttpClient } from '@angular/common/http';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import {
  LoadingController,
  ModalController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { TecnicoService } from 'src/app/shared/servicos/tecnico.service';

@Component({
  selector: 'app-selecao-infos',
  templateUrl: './selecao-infos.component.html',
  styleUrls: ['./selecao-infos.component.scss'],
  standalone: false,
})
export class SelecaoInfosComponent implements OnInit {
  // dados armazenados no local storage
  @LocalStorage('infoIniciais') infoIniciais;
  @LocalStorage('franquias') franquiasData;
  @LocalStorage('tecnicos') tecnicosStorage;
  @LocalStorage('levantamento') levantamento: boolean;
  @LocalStorage('api') api: string;

  // formulários
  formInfoIniciais: FormGroup;

  rotaID: any;
  tecResponsavelID: any;
  tecEquipeIDS: any;
  franquiaRotas: any = [];
  franquiaID: any;
  franquiaTemp: any;
  franquias: any;

  // franquias
  franquiaObj: any; // modelo de franquia

  // rota
  rota: Rota; // modelo de rota
  rotaConst: any;
  rotaLev: any;

  // OS
  os: Os;
  ordens: Os[];

  equipeTrue: boolean;
  liberarAvancar: boolean;

  // tecnicos
  tecnicos: any = []; // lista de técnicos
  tecnico: any; // modelo de técnico
  tecnicosMinus: any; // lista de técnicos, excluído o responsável
  responsavel: any;
  equipe: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private franquiaService: FranquiasService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private tecnicoService: TecnicoService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private localSt: LocalStorageService,
    private db: Database
  ) {
    if (this.infoIniciais === null) {
      this.formInicial();
    } else {
      this.formInicial();
    }
  }

  ngOnInit() {
    this.getRotasFromApi();
  }

  ionViewWillEnter() {
    this.liberarAvancar = false;
    this.spinnerFranquia();
  }

  async spinnerFranquia() {
    const loading = await this.loadingController.create({
      message: 'Carregando franquias',
      animated: true,
      spinner: 'dots',
    });

    try {
      await loading.present();
      this.franquias = await this.franquiasData;
    } finally {
      loading.dismiss();
    }
  }

  async formInicial() {
    await this.getRotasFromApi();
    console.log('TECCCCCCCCCCCCCCCCCCCCc');
    const res = await this.db.createQuery(
      'SELECT * FROM tecnico WHERE franquia = ' + 1
    );
    console.log(res);
    this.tecnicos = res;
  }

  async formPatch() {
    this.formInfoIniciais = this.fb.group({
      franquia: [this.infoIniciais.franquia, Validators.required],
      rota: [this.infoIniciais.rota, Validators.required],
      responsavel: [this.infoIniciais.responsavel, Validators.required],
      equipe: [this.infoIniciais.equipe],
    });

    this.franquiaObj = await this.infoIniciais.franquia;
    await this.setarRota(this.infoIniciais.rota);

    for (
      let i = this.franquiaObj.rota.inicio;
      i <= this.franquiaObj.rota.fim;
      i++
    ) {
      //this.franquiaRotas.push({ id: i, nome: "Rota " + i });
    }

    this.responsavel = await this.infoIniciais.responsavel;
    this.tecnicos = await this.db.getByFranquia('tecnico', 1);
    this.tecnicosMinus = await this.db.createQuery(
      'SELECT * FROM tecnico WHERE id != ' +
        this.responsavel.id +
        ' AND franquia = ' +
        1
    );

    if (this.tecnicos === null || this.tecnicos === undefined) {
      const alert = await this.alertCtrl.create({
        message: 'Tente novamente mais tarde. Código do erro: TEC404',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              alert.dismiss();
              this.formPatch();
            },
          },
        ],
      });
      await alert.present();
    }
  }

  async getRotasFromApi() {
    const api = await this.db.createQuery(
      'SELECT *  FROM first_entry WHERE id = 1'
    );
    let apiRota = api[0].api_franquia + 'rotasApp';
    console.log('API ROTAS: ' + apiRota);
    let rotas = await this.http.get(apiRota).toPromise();
    this.franquiaRotas = rotas;
    this.franquiaID = api[0];
    console.log('FRANQUIA SETADA PRA: ' + this.franquiaID.id_franquia);
    console.log('FRANQUIA ROTAS AGORA BAIXO: ');
    console.log(this.franquiaRotas);
  }

  setarRota(valor: any) {
    this.rotaConst = valor;
    this.rotaID = valor;
    this.rotaLev = valor.levantamento;
    if (this.rotaLev == 1) {
      this.levantamento = true;
    } else {
      this.levantamento = false;
    }
  }

  async spinnerTecnicos(id: number) {
    const loading = await this.loadingController.create({
      message: 'Carregando rotas e técnicos',
      animated: true,
      spinner: 'dots',
    });

    await loading.present();

    await this.tecnicoService.getTecsByFranquia(id);
    this.tecnicos = await this.db.getByFranquia(
      'tecnico',
      this.franquiaID.id_franquia
    );

    loading.dismiss();

    if (this.tecnicos == null || this.tecnicos === undefined) {
      const alert = await this.alertCtrl.create({
        message: 'Não existem técnicos cadastrados nessa franquia',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              alert.dismiss();
            },
          },
        ],
      });
      alert.present();
    }
  }

  async filterByResponsavel(valor: any) {
    this.responsavel = await valor.value;
    this.tecResponsavelID = await valor.value;
    this.tecnicosMinus = await this.db.createQuery(
      'SELECT * FROM tecnico WHERE id != ' +
        valor.value.id +
        ' AND franquia = ' +
        this.franquiaID.id_franquia
    );

    if (this.tecnicosMinus === null || this.tecnicosMinus === undefined) {
      const alert = await this.alertCtrl.create({
        message: 'Tente novamente mais tarde. Código do erro: FILT404',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              alert.dismiss();
              this.filterByResponsavel(valor);
            },
          },
        ],
      });
      await alert.present();
    }
  }

  fazerObjDados() {
    if (this.formInfoIniciais.get('equipe').value === null) {
      return {
        franquia: this.franquiaID.id_franquia,
        rota: this.rotaConst,
        responsavel: this.responsavel,
      };
    } else {
      return {
        franquia: this.franquiaID.id_franquia,
        rota: this.rotaConst,
        responsavel: this.responsavel,
        equipe: this.formInfoIniciais.get('equipe').value,
      };
    }
  }

  async selectEquipe(valor: any) {
    console.log('SELECIONANDO EQUIPRE: ');
    console.log(valor.value);
    this.tecEquipeIDS = valor.value;
  }
  async avancarFunc() {
    this.formInfoIniciais = this.fb.group({
      franquia: [this.franquiaID, Validators.required],
      rota: [this.rotaID, Validators.required],
      responsavel: [this.tecResponsavelID, Validators.required],
      equipe: [this.tecEquipeIDS],
    });
    console.log(this.formInfoIniciais);
    await this.localSt.store('infoIniciais', this.formInfoIniciais.value);
    this.navCtrl.navigateForward(['/lista-os']);
    this.fechar();
  }

  fechar() {
    this.modalCtrl.dismiss();
  }

  tecnicoMinus(id) {
    return this.tecnicos.filter((tec) => {
      return tec.id !== id;
    });
  }
}
