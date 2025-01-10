import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { OsService } from 'src/app/shared/servicos/os.service';
import { Os } from 'src/app/shared/modelos/os';
import { ComplementosService } from 'src/app/shared/servicos/complementos.service';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { environment as ENV } from 'src/environments/environment';
import { CallNumber } from '@ionic-native/call-number/ngx';
import {
  Platform,
  IonItemSliding,
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import {
  LaunchNavigator,
  LaunchNavigatorOptions,
} from '@ionic-native/launch-navigator/ngx';
import { ListaComplementosComponent } from 'src/app/tela-lista-os/lista-complementos/lista-complementos.component';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Database } from 'src/app/shared/providers/database';

@Component({
  selector: 'tela-lista-os-lista-os',
  templateUrl: './lista-os.component.html',
  styleUrls: ['./lista-os.component.scss'],
  standalone: false,
})
export class ListaOsComponent implements OnInit {
  @LocalStorage('osConfirmadas') osConfirmadas: any;
  @LocalStorage('horaInicio') horaInicio: string;
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('infoIniciais') infoIniciais: any;
  @LocalStorage('ordemComplementos') ordemComplementos: any;

  @ViewChild(ListaComplementosComponent) telaComp: any;

  @ViewChild(IonItemSliding) slide: IonItemSliding;

  @Input() aguardando: Os[];

  pwaBrowser: any = false;

  // constante
  semOrdens: boolean;

  constructor(
    private osService: OsService,
    private complementosService: ComplementosService,
    private localSt: LocalStorageService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private callNumber: CallNumber,
    private platform: Platform,
    private launchNavigator: LaunchNavigator,
    private androidPermissions: AndroidPermissions,
    private navCtrl: NavController,
    private db: Database
  ) {}

  ngOnInit() {
    this.pwaBrowser =
      window.matchMedia('(display-mode: standalone)').matches ||
      document.URL.indexOf('http') !== 0 ||
      document.URL.indexOf('http://localhost:8080') !== 0;
  }
}
