import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainTemplateComponent } from './main-template.component';
import { HomePageModule } from '../home/home.module';
import { MainTemplateRoutingModule } from './main-template-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../header/header.module';
import { AccountModule } from '../account/account.module';
import { NetworkModule } from '../network/network.module';
import { StatisticsModule } from '../statistics/statistics.module';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    HomePageModule,
    NetworkModule,
    AccountModule,
    RouterModule,
    MainTemplateRoutingModule,
    HeaderModule,
    StatisticsModule,
  ],
  declarations: [MainTemplateComponent],
})
export class MainTemplateModule {}
