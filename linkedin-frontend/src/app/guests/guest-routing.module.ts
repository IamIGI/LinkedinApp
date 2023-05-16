import { RouterModule, Routes } from '@angular/router';
import { GuestHomepageComponent } from './guest-homepage/guest-homepage.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: GuestHomepageComponent,
      },
      {
        path: 'form',
        loadChildren: () =>
          import('./form-template/form-template.module').then(
            (module) => module.FormTemplateModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestRoutingModule {}
