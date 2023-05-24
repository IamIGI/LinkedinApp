import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { GuestHomepageComponent } from './guest-homepage.component';
import { StartPageComponent } from './components/start-page/start-page.component';

const routes: Routes = [
  {
    path: '',
    component: GuestHomepageComponent,
    children: [
      {
        path: 'form',
        loadChildren: () =>
          import('./components/auth/auth.module').then(
            (module) => module.AuthModule
          ),
      },
      {
        path: '',
        component: StartPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestRoutingModule {}
