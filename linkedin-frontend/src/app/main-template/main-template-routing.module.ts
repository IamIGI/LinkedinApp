import { RouterModule, Routes } from '@angular/router';
import { MainTemplateComponent } from './main-template.component';
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
    component: MainTemplateComponent,
    loadChildren: () =>
      import('../header/header.module').then((module) => module.HeaderModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTemplateRoutingModule {}
