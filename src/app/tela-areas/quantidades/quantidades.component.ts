import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { LocalStorage } from 'ngx-webstorage';
import { Database } from 'src/app/shared/providers/database';

@Component({
  selector: 'app-quantidades',
  templateUrl: './quantidades.component.html',
  styleUrls: ['./quantidades.component.scss'],
  standalone: false,
})
export class QuantidadesComponent implements OnInit {
  @LocalStorage('ordemProdutos') ordemProdutos: any;
  @LocalStorage('ordemdetalhes') ordemDetalhes: any;

  formProdutos: FormGroup;
  produtos = [];
  control = [];
  areasCompletas: any;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private fb: FormBuilder,
    private db: Database
  ) {
    this.form();
    this.metodoInicial();
  }

  ngOnInit() {}

  // ====

  async metodoInicial() {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      this.voltar();
    });

    await this.getProdutos();
    await this.patchForm();
  }

  // ====

  voltar() {
    this.navCtrl.pop().then(() => {
      this.navCtrl.navigateBack('/lista-areas').then(() => {
        this.gravarDados(this.formProdutos.get('produto').value);
      });
    });
  }

  // ====

  form() {
    this.formProdutos = this.fb.group({
      produto: this.fb.array([]),
    });
  }

  // ====

  patchForm() {
    const control = <FormArray>this.formProdutos.controls['produto'];

    if (this.produtos) {
      if (this.produtos.length > 0) {
        this.produtos.forEach((produto: any) => {
          control.push(
            this.patchValues(produto.id, produto.nome, produto.qtd_modulo)
          );
        });
      }
    }
  }

  // ====

  patchValues(id: number, nome: string, quantidade?: number) {
    let form;
    if (this.produtos) {
      form = this.fb.group({
        id: [id],
        nome: [nome],
        quantidade: [quantidade, Validators.required],
      });
    } else {
      form = this.fb.group({
        id: [id],
        nome: [nome],
        quantidade: [null, Validators.required],
      });
    }
    return form;
  }

  // ====

  gravarDados(dados: any) {
    dados.forEach((prod) => {
      this.db.createQuery(
        'UPDATE produtoOs SET qtd_modulo = ' +
          prod.quantidade +
          ' WHERE id = ' +
          prod.id
      );
    });
  }

  // ====

  relatorio() {
    this.navCtrl.navigateForward('/relatorio').then(() => {
      this.gravarDados(this.formProdutos.get('produto').value);
    });
  }

  async getProdutos() {
    this.produtos = await this.db.createQuery(
      `SELECT P.*, PRO.nome FROM produtoOs AS
     P JOIN produto AS PRO ON P.id_produto = PRO.id join metodo m on p.id_metodo = m.id  WHERE m.modulo = 0  and  P.os = ` +
        this.ordemDetalhes.id +
        ` GROUP BY P.id_produto`
    );
  }
}
