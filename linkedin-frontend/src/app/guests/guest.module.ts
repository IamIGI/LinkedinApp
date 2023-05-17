import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { GuestRoutingModule } from './guest-routing.module';
import { FormTemplateModule } from './components/form-template/form-template.module';
import { GuestHomepageComponent } from './guest-homepage.component';
import { StartPageComponent } from './components/start-page/start-page.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    GuestRoutingModule,
    FormTemplateModule,
  ],
  declarations: [GuestHomepageComponent, StartPageComponent],
})
export class GuestModule {}
