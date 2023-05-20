import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PopoverComponent } from './popover/popover.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { HeaderComponent } from './header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderRoutingModule } from './header-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderRoutingModule,
  ],
  declarations: [PopoverComponent, SearchbarComponent, HeaderComponent],
  exports: [HeaderComponent],
})
export class HeaderModule {}
