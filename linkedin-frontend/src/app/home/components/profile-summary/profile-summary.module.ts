import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { ProfileSummaryComponent } from './profile-summary.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [SharedModule, RouterModule],
  declarations: [ProfileSummaryComponent],
  exports: [ProfileSummaryComponent],
})
export class ProfileSummaryModule {}
