import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { FormTemplateService } from './form-template.service';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  providers: [FormTemplateService],
  imports: [SharedModule, ReactiveFormsModule, RouterModule, AuthRoutingModule],
  declarations: [AuthComponent, SignupComponent, LoginComponent],
  exports: [SignupComponent, LoginComponent],
})
export class AuthModule {}
