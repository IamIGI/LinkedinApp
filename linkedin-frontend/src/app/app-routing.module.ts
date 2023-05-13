import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NetworkComponent } from './network/network.component';
import { WorkComponent } from './work/work.component';
import { MessagesComponent } from './messages/messages.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AccountComponent } from './account/account.component';
import { GuestHomepageComponent } from './guests/guest-homepage/guest-homepage.component';
import { LoginComponent } from './guests/login/login.component';
import { SignupComponent } from './guests/signup/signup.component';

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
  {
    path: 'guest/guest_page',
    component: GuestHomepageComponent,
  },
  {
    path: 'guest/login',
    component: LoginComponent,
  },
  {
    path: 'guest/signup',
    component: SignupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
