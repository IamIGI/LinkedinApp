import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { EditExperienceComponent } from './components/edit-experience/edit-experience.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
  },
  {
    path: 'edit-experience',
    component: EditExperienceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
