import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import {
  IonContent,
  NavController,
  Platform,
  ModalController,
} from '@ionic/angular';
import { OsService } from 'src/app/shared/servicos/os.service';
import { Os } from 'src/app/shared/modelos/os';
import { SelecaoInfosComponent } from 'src/app/inicial/selecao-infos/selecao-infos.component';

import { environment as ENV } from 'src/environments/environment';
import { CallNumber } from '@ionic-native/call-number/ngx';
import {
  IonItemSliding,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import {
  LaunchNavigator,
  LaunchNavigatorOptions,
} from '@ionic-native/launch-navigator/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Database } from '../shared/providers/database';

@Component({
  selector: 'app-tela-lista-os',
  templateUrl: './tela-lista-os.page.html',
  styleUrls: ['./tela-lista-os.page.scss'],
  standalone: false,
})
export class TelaListaOsPage implements OnInit {
  @LocalStorage('infoIniciais') infoIniciais: any;
  @LocalStorage('todasordensrota') todasOrdens: any;
  @LocalStorage('horaInicio') horaInicio: any;
  @LocalStorage('ordemdetalhes') ordemdetalhes: any;
  @LocalStorage('todasOrdensRota') todasOrdensRota: any;
  @LocalStorage('datadownload') dataDownload: any;
  @LocalStorage('levantamento') levantamento: boolean;

  @ViewChild(IonContent) ioncontent: IonContent;
  @ViewChild('refresherRef') refresherRef: any;
  @ViewChild(IonItemSliding) slide: IonItemSliding;

  @LocalStorage('osConfirmadas') osConfirmadas: any;
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('ordemComplementos') ordemComplementos: any;

  pwaBrowser: any = false;
  aguardando: Os[];
  listaExec: Os[];
  listaNaoExec: Os[];

  tamAguardando: any;
  tamListaExec: any;
  tamListaNaoExec: any;

  mostrarTrocarRota: boolean;
  mostrarAguardando: boolean;

  constructor(
    private osService: OsService,
    private navCtrl: NavController,
    private platform: Platform,
    private modalCtrl: ModalController,
    private localSt: LocalStorageService,
    private alertCtrl: AlertController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private callNumber: CallNumber,
    private launchNavigator: LaunchNavigator,
    private androidPermissions: AndroidPermissions,
    private db: Database
  ) {}

  ngOnInit() {
    this.atualizarTela();
  }

  async ionViewWillEnter() {
    await this.atualizarTela();
    await this.metodoInicial();
  }

  async metodoInicial() {
    this.listaExec = await this.db.getAllOsExecuted();
    this.listaNaoExec = await this.db.getAllOsNotExecuted();
    this.aguardando = await this.db.getOsByStatus(0);

    if (this.aguardando !== null && this.aguardando !== undefined) {
      this.tamAguardando = this.aguardando.length;
    }
    if (this.listaNaoExec !== null && this.listaNaoExec !== undefined) {
      this.tamListaNaoExec = this.listaNaoExec.length;
    }
    if (this.listaExec !== null && this.listaExec !== undefined) {
      this.tamListaExec = this.listaExec.length;
    }

    this.platform.backButton.subscribeWithPriority(9999, async () => {
      await this.atualizarTela();
      this.navCtrl.pop().then(() => {
        this.navCtrl.navigateBack('/home');
      });
    });
  }

  backHome() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.navigateBack('/');
    });
  }

  async trocarRota() {
    const modal = await this.modalCtrl.create({
      component: SelecaoInfosComponent,
    });

    modal.onWillDismiss().then(() => {
      this.metodoInicial();
      this.platform.backButton.subscribeWithPriority(9999, () => {
        this.navCtrl.pop().then(() => {
          this.navCtrl.navigateBack('/home');
        });
      });
    });

    this.platform.backButton.subscribeWithPriority(9999, () => {
      modal.dismiss();
    });

    return modal.present();
  }

  validarOs(data: any) {
    const addDays = (date: any, days: any) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    let dataOs: any = new Date(data);
    dataOs = addDays(dataOs, 1).toLocaleDateString();
    const dataAtual = new Date().toLocaleDateString();

    if (dataOs < dataAtual) {
      this.navCtrl.pop().then(() => {
        this.navCtrl.navigateBack('/home');
      });
    }
  }

  getNowDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
  }

  async atualizarOs() {
    const loading = await this.loadingController.create({
      message: 'Baixando ordens de serviço...',
      animated: true,
      spinner: 'dots',
    });

    await loading.present();

    // >>>> validação retirada por solicitação <<<<
    // const qtdOsBaixadas = await this.db.createQuery(
    //   "SELECT COUNT(*) AS qtd FROM os WHERE status NOT IN (3, 4)"
    // );
    // console.log(qtdOsBaixadas)
    // if (qtdOsBaixadas.length > 0) {
    //   qtdOsBaixadas.forEach(r => {
    //     if (parseInt(r.qtd) != 0) {
    //       baixar = false;
    //     }
    //   });
    // }

    const OsBaixadas = await this.db.createQuery(
      'SELECT data FROM os WHERE status NOT IN (3, 4)'
    );

    const { baixar, erro } = await this.validarOSExistentes(OsBaixadas);

    if (baixar) {
      const ordens = await this.osService.atualzarOs();
      if (ordens === null || ordens === undefined) {
        loading.dismiss();
      } else {
        this.listaExec = await this.db.getAllOsExecuted();
        this.listaNaoExec = await this.db.getAllOsNotExecuted();
        this.aguardando = await this.db.getOsByStatus(0);

        if (this.aguardando !== null && this.aguardando !== undefined) {
          this.tamAguardando = this.aguardando.length;
        }
        if (this.listaNaoExec !== null && this.listaNaoExec !== undefined) {
          this.tamListaNaoExec = this.listaNaoExec.length;
        }
        if (this.listaExec !== null && this.listaExec !== undefined) {
          this.tamListaExec = this.listaExec.length;
        }
        loading.dismiss();
        this.atualizarTela();
      }
    } else {
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: erro,
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              alert.dismiss();
            },
          },
        ],
      });
      await alert.present();
    }
  }

  async enviarOs() {
    const loading = await this.loadingController.create({
      message: 'Enviando ordens de serviço...',
      animated: true,
      spinner: 'dots',
    });

    await loading.present();
    await this.osService
      .enviarOs()
      .then(async (res: any) => {
        await this.db.getAll('os');
        this.listaExec = await this.db.getAllOsExecuted();
        this.listaNaoExec = await this.db.getAllOsNotExecuted();
        this.aguardando = await this.db.getOsByStatus(0);

        if (this.aguardando !== null && this.aguardando !== undefined) {
          this.tamAguardando = await this.aguardando.length;
        }
        if (this.listaNaoExec !== null && this.listaNaoExec !== undefined) {
          this.tamListaNaoExec = await this.listaNaoExec.length;
        }
        if (this.listaExec !== null && this.listaExec !== undefined) {
          this.tamListaExec = await this.listaExec.length;
        }

        if (res != '' && res != undefined && res != null) {
          const alert = await this.alertController.create({
            header: 'Aviso',
            message: res,
            buttons: [
              {
                text: 'Fechar',
                role: 'cancel',
                cssClass: 'danger',
              },
            ],
          });
          await alert.present();
        }
      })
      .finally(() => {
        this.atualizarTela();
        loading.dismiss();
      });
  }

  atualizarTela() {
    const element: HTMLIFrameElement = document.getElementById(
      'listaExecutada'
    ) as HTMLIFrameElement;
    const element2: HTMLIFrameElement = document.getElementById(
      'listaNaoExec'
    ) as HTMLIFrameElement;
    const element3: HTMLIFrameElement = document.getElementById(
      'listaAguardando'
    ) as HTMLIFrameElement;

    if (element !== null && element !== undefined) {
      const iframe = element.contentWindow;
      if (iframe !== undefined) {
        iframe.location.reload();
      }
    }

    if (element2 !== null && element2 !== undefined) {
      const iframe2 = element2.contentWindow;
      if (iframe2 !== undefined) {
        iframe2.location.reload();
      }
    }

    if (element3 !== null && element3 !== undefined) {
      const iframe3 = element3.contentWindow;
      if (iframe3 !== undefined) {
        iframe3.location.reload();
      }
    }
  }

  // FUNCOES LISTA OS

  async testeCor() {
    if (this.osConfirmadas) {
      await this.aguardando.forEach(async (os: any) => {
        const resultado = await this.osConfirmadas.find(
          (element: number) => element === os.id
        );
        if (resultado !== undefined) {
          setTimeout(() => {
            const icon = document.getElementById('icon' + resultado);
            icon.setAttribute('color', 'primary');
            icon.setAttribute('ng-reflect-color', 'primary');
          }, 50);
        }
      });
    }
  }

  // ====

  abrirMapa(os: any) {
    this.slide.closeOpened();
    const linkMaps =
      'https://www.google.com/maps?api=' +
      ENV.maps_api_key +
      '&q=' +
      os.latitude +
      ',' +
      os.longitude +
      '&ll=' +
      os.latitude +
      ',' +
      os.longitude +
      '&z=17';

    const linkMapsIos =
      'maps://www.google.com/maps?api=' +
      ENV.maps_api_key +
      '&q=' +
      os.latitude +
      ',' +
      os.longitude +
      '&ll=' +
      os.latitude +
      ',' +
      os.longitude +
      '&z=17';

    if (this.pwaBrowser) {
      if (
        navigator.platform.indexOf('iPhone') !== -1 ||
        navigator.platform.indexOf('iPod') !== -1 ||
        navigator.platform.indexOf('iPad') !== -1
      ) {
        window.open(linkMapsIos);
      } else {
        window.open(linkMaps, '_system');
      }
    } else {
      if (this.platform.is('android')) {
        // ANDROID
        this.androidPermissions
          .checkPermission(
            this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
          )
          .then(
            (resposta) => {
              const options: LaunchNavigatorOptions = {
                transportMode: 'driving',
              };
              this.launchNavigator.navigate(
                [os.latitude, os.longitude],
                options
              );
            },
            (error) => {
              console.log(error);
              this.androidPermissions.requestPermission(
                this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
              );
            }
          );
      } else {
        // IOS
        const options: LaunchNavigatorOptions = {
          transportMode: 'driving',
        };
        this.launchNavigator.navigate(
          [this.ordemDetalhes.latitude, this.ordemDetalhes.longitude],
          options
        );
      }
    }
  }

  // ====

  ligar(numero: any) {
    this.slide.closeOpened();
    if (this.pwaBrowser) {
      document.location.href = 'tel:' + numero;
    } else if (this.platform.is('android')) {
      this.androidPermissions
        .checkPermission(this.androidPermissions.PERMISSION.CALL_PHONE)
        .then(
          (resposta) => {
            if (this.platform.is('android') || this.platform.is('ios')) {
              this.callNumber
                .callNumber(numero, true)
                .then((res) => console.log('Launched dialer!', res))
                .catch((err) => console.log('Error launching dialer', err));
            }
          },
          (error) => {
            console.log(error);
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.CALL_PHONE
            );
          }
        );
    } else {
      if (this.platform.is('android') || this.platform.is('ios')) {
        this.callNumber
          .callNumber(numero, true)
          .then((res) => console.log('Launched dialer!', res))
          .catch((err) => console.log('Error launching dialer', err));
      }
    }
  }

  relatorio(os: any) {
    this.slide.closeOpened();
    document.location.href =
      'http://emops.com.br/~emops/world/relatorio_novo/index.php?os=' + os;
  }

  relatorioNaoExec(os: any) {
    this.slide.closeOpened();
    document.location.href =
      'http://emops.com.br/~emops/world/relatorio_novo/index.php?os=' + os;
  }

  // ====

  acessarOs(id: number) {
    if (this.horaInicio === null || this.horaInicio === undefined) {
      this.conferirConfirmacao(id);
    } else {
      if (
        this.ordemDetalhes.id === id ||
        this.ordemDetalhes.status == 1 ||
        this.ordemDetalhes.status == 2
      ) {
        this.avancar(id);
      } else {
        this.alertaOs();
      }
    }
  }

  async acessarOsLevExec(id: number) {
    if (this.levantamento) {
      if (!this.horaInicio || this.ordemDetalhes.id == id) {
        const loading = await this.loadingController.create({
          message: 'Acessando OS',
          animated: true,
          spinner: 'dots',
        });

        await loading.present();

        const res = await this.db.getById('os', id);
        if (res !== undefined && res !== null) {
          await this.localSt.store('ordemDetalhes', res[0]);
          if (res) {
            loading.dismiss().then((r) => {
              if (r === true) {
                this.navCtrl.navigateForward('/info-os');
                this.platform.backButton.subscribeWithPriority(9999, () => {
                  this.navCtrl.back();
                });
              }
            });
          }
        }
      } else {
        this.alertaOs();
      }
    }
  }

  // ====

  conferirConfirmacao(id: number) {
    if (
      (this.osConfirmadas === null || this.osConfirmadas === undefined) &&
      !this.levantamento
    ) {
      this.listaComplementos(id);
    } else {
      if (this.osConfirmadas != null && this.osConfirmadas != undefined) {
        const resultado = this.osConfirmadas.find(
          (element: any) => element === id
        );
        if (resultado !== undefined && resultado !== null) {
          this.avancar(id);
        } else if (this.levantamento) {
          this.avancar(id);
        } else {
          this.listaComplementos(id);
        }
      } else if (this.levantamento) {
        this.avancar(id);
      }
    }
  }

  // ====

  async listaComplementos(id: number) {
    this.localSt.store('osComplemento', id);
    this.navCtrl.navigateForward('/lista-os/complementos');
  }

  async alertaOs() {
    const alert = await this.alertController.create({
      header: 'OS já aberta',
      message: 'Feche a OS já aberta primeiro',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
        },
      ],
    });
    await alert.present();
  }

  async avancar(id: number) {
    if (
      this.horaInicio &&
      this.ordemDetalhes.status != 1 &&
      this.ordemDetalhes.status != 2
    ) {
      this.navCtrl.navigateForward('/info-os');
    } else {
      this.horaInicio = null;
      const loading = await this.loadingController.create({
        message: 'Acessando OS',
        animated: true,
        spinner: 'dots',
      });

      await loading.present();

      const res = await this.db.getById('os', id);
      if (res !== undefined && res !== null) {
        await this.localSt.store('ordemDetalhes', res[0]);
        if (res) {
          loading.dismiss().then((r) => {
            if (r === true) {
              this.navCtrl.navigateForward('/info-os');
              this.platform.backButton.subscribeWithPriority(9999, () => {
                this.navCtrl.back();
              });
            }
          });
        }
      }
    }
  }

  scrollTo(e: any) {
    const elementId = e.target.value;
    const div = document.getElementById(elementId);
    const position = div.getBoundingClientRect();
    const x = position.left;
    const y = position.top - 110;
    this.ioncontent.scrollByPoint(x, y, 200);
  }

  //adicionar validações adicionais aqui
  async validarOSExistentes(
    osBaixadas: Array<any>
  ): Promise<{ baixar: boolean; erro: string }> {
    let baixar: boolean = true;
    let erro: string = '';

    osBaixadas.forEach((os) => {
      //verifica se a data das os que ja foram baixadas sao de dias anteriores
      let dataOS = new Date(os.data);
      dataOS.setDate(dataOS.getDate() + 1);
      let dataOSFormatada = dataOS.toLocaleDateString();
      let dataHoje = new Date();
      let dataHojeFormatada = dataHoje.toLocaleDateString();
      if (dataOSFormatada < dataHojeFormatada) {
        erro =
          'Não é possível baixar novas OS se houverem pendentes de dias anteriores.';
        baixar = false;
      }
    });

    return { baixar, erro };
  }
}
