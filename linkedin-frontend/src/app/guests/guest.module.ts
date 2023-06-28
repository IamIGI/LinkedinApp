import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { GuestRoutingModule } from './guest-routing.module';
import { GuestHomepageComponent } from './guest-homepage.component';
import { StartPageComponent } from './components/start-page/start-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    GuestRoutingModule,
  ],
  declarations: [
    GuestHomepageComponent,
    StartPageComponent,
    LoginComponent,
    SignupComponent,
  ],
})
export class GuestModule {}
