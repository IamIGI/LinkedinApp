import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { GuestHomepageComponent } from './guest-homepage/guest-homepage.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [SharedModule, ReactiveFormsModule],
  declarations: [LoginComponent, SignupComponent, GuestHomepageComponent],
})
export class GuestsModule {}
