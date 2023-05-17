import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormTemplateRoutingModule } from './form-template-routing.module';
import { FormTemplateComponent } from './form-template.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormTemplateService } from './form-template.service';

@NgModule({
  providers: [FormTemplateService],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    FormTemplateRoutingModule,
  ],
  declarations: [FormTemplateComponent, LoginComponent, SignupComponent],
})
export class FormTemplateModule {}
