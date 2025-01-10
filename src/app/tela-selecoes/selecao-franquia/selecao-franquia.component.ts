import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FranquiasService } from 'src/app/shared/servicos/franquias.service';
import { Franquia, Rota } from 'src/app/shared/modelos/franquia';
import { OsService } from 'src/app/shared/servicos/os.service';
import { Os } from 'src/app/shared/modelos/os';
import { ComplementosService } from 'src/app/shared/servicos/complementos.service';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { LoadingController } from '@ionic/angular';
import { Database } from 'src/app/shared/providers/database';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-selecao-franquia',
  templateUrl: './selecao-franquia.component.html',
  styleUrls: ['./selecao-franquia.component.scss'],
  standalone: false,
})
export class SelecaoFranquiaComponent implements OnInit {
  // dados armazenados no local storage
  @LocalStorage('equipe') equipe;
  @LocalStorage('franquiaRota') franquiaRota;

  // formulários
  formFranquia: FormGroup;
  formRota: FormGroup;
  franquiaRotas: any;
  franquiaTemp: any;

  // franquias
  franquias: Franquia[]; // lista de franquias
  franquiaObj: Franquia; // modelo de franquia

  // rota
  rota: Rota; // modelo de rota
  rotaConst: any;

  // OS
  os: Os;
  ordens: Os[];

  configFranquia: any = {
    header: 'Selecione sua franquia',
  };

  configRota: any = {
    header: 'Selecione uma rota',
  };

  equipeTrue: boolean;

  constructor(
    private http: HttpClient,
    private db: Database,
    private formBuilder: FormBuilder,
    private router: Router,
    private franquiaService: FranquiasService,
    private osService: OsService,
    private complementosService: ComplementosService,
    private localSt: LocalStorageService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.spinnerFranquia();
    this.getRotasFromApi();
    if (this.franquiaTemp === undefined) {
      this.montarForm();
    }

    if (this.equipe !== null) {
      this.equipeTrue = true;
    }
  }

  voltarFunc() {}

  avancarFunc() {}

  montarForm() {
    this.formFranquia = this.formBuilder.group({
      franquia: [null, Validators.required],
    });

    this.formRota = this.formBuilder.group({
      rota: [null, Validators.required],
    });
  }

  async getRotasFromApi() {
    const api = await this.db.createQuery(
      'SELECT api_franquia FROM first_entry WHERE id = 1'
    );
    let apiRota = api[0].api_franquia + 'areasApp';
    console.log('API ROTAS: ' + apiRota);
    let rotas = await this.http.get(apiRota).toPromise();
    this.franquiaRotas = rotas;
  }

  setarRota(valor: any) {
    this.rotaConst = valor;
    this.localSt.clear('equipeResp');
    this.localSt.clear('equipetec');
  }

  async spinnerFranquia() {
    const loading = await this.loadingController.create({
      message: 'Carregando franquias',
      animated: true,
      spinner: 'dots',
    });

    await loading.present();

    this.franquias = await this.franquiaService.getFranquias();
  }
}
