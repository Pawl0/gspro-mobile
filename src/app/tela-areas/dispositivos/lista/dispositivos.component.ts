import { Component, HostListener, OnInit } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { NavController, ToastController } from '@ionic/angular';
import { Database } from 'src/app/shared/providers/database';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dispositivos',
  templateUrl: './dispositivos.component.html',
  styleUrls: ['./dispositivos.component.scss'],
  standalone: false,
})
export class DispositivosComponent {
  @LocalStorage('areaid') areaid: any;
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('levantamento') levantamento: boolean;

  levantamentoAreaDispositivos: any = [];
  osAreaDispositivos: any = [];
  scanSub: Subscription;

  constructor(
    private localSt: LocalStorageService,
    private navCtrl: NavController,
    private db: Database,
    private qrScanner: QRScanner,
    public toastController: ToastController,
    public platform: Platform
  ) {}

  ionViewDidLeave() {
    this.cancelScan();
  }

  async ionViewWillEnter() {
    if (this.levantamento) {
      await this.loadLevantamentoAreaDispositivos();
    } else {
      await this.loadOsAreaDispositivos();
    }
  }

  private async loadLevantamentoAreaDispositivos() {
    this.levantamentoAreaDispositivos = await this.db.getLevDispositivos(
      this.ordemDetalhes.id,
      this.areaid.idArea
    );
  }

  private async loadOsAreaDispositivos() {
    this.osAreaDispositivos = await this.db.getOsDispositivos(
      this.ordemDetalhes.id,
      this.areaid.idArea
    );
  }

  voltar(): void {
    this.navCtrl.back();
  }

  gerenciarDispositivo(dispositivo: any) {
    this.localSt.store('osAreaDispositivoSelecionado', dispositivo);
    this.navCtrl.navigateForward('/lista-areas/dispositivo/gerenciar');
  }

  lerQRCode() {
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show();
          document.getElementsByTagName('body')[0].style.opacity = '0';
          this.scanSub = this.qrScanner.scan().subscribe(
            (textFound: string) => {
              this.cancelScan();
              this.irParaDispositivo(textFound);
            },
            (err) => {
              this.mostrarToast('Erro ao ler o QRCode! ' + err);
              console.log(err);
            }
          );
        } else if (status.denied) {
          this.mostrarToast('Acesso negado para ler o QRCode!');
        } else {
          this.mostrarToast('Erro ao ler o QRCode!');
        }
      })
      .catch((e: any) => console.log(JSON.stringify(e)));
  }

  private cancelScan() {
    document.getElementsByTagName('body')[0].style.opacity = '1';

    if (this.qrScanner) {
      this.qrScanner.hide();
      this.qrScanner.destroy();
    }
    if (this.scanSub) {
      this.scanSub.unsubscribe();
    }
  }

  editarDispositivo(dispositivo: any) {
    this.localSt.store('osAreaDispositivoSelecionado', dispositivo);
    this.navCtrl.navigateForward('/lista-areas/dispositivo/novo');
  }

  async inserirDispositivo() {
    this.navCtrl.navigateForward('/lista-areas/dispositivo/novo');
  }

  async irParaDispositivo(dispositivoId: string) {
    const dispositivo = this.osAreaDispositivos.find(
      (dispositivo: any) =>
        dispositivo.id_dispositivo == parseInt(dispositivoId)
    );
    if (dispositivo) {
      this.gerenciarDispositivo(dispositivo);
    } else {
      this.mostrarToast('Dispositivo inválido!');
    }
  }

  async mostrarToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
    });
    toast.present();
  }

  async removerEnderecoDispositivos(id: any) {
    await this.db.deleteById('levDispositivo', id);
    await this.loadLevantamentoAreaDispositivos();
  }
}
