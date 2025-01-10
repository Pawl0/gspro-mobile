import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/shared/shared.module';

import { TelaSelecoesPage } from './tela-selecoes.page';
import { SelecaoFranquiaComponent } from './selecao-franquia/selecao-franquia.component';
import { SelecaoEquipeComponent } from './selecao-equipe/selecao-equipe.component';

const routes: Routes = [
  {
    path: '',
    component: SelecaoFranquiaComponent
  },
  {
    path: 'selecao-franquia',
    component: SelecaoFranquiaComponent
  },
  {
    path: 'selecao-equipe',
    component: SelecaoEquipeComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TelaSelecoesPage, SelecaoFranquiaComponent, SelecaoEquipeComponent]
})
export class TelaSelecoesPageModule {}
