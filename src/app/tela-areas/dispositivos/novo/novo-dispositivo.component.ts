import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { IonItemSliding, NavController, ToastController } from '@ionic/angular';
import { Database } from 'src/app/shared/providers/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DispositivosService } from 'src/app/shared/servicos/dispositivos.service';
import { AreasPreService } from 'src/app/shared/servicos/areas-pre.service';

@Component({
  selector: 'app-novo-dispositivo',
  templateUrl: './novo-dispositivo.component.html',
  standalone: false,
})
export class NovoDispositivoComponent implements OnInit {
  @LocalStorage('areaid') area: any;
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('osAreaDispositivoSelecionado') dispositivo: any;

  @ViewChild(IonItemSliding) slide: IonItemSliding;

  tiposDispositivos = [];
  areas = [];

  formNovoDispositivo: FormGroup = this.fb.group({
    dispositivo: [null, Validators.required],
    quantidade: [null, Validators.required],
  });

  constructor(
    private localSt: LocalStorageService,
    private navCtrl: NavController,
    private db: Database,
    private fb: FormBuilder,
    public toastController: ToastController,
    public dispositivosService: DispositivosService,
    public areasPreService: AreasPreService
  ) {}

  async ngOnInit() {
    this.tiposDispositivos =
      await this.dispositivosService.listarLocalDispositivos();

    if (this.dispositivo) {
      const dispositivoSelecionado = this.tiposDispositivos.find(
        (td) => td.id == this.dispositivo.id_dispositivo
      );
      this.formNovoDispositivo
        .get('dispositivo')
        .setValue(dispositivoSelecionado);
      this.formNovoDispositivo
        .get('quantidade')
        .setValue(this.dispositivo.quantidade);
    }
  }

  voltar() {
    this.localSt.clear('osAreaDispositivoSelecionado');
    this.navCtrl.back();
  }

  async salvarDispositivo() {
    const idDispositivo = this.formNovoDispositivo.get('dispositivo').value
      .id as string;
    const quantidade = this.formNovoDispositivo.get('quantidade')
      .value as number;
    await this.dispositivosService.save(
      this.dispositivo ? this.dispositivo.id : null,
      this.ordemDetalhes.id,
      this.area.idArea,
      idDispositivo,
      quantidade
    );

    this.voltar();
  }
}
