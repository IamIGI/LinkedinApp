import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainTemplateComponent } from './main-template.component';
import { HomePageModule } from '../home/home.module';
import { MainTemplateRoutingModule } from './main-template-routing.module';
import { ModalComponent } from '../home/components/start-post/modal/modal.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    HomePageModule,
    RouterModule,
    MainTemplateRoutingModule,
    HeaderModule,
  ],
  declarations: [MainTemplateComponent],
})
export class MainTemplateModule {}
