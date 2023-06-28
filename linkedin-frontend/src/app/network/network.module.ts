import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PeopleYouMayKnownComponent } from './components/people-you-may-known/people-you-may-known.component';
import { NetworkComponent } from './network.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [SharedModule, RouterModule],
  declarations: [PeopleYouMayKnownComponent, NetworkComponent],
})
export class NetworkModule {}
