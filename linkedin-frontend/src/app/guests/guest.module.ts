import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
  declarations: [GuestHomepageComponent],
})
export class GuestModule {}
