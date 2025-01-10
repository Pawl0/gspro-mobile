import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InicialPage } from './inicial.page';
import { SelecaoInfosComponent } from './selecao-infos/selecao-infos.component';
import { SharedModule } from '../shared/shared.module';
import { SelecaoTecnicosComponent } from './selecao-tecnicos/selecao-tecnicos.component';

const routes: Routes = [
  {
    path: '',
    component: InicialPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [InicialPage, SelecaoInfosComponent, SelecaoTecnicosComponent],
})
export class InicialPageModule {}
