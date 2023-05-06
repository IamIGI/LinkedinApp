import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileSummaryComponent } from './components/profile-summary/profile-summary.component';
import { StartPostComponent } from './components/start-post/start-post.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [CommonModule, FormsModule, MaterialModule],
  declarations: [
    HomeComponent,
    ProfileSummaryComponent,
    StartPostComponent,
    AdvertisingComponent,
  ],
})
export class HomePageModule {}
