import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { HeaderComponent } from './header.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { AppRoutingModule } from '../app-routing.module';
import { PopoverComponent } from './popover/popover.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
  ],
  declarations: [HeaderComponent, SearchbarComponent, PopoverComponent],
})
export class HeaderModule {}
