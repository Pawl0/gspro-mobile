import { NavController } from '@ionic/angular';
import { Component, OnInit, NgZone } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { ActivatedRoute } from '@angular/router';
import { AreasDbService } from 'src/app/shared/servicos/areas-db.service';

@Component({
  selector: 'app-consumidas',
  templateUrl: './consumidas.component.html',
  styleUrls: ['./consumidas.component.scss'],
  standalone: false,
})
export class ConsumidasComponent implements OnInit {
  @LocalStorage('ordemDetalhes') ordemDetalhes: any;
  @LocalStorage('iscasConsumidas') iscasConsumidas: any;
  @LocalStorage('moduloSelecionado') moduloSelecionado: any;
  @LocalStorage('areasCompletadas') areasCompletadas: any;
  @LocalStorage('areaId') areaId: any;

  numbers: any;

  consumidas = 0;

  index = [];

  moduloUsado: any;
  moduloSalvo: any;

  constructor(
    private navCtrl: NavController,
    private ac: ActivatedRoute,
    private localSt: LocalStorageService,
    private zone: NgZone,
    private areasDbService: AreasDbService
  ) {}

  ngOnInit() {
    this.metodoInicial();
  }

  // ====

  metodoInicial() {
    const id = +this.ac.snapshot.params['id'];

    this.numbers = Array(this.moduloSelecionado.qtd)
      .fill(0)
      .map((x, i) => i);

    let oldIndex: any = [];

    if (this.iscasConsumidas) {
      this.moduloSalvo = this.iscasConsumidas.find((x: any) => x.id === id);
      if (this.moduloSalvo !== undefined) {
        this.moduloSelecionado = this.moduloSalvo;
        this.index = this.moduloSalvo.index;
        oldIndex = this.index;
        this.checkBotoes(1);
        this.index = oldIndex;
      } else {
        this.index = this.moduloSelecionado.index;
        oldIndex = this.index;
        this.checkBotoes(2);
        this.index = oldIndex;
      }
    } else {
      this.index = this.moduloSelecionado.index;
      oldIndex = this.index;
      this.checkBotoes(2);
      this.index = oldIndex;
    }
  }

  // ====

  checkBotoes(op) {
    if (op === 1) {
      if (this.moduloSalvo.index.length > 0) {
        this.moduloSalvo.index.forEach((i: number) => {
          setTimeout(() => {
            const range = document.getElementById('toggle' + i);
            range.setAttribute('checked', 'true');
          }, 50);
        });
      }
    } else {
      if (this.moduloSelecionado.index !== undefined) {
        if (this.moduloSelecionado.index.length > 0) {
          this.moduloSelecionado.index.forEach((i: number) => {
            setTimeout(() => {
              const range = document.getElementById('toggle' + i);
              range.setAttribute('checked', 'true');
            }, 50);
          });
        }
      }
    }
  }

  // ====

  voltar() {
    this.localSt.clear('moduloSelecionado');
    this.navCtrl.back();
  }

  // ====

  contar(e: any, i: number) {
    this.zone.run(() => {
      const check = e.detail.checked;
      if (check === true) {
        this.consumidas++;
        if (this.index === undefined) {
          this.index = [i];
        } else {
          this.index.push(i);
        }
      } else if (check === false) {
        this.consumidas--;
        this.index = this.index.filter((indice: any) => {
          return indice !== i;
        });
      }

      this.index = this.index.filter((item, pos) => {
        return this.index.indexOf(item) === pos;
      });
    });
  }

  // ====

  obj() {
    return {
      id: this.moduloSelecionado.id,
      modulo:
        this.moduloSelecionado.nome !== undefined
          ? this.moduloSelecionado.nome
          : this.moduloSelecionado.modulo,
      consumidas: this.consumidas,
      qtd: this.moduloSelecionado.qtd,
      index: this.index,
    };
  }

  // ====

  gravar() {
    if (this.iscasConsumidas === null || this.iscasConsumidas === undefined) {
      this.salvar();
    } else {
      this.update();
    }
    this.voltar();
  }

  salvar() {
    this.zone.run(() => {
      if (this.iscasConsumidas !== undefined && this.iscasConsumidas !== null) {
        if (this.iscasConsumidas.length > 0) {
          this.iscasConsumidas.push(this.obj());
        }
      } else {
        this.localSt.store('iscasConsumidas', [this.obj()]);
      }
    });
  }

  update() {
    this.zone.run(() => {
      const resultado = this.iscasConsumidas.find(
        (isca: any) => isca.id === this.obj().id
      );
      if (resultado !== undefined) {
        resultado.consumidas = this.consumidas;
        resultado.index = this.index;
        this.iscasConsumidas = this.iscasConsumidas;
      } else {
        this.iscasConsumidas.push(this.obj());
        this.iscasConsumidas = this.iscasConsumidas;
      }
    });
  }
}
