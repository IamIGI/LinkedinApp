import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./main-template/main-template.module').then(
        (module) => module.MainTemplateModule
      ),
    canLoad: [AuthGuard],
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
