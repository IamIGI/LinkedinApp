import { NgModule } from '@angular/core';
import { StartPostComponent } from './components/start-post/start-post.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';
import { HomeComponent } from './home.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { FiltersComponent } from './components/filters/filters.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ModalComponent } from './components/start-post/modal/modal.component';
import { ProfileSummaryModule } from './components/profile-summary/profile-summary.module';
@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    ProfileSummaryModule,
  ],
  declarations: [
    HomeComponent,
    StartPostComponent,
    AdvertisingComponent,
    AllPostsComponent,
    ModalComponent,
    FiltersComponent,
  ],
})
export class HomePageModule {}
