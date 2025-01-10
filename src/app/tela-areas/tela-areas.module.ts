import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TelaAreasPage } from './tela-areas.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AreaDetalhesComponent } from './area-detalhes/area-detalhes.component';
import { NovaPragaComponent } from './nova-praga/nova-praga.component';
import { NovaMetComponent } from './nova-met/nova-met.component';
import { NovaRecoComponent } from './nova-reco/nova-reco.component';
import { ListaMetComponent } from './lista-met/lista-met.component';
import { ListaPragasComponent } from './lista-pragas/lista-pragas.component';
import { ListaRecoComponent } from './lista-reco/lista-reco.component';
import { QuantidadesComponent } from './quantidades/quantidades.component';
import { ConsumidasComponent } from './consumidas/consumidas.component';
import { DispositivosComponent } from './dispositivos/lista/dispositivos.component';
import { GerenciarDispositivoComponent } from './dispositivos/gerenciar/gerenciar-dispositivo.component';
import { NovoDispositivoComponent } from './dispositivos/novo/novo-dispositivo.component';

const routes: Routes = [
  {
    path: '',
    component: TelaAreasPage,
  },
  {
    path: 'area-detalhes/:id',
    component: AreaDetalhesComponent,
  },
  {
    path: 'nova-praga',
    component: NovaPragaComponent,
  },
  {
    path: 'nova-met',
    component: NovaMetComponent,
  },
  {
    path: 'editar-met/:i',
    component: NovaMetComponent,
  },
  {
    path: 'nova-reco',
    component: NovaRecoComponent,
  },
  {
    path: 'editar-reco/:i',
    component: NovaRecoComponent,
  },
  {
    path: 'qtd',
    component: QuantidadesComponent,
  },
  {
    path: 'consumidas/:id',
    component: ConsumidasComponent,
  },
  {
    path: 'dispositivo/lista',
    component: DispositivosComponent,
  },
  {
    path: 'dispositivo/gerenciar',
    component: GerenciarDispositivoComponent,
  },
  {
    path: 'dispositivo/novo',
    component: NovoDispositivoComponent,
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
  declarations: [
    TelaAreasPage,
    AreaDetalhesComponent,
    NovaPragaComponent,
    NovaMetComponent,
    NovaRecoComponent,
    ListaMetComponent,
    ListaPragasComponent,
    ListaRecoComponent,
    QuantidadesComponent,
    ConsumidasComponent,
    DispositivosComponent,
    GerenciarDispositivoComponent,
    NovoDispositivoComponent,
  ],
})
export class TelaAreasPageModule {}
