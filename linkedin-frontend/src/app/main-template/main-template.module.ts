import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainTemplateComponent } from './main-template.component';
import { HomePageModule } from '../home/home.module';
import { MainTemplateRoutingModule } from './main-template-routing.module';
import { PopoverComponent } from '../header/popover/popover.component';
import { ModalComponent } from '../home/components/start-post/modal/modal.component';
import { SearchbarComponent } from '../header/searchbar/searchbar.component';
import { HeaderComponent } from '../header/header.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    HomePageModule,
    RouterModule,
    MainTemplateRoutingModule,
  ],
  declarations: [
    MainTemplateComponent,
    PopoverComponent,
    ModalComponent,
    SearchbarComponent,
    HeaderComponent,
  ],
})
export class MainTemplateModule {}
