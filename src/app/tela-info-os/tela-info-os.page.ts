import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { environment as ENV } from 'src/environments/environment';
import { ComplementosService } from 'src/app/shared/servicos/complementos.service';
import { Platform, ModalController, NavController } from '@ionic/angular';
import { SelecaoTecnicosComponent } from 'src/app/inicial/selecao-tecnicos/selecao-tecnicos.component';
import { google } from 'google-maps';
import { LoadingController } from '@ionic/angular';
import {
  LaunchNavigator,
  LaunchNavigatorOptions,
} from '@ionic-native/launch-navigator/ngx';
import { TelaNaoExecPage } from 'src/app/tela-nao-exec/tela-nao-exec.page';
import { Database } from '../shared/providers/database';

@Component({
  selector: 'app-tela-info-os',
  templateUrl: './tela-info-os.page.html',
  styleUrls: ['./tela-info-os.page.scss'],
  standalone: false,
})
export class TelaInfoOsPage implements OnInit {
  // dados salvos no local storage
  @LocalStorage('rota') infoRota: any;
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('horaInicio') horaInicio: string;
  @LocalStorage('osConfirmadas') osConfirmadas: any;
  @LocalStorage('infoIniciais') infoIniciais: any;

  @ViewChild('map') mapElement: any;

  equipeLength = 0;

  map: any;
  google: google;

  constructor(
    private localSt: LocalStorageService,
    private platform: Platform,
    private launchNavigator: LaunchNavigator,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private comp: ComplementosService,
    private db: Database
  ) {
    this.checarObs();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.metodoInicial();
    if (
      this.infoIniciais.equipe !== null &&
      this.infoIniciais.equipe !== undefined
    ) {
      this.equipeLength = this.infoIniciais.equipe.length;
    }
  }

  metodoInicial() {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.voltar();
    });

    this.initMap();
  }

  voltar() {
    if (this.horaInicio !== null) {
      this.navCtrl.pop().then(() => {
        this.navCtrl.navigateBack('lista-os');
      });
    } else {
      this.navCtrl.pop().then(() => {
        this.navCtrl.navigateBack('lista-os').then(() => {
          setTimeout(() => {
            this.localSt.clear('ordemDetalhes');
          }, 100);
        });
      });
    }
  }

  async listaComplementos(id: number) {
    await this.abrirModalComplementos(id);
  }

  // ====

  abrirModalComplementos(id: any) {
    this.localSt.store('osComplemento', id);
    this.navCtrl.navigateForward(['/lista-os/complementos']);
  }

  async trocarRota() {
    const modal = await this.modalCtrl.create({
      component: SelecaoTecnicosComponent,
    });
    this.loadingController.dismiss();
    return modal.present();
  }

  // ====

  async naoExec() {
    const modal = await this.modalCtrl.create({
      component: TelaNaoExecPage,
    });

    modal.onWillDismiss().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        this.voltar();
      });
    });

    this.platform.backButton.subscribeWithPriority(9999, () => {
      modal.dismiss();
    });

    return modal.present();
  }

  // ====

  async acessarListaAreas() {
    const os = await this.db.getBy(
      'os',
      'assinatura',
      ' WHERE id = ' + this.ordemDetalhes.id
    );

    if (this.horaInicio === null || this.horaInicio === undefined) {
      this.localSt.store('horaInicio', Date.now());
    }
    if (
      this.infoIniciais.franquia.assinatura_franquia &&
      (os[0].assinatura == null ||
        os[0].assinatura == undefined ||
        os[0].assinatura == '' ||
        os[0].assinatura == ' ')
    ) {
      this.localSt.store('mostrarbtnassinardepois', true);
      this.navCtrl.navigateForward(['/assinatura']);
    } else {
      this.localSt.store('mostrarbtnassinardepois', false);
      this.navCtrl.navigateForward(['/lista-areas']);
    }
  }

  // ====

  initMap() {
    const coords = new google.maps.LatLng(
      this.ordemDetalhes.latitude,
      this.ordemDetalhes.longitude
    );

    const mapOptions: google.maps.MapOptions = {
      center: coords,
      zoom: 14,
      disableDefaultUI: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    const icon = {
      url: './../../assets/icon/rato.png',
      scaledSize: new google.maps.Size(25, 25),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0),
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    const marker = new google.maps.Marker({
      position: coords,
      map: this.map,
      title: 'Local',
      animation: google.maps.Animation.DROP,
      icon: icon,
    });
  }

  // ====

  abrirMapa() {
    const linkMaps =
      'https://www.google.com/maps?api=' +
      ENV.maps_api_key +
      '&q=' +
      this.ordemDetalhes.latitude +
      ',' +
      this.ordemDetalhes.longitude +
      '&ll=' +
      this.ordemDetalhes.latitude +
      ',' +
      this.ordemDetalhes.longitude +
      '&z=17';

    const linkMapsIos =
      'maps://www.google.com/maps?api=' +
      ENV.maps_api_key +
      '&q=' +
      this.ordemDetalhes.latitude +
      ',' +
      this.ordemDetalhes.longitude +
      '&ll=' +
      this.ordemDetalhes.latitude +
      ',' +
      this.ordemDetalhes.longitude +
      '&z=17';

    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      document.URL.indexOf('http') !== 0 ||
      document.URL.indexOf('http://localhost:8080') !== 0
    ) {
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
      if (this.platform.is('android') || this.platform.is('ios')) {
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

  async checarObs() {
    const obs = await this.db.getByOs('obs', this.ordemDetalhes.id);
    if (obs.length < 1) {
      this.comp.salvarComplementos(
        this.infoIniciais.franquia.id_franquia,
        this.infoIniciais.rota.id
      );
    }
  }
}
