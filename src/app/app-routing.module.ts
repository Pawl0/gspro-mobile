import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./inicial/inicial.module').then((m) => m.InicialPageModule),
  },
  {
    path: 'selecoes',
    loadChildren: () =>
      import('./tela-selecoes/tela-selecoes.module').then(
        (m) => m.TelaSelecoesPageModule
      ),
  },
  {
    path: 'lista-os',
    loadChildren: () =>
      import('./tela-lista-os/tela-lista-os.module').then(
        (m) => m.TelaListaOsPageModule
      ),
  },
  {
    path: 'info-os',
    loadChildren: () =>
      import('./tela-info-os/tela-info-os.module').then(
        (m) => m.TelaInfoOsPageModule
      ),
  },
  {
    path: 'nao-exec',
    loadChildren: () =>
      import('./tela-nao-exec/tela-nao-exec.module').then(
        (m) => m.TelaNaoExecPageModule
      ),
  },
  {
    path: 'lista-areas',
    loadChildren: () =>
      import('./tela-areas/tela-areas.module').then(
        (m) => m.TelaAreasPageModule
      ),
  },
  {
    path: 'assinatura',
    loadChildren: () =>
      import('./tela-assinatura/tela-assinatura.module').then(
        (m) => m.TelaAssinaturaPageModule
      ),
  },
  {
    path: 'relatorio',
    loadChildren: () =>
      import('./relatorio/relatorio.module').then((m) => m.RelatorioPageModule),
  },
  {
    path: 'debug',
    loadChildren: () =>
      import('./debug/debug.module').then((m) => m.DebugPageModule),
  },
  {
    path: 'tela-info-tecnicas',
    loadChildren: () =>
      import('./tela-info-tecnicas/tela-info-tecnicas.module').then(
        (m) => m.TelaInfoTecnicasPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
