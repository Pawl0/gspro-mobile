import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TelaListaOsPage } from './tela-lista-os.page';
import { ListaOsComponent } from './lista-os/lista-os.component';
import { ListaComplementosComponent } from './lista-complementos/lista-complementos.component';
import { ListaExecComponent } from './lista-exec/lista-exec.component';
import { ListaNaoexecComponent } from './lista-naoexec/lista-naoexec.component';

const routes: Routes = [
  {
    path: '',
    component: TelaListaOsPage
  },
  {
    path: 'complementos',
    component: ListaComplementosComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TelaListaOsPage, ListaOsComponent, ListaComplementosComponent, ListaExecComponent, ListaNaoexecComponent]
})
export class TelaListaOsPageModule {}
