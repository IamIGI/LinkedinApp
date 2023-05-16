import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PopoverComponent } from './popover/popover.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { HeaderComponent } from './header.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PopoverComponent, SearchbarComponent, HeaderComponent],
  imports: [SharedModule, ReactiveFormsModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
