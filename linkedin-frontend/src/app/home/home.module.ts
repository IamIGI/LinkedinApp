import { NgModule } from '@angular/core';
import { ProfileSummaryComponent } from './components/profile-summary/profile-summary.component';
import { StartPostComponent } from './components/start-post/start-post.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';
import { HomeComponent } from './home.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { FiltersComponent } from './components/filters/filters.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ModalComponent } from './components/start-post/modal/modal.component';
@NgModule({
  imports: [SharedModule, ReactiveFormsModule, InfiniteScrollModule],
  declarations: [
    HomeComponent,
    ProfileSummaryComponent,
    StartPostComponent,
    AdvertisingComponent,
    AllPostsComponent,
    ModalComponent,
    FiltersComponent,
  ],
})
export class HomePageModule {}
