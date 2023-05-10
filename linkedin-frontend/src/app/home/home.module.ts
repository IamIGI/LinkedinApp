import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileSummaryComponent } from './components/profile-summary/profile-summary.component';
import { StartPostComponent } from './components/start-post/start-post.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../material.module';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [CommonModule, FormsModule, MaterialModule, InfiniteScrollModule],
  declarations: [
    HomeComponent,
    ProfileSummaryComponent,
    StartPostComponent,
    AdvertisingComponent,
    AllPostsComponent,
  ],
})
export class HomePageModule {}
