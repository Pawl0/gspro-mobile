import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import {
  IonItemSliding,
  NavController,
  ToastController,
  AlertController,
} from '@ionic/angular';
import { Database } from 'src/app/shared/providers/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gerenciar-dispositivo',
  templateUrl: './gerenciar-dispositivo.component.html',
  styleUrls: ['./gerenciar-dispositivo.component.scss'],
  standalone: false,
})
export class GerenciarDispositivoComponent implements OnInit {
  @LocalStorage('areaid') areaid: any;
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('osAreaDispositivoSelecionado') dispositivo: any;

  @ViewChild(IonItemSliding) slide: IonItemSliding;

  disableActions: boolean = false;
  dispositivoPragas: any = [];
  pragas: any = [];

  formPraga: FormGroup = this.fb.group({
    praga: [null, Validators.required],
    quantidade: [null, Validators.required],
  });

  formConsumo: FormGroup = this.fb.group({
    consumido: [false, Validators.required],
  });

  constructor(
    private alertCtrl: AlertController,
    private localSt: LocalStorageService,
    private navCtrl: NavController,
    private db: Database,
    private fb: FormBuilder,
    public toastController: ToastController
  ) {}

  async ngOnInit() {
    this.dispositivoPragas = await this.db.getDispositivoPragas(
      this.ordemDetalhes.id,
      this.dispositivo.id_dispositivo
    );
    if (
      this.dispositivo.deConsumo &&
      this.dispositivoPragas &&
      this.dispositivoPragas.length > 0
    ) {
      this.formConsumo.setValue({
        consumido: this.dispositivoPragas[0].consumido,
      });
    }
    this.pragas = await this.db.getAll('praga');
  }

  ionViewWillEnter() {}

  voltar(): void {
    this.localSt.clear('osAreaSelecionadaId');
    this.navCtrl.back();
  }

  async remover(index: number) {
    this.disableActions = true;
    this.slide.closeOpened();
    try {
      if (index !== -1) {
        await this.db.deleteById(
          'osDispositivoPraga',
          this.dispositivoPragas[index].id
        );
        this.dispositivoPragas.splice(index, 1);
        this.mostrarToast('Removido com sucesso!');
      }
    } catch (error) {
      this.mostrarToast('Erro ao remover praga!');
      console.log(error);
    } finally {
      this.disableActions = false;
    }
  }

  async salvarDispositivoPraga() {
    this.disableActions = true;
    try {
      if (!this.formPraga.valid) {
        return;
      }

      const praga = this.formPraga.get('praga').value;
      const quantidade = this.formPraga.get('quantidade').value;

      const itemJaInseridoIndex = this.dispositivoPragas.findIndex(
        (dp: any) => dp.id_praga == praga.id
      );
      if (itemJaInseridoIndex !== -1) {
        const dispositivoPraga = this.dispositivoPragas[itemJaInseridoIndex];
        dispositivoPraga.quantidade += quantidade;
        await this.db.update(
          'osDispositivoPraga',
          'quantidade',
          [dispositivoPraga.quantidade],
          `id = ${dispositivoPraga.id}`
        );
      } else {
        const dispositivoPragaData = [
          this.dispositivo.id_dispositivo,
          praga.id,
          quantidade,
          praga.nome,
          false,
          this.ordemDetalhes.id,
        ];
        await this.db.insert(
          'osDispositivoPraga',
          'id_dispositivo, id_praga, quantidade, praga, consumido, os',
          dispositivoPragaData
        );
        this.dispositivoPragas = await this.db.getDispositivoPragas(
          this.ordemDetalhes.id,
          this.dispositivo.id_dispositivo
        );
      }

      // let my = "";
      // for (const d of this.dispositivoPragas) {
      //   my += " -- " + JSON.stringify(d);
      // }
      // const alert = await this.alertCtrl.create({
      //   message: my,
      // });
      // await alert.present();

      this.mostrarToast('Inserido com sucesso!');
      this.formPraga.reset();
    } catch (error) {
      this.mostrarToast('Erro ao inserir praga!');
      console.log(error);
    } finally {
      this.disableActions = false;
    }
  }

  async salvarDispositivoConsumo() {
    this.disableActions = true;
    try {
      if (!this.formConsumo.valid || !this.dispositivo.deConsumo) {
        return;
      }
      if (this.dispositivoPragas && this.dispositivoPragas.length > 0) {
        await this.db.update(
          'osDispositivoPraga',
          'consumido',
          [this.formConsumo.get('consumido').value],
          `id = ${this.dispositivoPragas[0].id}`
        );
      } else {
        const dispositivoConsumo = [
          this.dispositivo.id_dispositivo,
          this.formConsumo.get('consumido').value,
          this.ordemDetalhes.id,
        ];
        await this.db.insert(
          'osDispositivoPraga',
          'id_dispositivo, consumido, os',
          dispositivoConsumo
        );
      }
      this.mostrarToast('Atualizado com sucesso!');
      this.dispositivoPragas = await this.db.getDispositivoPragas(
        this.ordemDetalhes.id,
        this.dispositivo.id_dispositivo
      );
    } catch (error) {
      this.mostrarToast('Erro ao salvar a opção de consumo!');
      console.log(error);
    } finally {
      this.disableActions = false;
    }
  }

  async mostrarToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
    });
    toast.present();
  }
}
