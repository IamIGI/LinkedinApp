import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NetworkComponent } from './network/network.component';
import { WorkComponent } from './work/work.component';
import { MessagesComponent } from './messages/messages.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AccountComponent } from './account/account.component';
import { PopoverComponent } from './header/popover/popover.component';
import { ModalComponent } from './home/components/start-post/modal/modal.component';
import { HomePageModule } from './home/home.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    WorkComponent,
    MessagesComponent,
    NotificationsComponent,
    AccountComponent,
    PopoverComponent,
    ModalComponent,
    HeaderComponent,
  ],
  imports: [
    HomePageModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
