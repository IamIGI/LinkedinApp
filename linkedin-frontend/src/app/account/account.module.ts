import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './account.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { AddExperienceComponent } from './components/add-experience/add-experience.component';
import { EditExperienceComponent } from './components/edit-experience/edit-experience.component';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  imports: [SharedModule, ReactiveFormsModule, AccountRoutingModule],
  declarations: [
    AccountComponent,
    ExperienceComponent,
    AddExperienceComponent,
    EditExperienceComponent,
  ],
})
export class AccountModule {}
