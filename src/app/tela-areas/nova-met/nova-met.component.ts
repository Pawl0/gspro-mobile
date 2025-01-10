import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { ActivatedRoute } from '@angular/router';
import { Metodologia } from 'src/app/shared/modelos/os';
import { NavController, Platform } from '@ionic/angular';
import { Database } from 'src/app/shared/providers/database';

@Component({
  selector: 'app-nova-met',
  templateUrl: './nova-met.component.html',
  styleUrls: ['./nova-met.component.scss'],
  standalone: false,
})
export class NovaMetComponent implements OnInit {
  // dados armazenados no local storage
  @LocalStorage('areaMetodologia') areaMetodologia: any;
  @LocalStorage('areaCods') areaCods: any;

  @LocalStorage('areaid') areaid: any;
  @LocalStorage('ordemdetalhes') ordemDetalhes: any;
  @LocalStorage('levantamento') levantamento: any;

  listaMet: Metodologia[];

  metodologiaDet: any;
  metodoDet: any;
  listaMetodo: any;
  listaProd: any;
  produto: any;
  produtos: any = [];

  @Output()
  fecharModal = new EventEmitter();

  @Output()
  mostrarSalvar = new EventEmitter();

  // formulário
  formMetod: FormGroup;

  inpQtd: boolean;

  mostrarQtd: boolean;

  mostrarFooter: boolean;

  constructor(
    private fb: FormBuilder,
    private localSt: LocalStorageService,
    private ac: ActivatedRoute,
    private navCtrl: NavController,
    private platform: Platform,
    private db: Database
  ) {
    this.form();
    this.metodoInicial();
  }

  ngOnInit() {}

  // ====

  async metodoInicial() {
    if (!this.levantamento) {
      this.metodologiaDet = await this.db.getAll('metodologia');
    } else {
      this.metodologiaDet = await this.db.createQuery(
        'SELECT met.* FROM metodologia AS met JOIN metodo AS mt ON met.id = mt.id_metodologia WHERE mt.modulo = 1 GROUP BY met.id'
      );
    }

    this.listaMet = this.metodologiaDet;

    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.voltar();
    });
  }

  // ====

  form() {
    return (this.formMetod = this.fb.group({
      metodologia: [null, Validators.required],
      metodo: [null, Validators.required],
      produto: [null, Validators.required],
      qtdMod: undefined,
    }));
  }

  // ====

  patchFormInicial(metodologia: any, metodo: any, produto: any, qtd?: any) {
    this.formMetod = this.fb.group({
      metodologia: [metodologia, Validators.required],
      metodo: [metodo, Validators.required],
      produto: [produto, Validators.required],
      qtdMod: [qtd],
    });

    this.formMetod.get('qtdMod').setValidators([Validators.required]);
    this.formMetod.get('qtdMod').updateValueAndValidity();
  }

  // ====

  voltar() {
    this.navCtrl.back();
    setTimeout(() => {
      this.localSt.clear('metodologia');
      this.localSt.clear('metodo');
      this.localSt.clear('produto');
    }, 10);
  }

  // ====

  async gravarMetodologia(valor: any) {
    this.metodologiaDet = await valor.value;
    await this.formMetod.get('metodo').patchValue(null);
    await this.formMetod.get('produto').patchValue(null);
    await this.formMetod.get('qtdMod').patchValue(null);
    this.mostrarFooter = await false;
    this.mostrarQtd = await false;
    this.listaMetodo = await this.db.createQuery(
      'SELECT id, nome, modulo FROM metodo WHERE id_metodologia = ' +
        valor.value.id
    );
  }

  // ====

  async gravarMetodo(valor: any) {
    this.produtos = await valor.value.produtos;
    this.metodoDet = await valor.value;
    await this.formMetod.get('produto').patchValue(null);
    await this.formMetod.get('qtdMod').patchValue(null);
    this.listaProd = await this.db.createQuery(
      'SELECT * FROM produto prod JOIN produtoMetodo prodMet ON prod.id = prodMet.id_produto WHERE prodMet.id_metodo = ' +
        valor.value.id
    );
  }

  // ====

  gravarProd(valor: any) {
    this.produto = valor.value;
    const metodo = this.formMetod.get('metodo').value;
    const showQtd = metodo.modulo;
    if (showQtd === 1) {
      this.mostrarQtd = true;
      this.mostrarFooter = false;
      this.formMetod.get('qtdMod').setValidators([Validators.required]);
      this.formMetod.get('qtdMod').updateValueAndValidity();
    } else if (showQtd === 0) {
      this.mostrarQtd = false;
      this.mostrarFooter = true;
    }
  }

  patch() {
    if (this.mostrarQtd === true) {
      return {
        metodologia: {
          id: +this.metodologiaDet.id,
          nome: this.metodologiaDet.nome,
        },
        metodo: {
          id: +this.metodoDet.id,
          nome: this.metodoDet.nome,
        },
        produto: {
          id: +this.produto.id,
          nome: this.produto.nome,
        },
        qtdMod: +this.formMetod.get('qtdMod').value,
      };
    } else if (!this.levantamento) {
      return {
        metodologia: {
          id: +this.metodologiaDet.id,
          nome: this.metodologiaDet.nome,
        },
        metodo: {
          id: +this.metodoDet.id,
          nome: this.metodoDet.nome,
        },
        produto: {
          id: +this.produto.id,
          nome: this.produto.nome,
        },
      };
    } else {
      return {
        metodologia: {
          id: +this.metodologiaDet.id,
          nome: this.metodologiaDet.nome,
        },
        metodo: {
          id: +this.metodoDet.id,
          nome: this.metodoDet.nome,
        },
        produto: {
          id: 0,
          nome: ' ',
        },
        qtdMod: +this.formMetod.get('qtdMod').value,
      };
    }
  }

  // ====

  async gravarDados() {
    const data = await this.patch();
    if (data.qtdMod !== null && data.qtdMod !== undefined) {
      this.db.insert(
        'produtoOs',
        'os,  idArea, idAreaOs, id_produto, id_metodo, id_metodologia, qtd_modulo',
        [
          this.ordemDetalhes.id,
          this.areaid.id,
          this.areaid.idArea,
          data.produto.id,
          data.metodo.id,
          data.metodologia.id,
          data.qtdMod,
        ]
      );
    } else {
      this.db.insert(
        'produtoOs',
        'os, idArea, idAreaOs, id_produto, id_metodo, id_metodologia',
        [
          this.ordemDetalhes.id,
          this.areaid.id,
          this.areaid.idArea,
          data.produto.id,
          data.metodo.id,
          data.metodologia.id,
        ]
      );
    }

    await this.mostrarSalvar.emit();
    await this.formMetod.get('qtdMod').clearValidators();
    await this.formMetod.get('qtdMod').updateValueAndValidity();
    await this.voltar();
  }

  // ====

  qtd() {
    if (this.formMetod.get('qtdMod').valid) {
      this.mostrarFooter = true;
    } else {
      this.mostrarFooter = false;
    }
  }

  // ====

  async salvarMet() {
    await this.localSt.store('areaMetodologia', [this.patch()]);
  }

  // ====

  async updateMet(i: number) {
    if (this.ac.snapshot.params['i']) {
      const resultado = await this.areaMetodologia.find(
        (met: any) => met === this.areaMetodologia[i]
      );

      if (resultado !== undefined) {
        await this.areaMetodologia.splice(resultado, 1);
        this.areaMetodologia = await this.areaMetodologia;
      }
    }
    await this.addMet();
  }

  // ====

  async addMet() {
    await this.areaMetodologia.push(this.patch());
    this.areaMetodologia = await this.areaMetodologia;
  }
}
