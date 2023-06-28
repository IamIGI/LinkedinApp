import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { GuestHomepageComponent } from './guest-homepage.component';
import { StartPageComponent } from './components/start-page/start-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  {
    path: '',
    component: GuestHomepageComponent,
    children: [
      {
        path: '',
        component: StartPageComponent,
      },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestRoutingModule {}
