import { FranquiasService } from "src/app/shared/servicos/franquias.service";
import { Injectable } from "@angular/core";
import { PragasService } from "src/app/shared/servicos/pragas.service";
import { RotasService } from "src/app/shared/servicos/rotas.service";
import { LocalStorage } from "ngx-webstorage";
import { AreasPreService } from "src/app/shared/servicos/areas-pre.service";
import { FrasesService } from "src/app/shared/servicos/frases.service";
import { MetodologiasService } from "src/app/shared/servicos/metodologias.service";
import { FirstEntryService } from "src/app/shared/servicos/FirstEntry.service";
import { AlertController, Platform, LoadingController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { Database } from "src/app/shared/providers/database";
import { TecnicoService } from "./tecnico.service";
import { DispositivosService } from "./dispositivos.service";

@Injectable({
  providedIn: "root"
})
export class InicialService {
  @LocalStorage("dbCriado") dbCriado: string;

  pragas = [];
  rotas = [];
  metodologias = [];
  metodos = [];
  produtos = [];
  frasesRec = [];
  frasesNaoExec = [];
  areasPre = [];
  franquias = [];
  tecnicos = [];

  loading: any;

  constructor(
    private pragasService: PragasService,
    private rotasService: RotasService,
    private areaPreService: AreasPreService,
    private tecnicoService: TecnicoService,
    private frasesService: FrasesService,
    private metodologiasService: MetodologiasService,
    private dispositivosService: DispositivosService,
    private FirstEntryService: FirstEntryService,
    private alertCtrl: AlertController,
    private platform: Platform,
    private loadingController: LoadingController,
    private splash: SplashScreen,
    private db: Database,
    private franquiaService: FranquiasService
  ) {
    try {
      this.db.getDb();
    } catch (e) {
      console.log(e);
    }
  }


  async getRotas() {
    try {
      this.loading.dismiss();
    } catch (e) {
      console.log(e);
    }

    const rotas = await this.rotasService.getRotas();
    if (rotas === null || rotas === undefined) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: ROTA404",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getRotas();
            }
          }
        ]
      });
      await alert.present();
    } else if (rotas.length <= 0) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: EMPTY-ROTA",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getRotas();
            }
          }
        ]
      });
      await alert.present();
    }
  }


  async getPragas() {
    try {
      this.loading.dismiss();
    } catch (e) {
      console.log(e);
    }

    const pragas = await this.pragasService.getPragas();

    if (pragas === null || pragas === undefined) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: PR404",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getPragas();
            }
          }
        ]
      });
      await alert.present();
    } else if (pragas.length <= 0) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: EMPTY-PR",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getPragas();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async getFrasesReco() {
    try {
      this.loading.dismiss();
    } catch (e) {
      console.log(e);
    }

    const frasesRec = await this.frasesService.getFrasesRec();

    if (frasesRec === null || frasesRec === undefined) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: FRREC404",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getFrasesReco();
            }
          }
        ]
      });
      await alert.present();
    } else if (frasesRec.length <= 0) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: EMPTY-FRRE",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getFrasesReco();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async getFrasesNaoExec() {
    try {
      this.loading.dismiss();
    } catch (e) {
      console.log(e);
    }

    const frasesNaoExec = await this.frasesService.getFrasesNaoExecutado();

    if (frasesNaoExec === null || frasesNaoExec === undefined) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: FRNE404",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getFrasesNaoExec();
            }
          }
        ]
      });
      await alert.present();
    } else if (frasesNaoExec.length <= 0) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: EMPTY-FRNE",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getFrasesNaoExec();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async getMet() {
    try {
      this.loading.dismiss();
    } catch (e) {
      console.log(e);
    }

    const metodologias = await this.metodologiasService.getMetodologias();

    if (metodologias === null || metodologias === undefined) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: MET404",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getMet();
            }
          }
        ]
      });
      await alert.present();
    } else if (metodologias.length <= 0) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: EMPTY-MET",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getMet();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async getAreasPre() {
    try {
      this.loading.dismiss();
    } catch (e) {
      console.log(e);
    }

    let areasPre = [];

    try {
      areasPre = await this.areaPreService.listarAreasPre();
    } catch (e) {
      console.log(e);
    }

    if (areasPre === null || areasPre === undefined) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: AREP404",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getAreasPre();
            }
          }
        ]
      });
      await alert.present();
    } else if (areasPre.length > 0) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: EMPTY-AREP",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getAreasPre();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async getFranquias() {
    try {
      this.loading.dismiss();
    } catch (e) {
      console.log(e);
    }

    let franquias = [];

    try {
      franquias = await this.franquiaService.getFranquias();
    } catch (e) {
      console.log(e);
    }

    if (franquias === null || franquias === undefined) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: FRAN404",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getFranquias();
            }
          }
        ]
      });
      await alert.present();
    } else if (franquias.length <= 0) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: EMPTY-FRAN",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getFranquias();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async getTecnicos() {
    try {
      this.loading.dismiss();
    } catch (e) {
      console.log(e);
    }

    let tecncos = [];

    try {
      tecncos = await this.tecnicoService.getTecnicosFranquia(1);
    } catch (e) {
      console.log(e);
    }

    if (tecncos === null || tecncos === undefined) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: TEC404",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getTecnicos();
            }
          }
        ]
      });
      await alert.present();
    } else if (tecncos.length <= 0) {
      const alert = await this.alertCtrl.create({
        message: "Tente novamente mais tarde. Código do erro: EMPTY-TEC",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss();
              this.getTecnicos();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async salvarInicialDb() {
    this.loading = await this.loadingController.create({
      message: "Baixando dados. Isso pode demorar um pouco...",
      animated: true,
      spinner: "lines"
    });

    await this.loading.present();
    console.log("LOADING ERROR");
    console.log("LOADING ERROR");
    console.log("LOADING ERROR");

    this.franquias = await this.franquiaService.getFranquias();
    this.tecnicos = await this.tecnicoService.getTecnicosFranquia(1);
    this.frasesRec = await this.frasesService.getFrasesRec();
    this.frasesNaoExec = await this.frasesService.getFrasesNaoExecutado();
    this.metodologias = await this.metodologiasService.getMetodologias();
    this.pragas = await this.pragasService.getPragas();
    this.rotas = await this.rotasService.getRotas();
    this.areasPre = await this.areaPreService.listarAreasPre();

    if (this.franquias.length <= 0) {
      await this.getFranquias();
    }
    if (this.tecnicos.length <= 0) {
      await this.getTecnicos();
    }
    if (this.pragas.length <= 0) {
      await this.getPragas();
    }
    if (this.rotas.length <= 0) {
      await this.getRotas();
    }
    if (this.frasesRec.length <= 0) {
      await this.getFrasesReco();
    }
    if (this.frasesNaoExec.length <= 0) {
      await this.getFrasesNaoExec();
    }
    if (this.metodologias.length <= 0) {
      await this.getMet();
    }
    if (this.areasPre.length <= 0) {
      await this.getAreasPre();
    }

    try {
      this.loading.dismiss();
    } catch (e) {
      console.log(e);
    }

    this.platform.ready().then(() => this.splash.hide());
  }

  async updateDados() {
    await Promise.all([
      this.tecnicoService.updateData(),
      this.pragasService.updateData(),
      this.rotasService.updateData(),
      this.frasesService.updateData(),
      this.areaPreService.updateData(),
      this.metodologiasService.updateData(),
      this.dispositivosService.updateData()
    ]).catch(e => {
      console.log(JSON.stringify(e))
    })
  }
}
