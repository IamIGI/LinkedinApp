import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { StatisticsComponent } from './statistics.component';

@NgModule({
  imports: [SharedModule, RouterModule],
  declarations: [StatisticsComponent],
})
export class StatisticsModule {}
