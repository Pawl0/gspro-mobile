import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';

import { TelaNaoExecPage } from './tela-nao-exec.page';

const routes: Routes = [
  {
    path: '',
    component: TelaNaoExecPage,
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
  declarations: [TelaNaoExecPage],
})
export class TelaNaoExecPageModule {}
