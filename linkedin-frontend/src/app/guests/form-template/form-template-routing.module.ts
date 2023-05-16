import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormTemplateComponent } from './form-template.component';

const routes: Routes = [
  {
    path: '',
    component: FormTemplateComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormTemplateRoutingModule {}
