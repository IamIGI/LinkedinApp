import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PopoverComponent } from './popover/popover.component';
import { ModalComponent } from '../home/components/start-post/modal/modal.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { HeaderComponent } from './header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppModule } from '../app.module';

@NgModule({
  declarations: [
    PopoverComponent,
    ModalComponent,
    SearchbarComponent,
    HeaderComponent,
  ],
  imports: [AppModule, SharedModule, ReactiveFormsModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
