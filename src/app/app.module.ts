import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { Device } from '@ionic-native/device/ngx';
import { PinDialog } from '@ionic-native/pin-dialog/ngx';

import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import {
  FileTransfer,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Network } from '@ionic-native/network/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { InicialPageModule } from './inicial/inicial.module';
import { TelaNaoExecPageModule } from './tela-nao-exec/tela-nao-exec.module';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { LocalStorageService } from 'ngx-webstorage';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    InicialPageModule,
    TelaNaoExecPageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CallNumber,
    Uid,
    Device,
    PinDialog,
    LaunchNavigator,
    AppUpdate,
    AppVersion,
    FileTransfer,
    File,
    FileOpener,
    FileTransferObject,
    Toast,
    SQLite,
    BackgroundMode,
    InAppBrowser,
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    QRScanner,
    Base64,
    LocalStorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
