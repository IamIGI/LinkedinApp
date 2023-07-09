import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './account.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { AddExperienceComponent } from './components/add-experience/add-experience.component';

@NgModule({
  imports: [SharedModule, ReactiveFormsModule],
  declarations: [AccountComponent, ExperienceComponent, AddExperienceComponent],
})
export class AccountModule {}
