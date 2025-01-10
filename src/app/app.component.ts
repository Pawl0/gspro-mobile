import { Component } from '@angular/core';
import { InicialService } from './shared/servicos/inicial.service';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { AlertController, Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false,
})
export class AppComponent {
  @LocalStorage('dbCriado') dbCriado: any;
  versaoApp: string;

  constructor(
    private inicialService: InicialService,
    public alertController: AlertController,
    private localSt: LocalStorageService,
    private platform: Platform,
    private navCtrl: NavController
  ) {
    this.platform.ready().then(() => {
      document.addEventListener('backbutton', () => {
        this.navCtrl.pop();
      });

      document.addEventListener(
        'resume',
        async (evt: any) => {
          if (evt.action === 'resume' && evt.pendingResult) {
            var r = evt.pendingResult;
            if (r.pluginServiceName === 'Camera' && r.pluginStatus === 'OK') {
              console.log(r.result);
              await this.localSt.store('lastPicture', r.result);
            }
          }
        },
        false
      );

      try {
        //this.inicialService.salvarInicialDb();
      } catch (e) {
        console.log(e);
      }
    });
  }
}
