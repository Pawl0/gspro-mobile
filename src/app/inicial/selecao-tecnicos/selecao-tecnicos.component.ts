import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Rota } from 'src/app/shared/modelos/franquia';
import { OsService } from 'src/app/shared/servicos/os.service';
import { Os } from 'src/app/shared/modelos/os';
import { LocalStorage } from 'ngx-webstorage';
import {
  LoadingController,
  ModalController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { TecnicoService } from 'src/app/shared/servicos/tecnico.service';

@Component({
  selector: 'app-selecao-tecnicos',
  templateUrl: './selecao-tecnicos.component.html',
  styleUrls: ['./selecao-tecnicos.component.scss'],
  standalone: false,
})
export class SelecaoTecnicosComponent implements OnInit {
  // dados armazenados no local storage
  @LocalStorage('infoIniciais') infoIniciais;
  @LocalStorage('franquias') franquias;
  @LocalStorage('tecnicos') tecnicosStorage;

  // formulários
  formInfoIniciais: FormGroup;

  // rota
  rota: Rota; // modelo de rota
  rotaConst: any;

  // OS
  os: Os;
  ordens: Os[];

  equipeTrue: boolean;
  liberarAvancar: boolean;

  // tecnicos
  tecnicos: any; // lista de técnicos
  tecnico: any; // modelo de técnico
  tecnicosMinus: any; // lista de técnicos, excluído o responsável
  responsavel: any;
  equipe: any;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private tecnicoService: TecnicoService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    if (this.infoIniciais === null) {
      this.formInicial();
    } else {
      this.formPatch();
    }
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.liberarAvancar = false;
    this.spinnerTecnicos(this.infoIniciais.franquia.id);
  }

  formInicial() {
    this.formInfoIniciais = this.fb.group({
      responsavel: [null, Validators.required],
      equipe: [null],
    });
  }

  async formPatch() {
    this.formInfoIniciais = this.fb.group({
      responsavel: [this.infoIniciais.responsavel, Validators.required],
      equipe: [this.infoIniciais.equipe],
    });

    this.responsavel = await this.infoIniciais.responsavel;
    this.tecnicos = await this.recuperarTecnicos(this.infoIniciais.franquia.id);
    this.tecnicosMinus = await this.tecnicoMinus(
      this.infoIniciais.responsavel.id
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

  async spinnerTecnicos(id: number) {
    const loading = await this.loadingController.create({
      message: 'Carregando técnicos',
      animated: true,
      spinner: 'dots',
    });

    await loading.present();

    this.tecnicos = await this.recuperarTecnicos(id);

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
    this.tecnicosMinus = await this.tecnicoMinus(valor.value.id); // await this.tecnicoService.getTecnicoMinus(valor.value.id);

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
        responsavel: this.responsavel,
      };
    } else {
      return {
        responsavel: this.responsavel,
        equipe: this.formInfoIniciais.get('equipe').value,
      };
    }
  }

  async setarEquipe(valor: any) {
    this.equipe = await valor.value;
  }

  async avancarFunc() {
    const dados = await this.infoIniciais;

    if (this.responsavel !== undefined && this.responsavel !== null) {
      dados.responsavel = this.responsavel;
    }

    if (this.equipe !== undefined && this.equipe !== null) {
      dados.equipe = this.equipe;
    }

    try {
      this.infoIniciais = dados;
    } catch (e) {
      console.log(e);
    } finally {
      this.modalCtrl.dismiss();
    }
  }

  fechar() {
    this.modalCtrl.dismiss();
  }

  tecnicoMinus(id) {
    return this.tecnicos.filter((tec) => {
      return tec.id !== id;
    });
  }

  async recuperarTecnicos(id) {
    if (this.tecnicosStorage !== null && this.tecnicosStorage !== undefined) {
      if (this.tecnicosStorage.id === id) {
        return await this.tecnicosStorage.tecnicos;
      } else {
        const tec = await this.tecnicoService.getTecnicosFranquia(id);
        this.tecnicosStorage = { id: id, tecnicos: tec };
        return await this.tecnicosStorage.tecnicos;
      }
    } else {
      const tec = await this.tecnicoService.getTecnicosFranquia(id);
      this.tecnicosStorage = { id: id, tecnicos: tec };
      return await this.tecnicosStorage.tecnicos;
    }
  }
}
