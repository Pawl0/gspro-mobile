import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TecnicoService } from 'src/app/shared/servicos/tecnico.service';
import { Tecnico } from 'src/app/shared/modelos/tecnico';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-selecao-equipe',
  templateUrl: './selecao-equipe.component.html',
  styleUrls: ['./selecao-equipe.component.scss'],
  standalone: false,
})
export class SelecaoEquipeComponent implements OnInit {
  // dados armazenados no local storage
  @LocalStorage('franquiaRota') franquiaRota: any;
  @LocalStorage('equipe') equipe: any;

  // formulários
  formResp: FormGroup;
  formEquipe: FormGroup;

  // tecnicos
  tecnicos: Tecnico[]; // lista de técnicos
  tecnico: Tecnico; // modelo de técnico
  tecnicosMinus: any; // lista de técnicos, excluído o responsável
  equipeIpn: boolean; // ocultar ou mostrar input de equipe

  // botoes
  salvarBtn: boolean;
  voltarBtn: boolean;

  configResp: any = {
    header: 'Selecione o responsável',
  };

  configEqp: any = {
    header: 'Selecione equipe',
  };

  constructor(
    private router: Router,
    private location: Location,
    private tecnicoService: TecnicoService,
    private localSt: LocalStorageService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.spinnerTecnicos();

    if (this.equipe === null) {
      this.formSimples();
      this.voltarBtn = true;
      this.salvarBtn = false;
      this.equipeIpn = true;
    } else {
      this.formPatchResp();
      this.equipeIpn = false;
      this.voltarBtn = false;

      if (this.equipe.auxiliares !== null) {
        this.formPatchEqp();
      } else {
        this.formEquipe = this.formBuilder.group({
          equipe: [null, Validators.required],
        });
      }
    }
  }

  formSimples() {
    this.formResp = this.formBuilder.group({
      responsavel: [null, Validators.required],
    });

    this.formEquipe = this.formBuilder.group({
      equipe: [null],
    });
  }

  async formPatchResp() {
    this.formResp = this.formBuilder.group({
      responsavel: [this.equipe.responsavel, Validators.required],
    });

    this.tecnicosMinus = await this.tecnicoService.getTecnicoMinus(
      this.equipe.responsavel.id
    );
  }

  async formPatchEqp() {
    this.tecnicosMinus = await this.tecnicoService.getTecnicoMinus(
      this.equipe.responsavel.id
    );

    this.formEquipe = this.formBuilder.group({
      equipe: '',
    });

    this.formEquipe.patchValue({
      equipe: this.equipe.auxiliares,
    });
  }

  voltarFunc() {
    this.location.back();
  }

  async filterByResponsavel(valor) {
    this.tecnicosMinus = await this.tecnicoService.getTecnicoMinus(
      valor.value.id
    );
  }

  proximaTela() {
    if (this.formEquipe.get('equipe').value === null) {
      const equipe = {
        responsavel: this.formResp.get('responsavel').value,
      };
      this.salvarEquipe(equipe);
    } else {
      const equipe = {
        responsavel: this.formResp.get('responsavel').value,
        auxiliares: this.formEquipe.get('equipe').value,
      };
      this.salvarEquipe(equipe);
    }
  }

  salvarEquipe(equipe: any) {
    this.localSt.store('equipe', equipe);
    this.router.navigate(['/lista-os']);
  }

  trocarEquipe() {
    this.salvarBtn = true;
  }

  async spinnerTecnicos() {
    const loading = await this.loadingController.create({
      message: 'Carregando técnicos',
      animated: true,
      spinner: 'dots',
    });

    await loading.present();
    const franquiaId = this.franquiaRota.id;
    this.tecnicos = await this.tecnicoService.getTecnicosFranquia(franquiaId);
  }
}
