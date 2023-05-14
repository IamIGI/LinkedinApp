import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { GuestHomepageComponent } from './guest-homepage/guest-homepage.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { GuestRoutingModule } from './guest-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    GuestRoutingModule,
  ],
  declarations: [LoginComponent, SignupComponent, GuestHomepageComponent],
})
export class GuestModule {}
