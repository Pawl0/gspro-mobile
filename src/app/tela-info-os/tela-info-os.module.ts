import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TelaInfoOsPage } from './tela-info-os.page';

const routes: Routes = [
  {
    path: '',
    component: TelaInfoOsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TelaInfoOsPage]
})
export class TelaInfoOsPageModule {}
