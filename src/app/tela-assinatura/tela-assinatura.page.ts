import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
// import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { Database } from '../shared/providers/database';
import { OsService } from '../shared/servicos/os.service';

@Component({
  selector: 'app-tela-assinatura',
  templateUrl: './tela-assinatura.page.html',
  styleUrls: ['./tela-assinatura.page.scss'],
  standalone: false,
})
export class TelaAssinaturaPage implements OnInit {
  // dados do local
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('horaFim') horaFim: any;
  @LocalStorage('horaInicio') horaInicio: any;
  @LocalStorage('assinatura') assinatura: any;
  @LocalStorage('infoIniciais') infoIniciais: any;
  @LocalStorage('ordemProdutos') ordemProdutos: any;
  @LocalStorage('mostrarbtnassinardepois') mostrarbtnassinardepois: boolean;
  @LocalStorage('levantamento') levantamento: boolean;

  areasCompletas: any;

  screen_width = document.documentElement.clientWidth;
  screen_heght = document.documentElement.clientHeight;

  exibirAssinaturaConst: boolean;
  imgAssinatura: any;
  exibirBtnsConst: boolean;

  bgColor = 'white';

  // @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signaturePadOptions: any;

  dadosCliente = false;
  formCliente: FormGroup;
  os: any;
  assinarBtn = false;

  constructor(
    private localSt: LocalStorageService,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private db: Database,
    private osService: OsService
  ) {}

  ngOnInit() {
    this.exibirAssinaturaConst = false;
    this.exibirBtnsConst = false;

    this.areasCompletas = this.db.getAreaByOs(this.ordemDetalhes.id);

    this.formCliente = this.fb.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      rg: [null],
      obsGeral: [null, Validators.maxLength(200)],
      obsProximo: [null, Validators.maxLength(200)],
    });

    this.recuperarAssinatura();

    this.signaturePadOptions = {
      minWidth: 1,
      maxWiWidth: 5,
      canvasHeight: this.screen_heght - 250,
      canvasWidth: this.screen_width,
      backgroundColor: 'white',
      dotSize: 1,
    };
  }

  voltar() {
    this.navCtrl.pop();
  }

  // ====

  async assinar() {
    this.dadosCliente = true;
    await this.inserirAssinatura();
  }

  async finalizarLev() {
    this.dadosCliente = true;
    await this.inserirAssinatura();
    await this.modalSucesso();
    await this.osService.enviarOs();
  }
  // ====

  mostrarDados() {
    this.dadosCliente = false;
  }

  // ====

  async inserirAssinatura() {
    const dados = this.montarAssinatura();
    this.db.createQuery(
      'UPDATE os set  nome = "' +
        dados.nome +
        '", rg = "' +
        dados.rg +
        '", obsGeral = "' +
        dados.obsGeral +
        '", obsProximo = "' +
        dados.obsProximo +
        '" WHERE id = ' +
        dados.os
    );
    await this.db.createQuery('select  * from os where id = ' + dados.os);
  }

  // ====

  montarAssinatura() {
    return {
      os: this.ordemDetalhes.id,
      nome: this.formCliente.get('nome').value,
      rg: this.formCliente.get('rg').value,
      obsGeral: this.formCliente.get('obsGeral').value,
      obsProximo: this.formCliente.get('obsProximo').value,
    };
  }

  async recuperarAssinatura() {
    this.os = await this.db.getById('os', this.ordemDetalhes.id);
    if (this.os.length > 0) {
      this.formCliente.patchValue({
        nome: this.os[0].nome,
        rg: this.os[0].rg,
        obsGeral: this.os[0].obsGeral,
        obsProximo: this.os[0].obsProximo,
      });
      this.assinarBtn = true;
    }

    this.imgAssinatura = this.os[0].assinatura;
  }

  // ====

  asssinaturaCompleta() {
    // this.imgAssinatura = this.signaturePad.toDataURL('image/png', 0.5);
    this.db.createQuery(
      'UPDATE os SET assinatura = "' +
        this.imgAssinatura +
        '" WHERE id = ' +
        this.ordemDetalhes.id
    );
    this.exibirBtnsConst = true;
  }

  async limparAssinatura() {
    this.exibirBtnsConst = false;
    this.exibirAssinaturaConst = false;
    this.db.createQuery(
      'UPDATE os SET assinatura = null WHERE id = ' + this.ordemDetalhes.id
    );
    // this.signaturePad.clear();
    this.imgAssinatura = null;
  }

  async finalizarOs() {
    await this.modalSucesso();
    await this.osService.enviarOs();
  }

  async assinarDepois() {
    this.navCtrl.navigateForward('/lista-areas');
  }

  endSignature() {
    this.exibirBtnsConst = true;
  }

  async continuarOs() {
    this.asssinaturaCompleta();
    await this.db.createQuery(
      'UPDATE os SET horaInicio = "' +
        this.horaInicio +
        '", horaFim = "' +
        Date.now() +
        '" WHERE id = ' +
        this.ordemDetalhes.id
    );
    this.navCtrl.navigateForward('/lista-areas');
  }

  async modalSucesso() {
    this.asssinaturaCompleta();
    await this.db.createQuery(
      'UPDATE os SET status = 1, horaInicio = "' +
        this.horaInicio +
        '", horaFim = "' +
        Date.now() +
        '" WHERE id = ' +
        this.ordemDetalhes.id
    );
    this.localSt.clear('horaInicio');
    const alert = await this.alertCtrl.create({
      message: 'Ordem de serviço finalizada!',
    });

    await alert.present();

    setTimeout(() => {
      alert.dismiss().then(() => {
        this.navCtrl.navigateForward('/lista-os');
      });
    }, 2500);
  }
}
