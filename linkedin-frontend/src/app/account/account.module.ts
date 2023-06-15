import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './account.component';

@NgModule({
  imports: [SharedModule, ReactiveFormsModule],
  declarations: [AccountComponent],
})
export class AccountModule {}
