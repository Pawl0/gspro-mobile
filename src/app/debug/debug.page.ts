import { Database } from './../shared/providers/database';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { Device } from '@ionic-native/device/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.page.html',
  styleUrls: ['./debug.page.scss'],
  standalone: false,
})
export class DebugPage implements OnInit {
  @LocalStorage('horaInicio') horaInicio: any;
  @LocalStorage('oscomplemento') oscomplemento: any;

  areas: any;
  pragas: any;
  metodologias: any;
  metodos: any;
  produtos: any;
  franquias: any;
  fraseNaoExec: any;
  frases: any;
  tecnicos: any;
  obs: any;
  complementos: any;
  recomendacaes: any;
  produtoOs: any;
  json: any;
  produtoMetodo: any;
  modulos: any;
  areasOs: any;
  pragasOs: any;
  listaOs: any;

  contador: number = 0;
  os: any;
  senha: any;
  senhaPadrao: string = 'jpp';

  constructor(
    private device: Device,
    private androidPermissions: AndroidPermissions,
    public alertController: AlertController,
    private db: Database,
    private navCtrl: NavController,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    this.contador = 0;
    this.listaOs = await this.db.getAll('os');
    this.json = await this.db.getAll('json');
    this.areasOs = await this.db.getAll('areaOs');
    this.pragasOs = await this.db.getAll('pragaOs');
    this.obs = await this.db.getAll('obs');
    this.complementos = await this.db.getAll('complemento');
    this.recomendacaes = await this.db.getAll('recomendacao');
    this.produtoOs = await this.db.getAll('produtoOs');
    this.produtoMetodo = await this.db.getAll('produtoMetodo');
    this.modulos = await this.db.getAll('modulo');
  }

  async getUUID() {
    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );

    if (!hasPermission) {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );

      if (!result.hasPermission) {
        throw new Error('Permissions required');
      }

      // ok, a user gave us permission, we can get him identifiers after restart app
      // @ts-ignore
      return;
    }

    return this.device.uuid;
  }

  async deleteAllOs() {
    if (this.senha == this.senhaPadrao) {
      await this.db.deleteAll('obs');
      await this.db.deleteAll('complemento');
      await this.db.deleteAll('recomendacao');
      await this.db.deleteAll('pragaOs');
      await this.db.deleteAll('produtoOs');
      await this.db.deleteAll('areaOs');
      await this.db.deleteAll('json');
      await this.db.deleteAll('os');
      this.listaOs = await this.db.getAll('os');
      this.json = await this.db.getAll('json');
      this.areasOs = await this.db.getAll('areaOs');
      this.pragasOs = await this.db.getAll('pragaOs');
      this.obs = await this.db.getAll('obs');
      this.complementos = await this.db.getAll('complemento');
      this.recomendacaes = await this.db.getAll('recomendacao');
      this.produtoOs = await this.db.getAll('produtoOs');
      this.horaInicio = null;
      this.oscomplemento = null;
    } else {
      alert('Senha incorreta');
    }
  }

  voltar() {
    this.navCtrl.back();
  }

  async validarDevice() {
    const alert = await this.alertController.create({
      header: '',
      message: 'UUID: ' + this.device.uuid,
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
      ],
    });

    await alert.present();
  }
  async deleteJson(os) {
    if (this.senha == this.senhaPadrao) {
      await this.db.deleteByOs('json', os);
      this.json = await this.db.getAll('json');
    } else {
      alert('Senha incorreta');
    }
  }

  async deleteAreaOs(id) {
    if (this.senha == this.senhaPadrao) {
      await this.db.deleteById('areaOs', id);
      this.areasOs = await this.db.getAll('areaOs');
    } else {
      alert('Senha incorreta');
    }
  }

  async deleteProdutoOs(id) {
    if (this.senha == this.senhaPadrao) {
      await this.db.deleteById('produtoOs', id);
      this.produtoOs = await this.db.getAll('produtoOs');
    } else {
      alert('Senha incorreta');
    }
  }

  async deletePragaOs(id) {
    if (this.senha == this.senhaPadrao) {
      await this.db.deleteById('pragaOs', id);
      this.pragasOs = await this.db.getAll('pragaOs');
    } else {
      alert('Senha incorreta');
    }
  }

  async deleteComp(id) {
    if (this.senha == this.senhaPadrao) {
      await this.db.deleteById('complemento', id);
      this.complementos = await this.db.getAll('complemento');
    } else {
      alert('Senha incorreta');
    }
  }

  async deleteReco(id) {
    if (this.senha == this.senhaPadrao) {
      await this.db.deleteById('recomendacao', id);
      this.recomendacaes = await this.db.getAll('recomendacao');
    } else {
      alert('Senha incorreta');
    }
  }

  async deleteAllByOs() {
    if (this.senha == this.senhaPadrao) {
      await this.db.deleteByOs('obs', this.os);
      await this.db.deleteByOs('complemento', this.os);
      await this.db.deleteByOs('recomendacao', this.os);
      await this.db.deleteByOs('pragaOs', this.os);
      await this.db.deleteByOs('produtoOs', this.os);
      await this.db.deleteByOs('areaOs', this.os);
      await this.db.deleteByOs('json', this.os);
      await this.db.deleteById('os', this.os);
      await this.db.deleteById('osDispositivo', this.os);
      await this.db.deleteById('osDispositivoPraga', this.os);
      this.listaOs = await this.db.getAll('os');
      this.json = await this.db.getAll('json');
      this.areasOs = await this.db.getAll('areaOs');
      this.pragasOs = await this.db.getAll('pragaOs');
      this.obs = await this.db.getAll('obs');
      this.complementos = await this.db.getAll('complemento');
      this.recomendacaes = await this.db.getAll('recomendacao');
      this.produtoOs = await this.db.getAll('produtoOs');
      this.horaInicio = null;
      this.oscomplemento = null;
    } else {
      alert('Senha incorreta');
    }
  }

  async sendJson(data) {
    this.http.post(environment.api_webservice + '/save', data).subscribe(
      (res) => {
        console.log(res);
        alert('Enviado, cheque a tabela error');
      },
      (err) => {
        console.log(err);
        alert('Erro ao enviar');
      }
    );
  }

  clearHoraInicio() {
    if (this.senha == this.senhaPadrao) {
      this.horaInicio = null;
      this.contador = 0;
      alert('Hora inicio zerada');
    } else {
      alert('Senha incorreta');
    }
  }
}
