import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./main-template/main-template.module').then(
        (module) => module.MainTemplateModule
      ),
  },
  {
    path: 'guest',
    loadChildren: () =>
      import('./guests/guest.module').then((module) => module.GuestModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
