import { environment } from 'src/environments/environment';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Device } from '@ionic-native/device/ngx';
import { PinDialog } from '@ionic-native/pin-dialog/ngx';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {
  FileTransfer,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import {
  ModalController,
  IonRouterOutlet,
  NavController,
} from '@ionic/angular';
import { SelecaoInfosComponent } from './selecao-infos/selecao-infos.component';
import { LocalStorage } from 'ngx-webstorage';
import { Database } from '../shared/providers/database';
import { InicialService } from '../shared/servicos/inicial.service';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
  standalone: false,
})
export class InicialPage implements OnInit {
  @LocalStorage('infoIniciais') infoIniciais: any;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  formFranquia: FormGroup;
  franquiasDataVar: any;
  versao: string;
  access: number = 0;
  franNome: string;
  haveUpdate: boolean = false;
  contador: number = 0;
  pathApp: string;
  btnAllowInstall: boolean = false;
  loading: any;
  franquias: any;
  franquiaSelecionada: any;
  showValidacao: any;
  app: any;
  message: string;

  constructor(
    private pinDialog: PinDialog,
    private device: Device,
    private androidPermissions: AndroidPermissions,
    private modalCtrl: ModalController,
    public loadingController: LoadingController,
    private navCtrl: NavController,
    public alertController: AlertController,
    private db: Database,
    private transfer: FileTransfer,
    private http: HttpClient,
    private file: File,
    private fileOpener: FileOpener,
    private inicialService: InicialService
  ) {}

  async ngOnInit() {
    this.versao = environment.versao;
    //this.verificarAtualizacao();
    await this.checkEntry();
    this.franquiasDataVar = await this.getFranquiaJson();
    this.franquias = this.franquiasDataVar;
  }

  async ionViewWillEnter() {
    this.contador = 0;
    await this.checkEntry();
    //this.verificarAtualizacao();
    //this.checkForUUID(2)
  }
  async getFranquiaJson() {
    var res = await this.http
      .get<any>('../../assets/franquias.json')
      .toPromise();
    return res;
  }
  async setarFranquia(franquia: any) {
    console.log(franquia);
    this.franquiaSelecionada = franquia.id;
    await this.atualizarFranquia(franquia);
  }
  async acessarSelecoes() {
    this.loading = await this.loadingController.create({
      message: 'Aguarde...',
      animated: true,
      spinner: 'lines',
    });

    await this.loading.present();

    let a = false;
    let b = false;
    let c = false;

    const executadas = await this.db.getOsByStatus(1);
    const osNaoExec = await this.db.getOsByStatus(2);
    const aguardando = await this.db.getOsByStatus(0);

    if (aguardando.length > 0) {
      a = true;
    }

    if (executadas.length > 0) {
      b = true;
    }

    if (osNaoExec.length > 0) {
      c = true;
    }
    await this.loading.dismiss();
    if (a === true || b === true || c === true) {
      this.navCtrl.navigateForward(['/lista-os']);
    } else {
      const modal = await this.modalCtrl.create({
        component: SelecaoInfosComponent,
      });
      this.loadingController.dismiss();
      return modal.present();
    }
    // });
  }

  debug() {
    if (this.contador == 4) {
      this.navCtrl.navigateForward(['/debug']);
      this.contador = 0;
    } else {
      this.contador++;
    }
  }

  getNowDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
  }

  async validarUUID() {
    const status = await this.checkForUUID();
    console.log('STATUS CONDITION: ' + status);
    this.pinDialog
      .prompt('Inserir PIN', 'Validar PIN', ['OK', 'Cancel'])
      .then((result: any) => {
        if (result.buttonIndex == 1) {
          if (result.input1 == '04050602') {
            const uuid = this.db.createQuery(
              ' update first_entry set status = 1 '
            );
            this.access = 1;
            console.log('uuid with access 1:', uuid);
          } else {
            console.log('SENHA ERRADA');
          }
        }
        console.log('User clicked OK, value is: ', result.input1);
      });
  }
  async atualizarFranquia(franquia) {
    await this.db.createQuery('DELETE FROM first_entry where 1');
    await this.db.createQuery(
      ` INSERT INTO first_entry (id, id_franquia , nome_franquia, api_franquia, assinatura_franquia) 
        values (1, ${franquia.id}, '${franquia.nome}', '${franquia.api}', ${franquia.assinatura}) `
    );
    this.showValidacao = 1;
    // const result = await this.db.createQuery(
    //   "SELECT * FROM first_entry WHERE 1"
    // );
    // console.log(result)
  }

  async verificarOsEnviar() {
    this.message = '';

    const qtdOsBaixadas = await this.db.createQuery(
      "SELECT COUNT(*) AS qtd FROM os WHERE data < '" +
        this.getNowDate() +
        "' AND status NOT IN (3, 4)"
    );

    if (qtdOsBaixadas.length > 0) {
      qtdOsBaixadas.forEach((r) => {
        if (parseInt(r.qtd) != 0) {
          this.btnAllowInstall = false;
          this.message =
            'Você precisa enviar todas as ordens de serviço disponíveis para atualizar o aplicativo.';
        }
      });
    }
  }

  async checkForUUID() {
    const uuid = await this.db.createQuery(
      'SELECT COUNT(*) AS qtd, status FROM first_entry where status = 1 '
    );
    console.log('uuid: ', uuid);
    if (uuid[0] != undefined) {
      if (uuid[0].qtd <= 0) {
        this.access = 0;
      } else {
        if (uuid[0].status == 1) {
          this.access = 1;
        }
      }
    }
    return this.access;
  }

  async checkEntry() {
    console.log('ACCCESSSS');
    const uuid = await this.db.createQuery(
      'SELECT id_franquia, nome_franquia FROM first_entry where status = 1 '
    );
    if (uuid[0]) {
      if (uuid[0].id_franquia > 0) {
        this.access = 1;
        this.franNome = uuid[0].nome_franquia;
      } else {
        this.access = 0;
      }
    }
  }

  verificarAtualizacao() {
    this.http
      .get(environment.api_webservice + 'app')
      .pipe(timeout(15000))
      .subscribe(
        async (app: any) => {
          this.app = app;
          if (app.version > environment.versao) {
            this.haveUpdate = true;
            this.baixarAtualizacao(app);
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  baixarAtualizacao(app) {
    var dir = this.file.externalDataDirectory;
    dir = dir.replace('files/', '');
    this.file
      .checkFile(dir, app.version + '.apk')
      .then((exist) => {
        this.pathApp = dir + app.version + '.apk';
        this.btnAllowInstall = true;
        //this.verificarOsEnviar();
      })
      .catch((err) => {
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer
          .download(
            app.link,
            this.file.externalApplicationStorageDirectory + app.version + '.apk'
          )
          .then(
            async (entry) => {
              this.pathApp = entry.toURL();
              this.btnAllowInstall = true;
              //this.verificarOsEnviar();
            },
            (error) => {
              console.log(error);
            }
          );
      });
  }

  atualizarManualmente() {
    window.open(this.app.link, '_system', 'location=yes');
  }

  installUpdate() {
    return this.fileOpener
      .open(this.pathApp, 'application/vnd.android.package-archive')
      .then(() => console.log('File is opened'))
      .catch((e) => console.log(e));
  }

  async atualizarDadosPrompt() {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message:
        'Verifique sua conexão com a internet antes de continuar com a atualizacão.',
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Continuar',
          handler: async () => {
            this.loading = await this.loadingController.create({
              message: 'Baixando dados. Isso pode demorar um pouco...',
              animated: true,
              spinner: 'lines',
            });

            await this.loading.present();
            this.atualizarDados();
          },
        },
      ],
    });

    await alert.present();
  }

  atualizarDados() {
    this.inicialService.updateDados().then(async () => {
      this.loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Sucesso',
        subHeader: 'Os dados foram todos baixados com sucesso.',
        message: 'Agora voce pode usar o app normalmente.',
        buttons: ['OK'],
      });

      await alert.present();
    });
  }
}
