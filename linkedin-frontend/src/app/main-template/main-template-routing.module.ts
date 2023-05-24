import { RouterModule, Routes } from '@angular/router';
import { MainTemplateComponent } from './main-template.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: MainTemplateComponent,
    loadChildren: () =>
      import('../header/header.module').then((module) => module.HeaderModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTemplateRoutingModule {}
