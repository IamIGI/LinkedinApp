import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { NetworkComponent } from '../network/network.component';
import { WorkComponent } from '../work/work.component';
import { MessagesComponent } from '../messages/messages.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { AccountComponent } from '../account/account.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'network',
    component: NetworkComponent,
  },
  {
    path: 'work',
    component: WorkComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeaderRoutingModule {}
