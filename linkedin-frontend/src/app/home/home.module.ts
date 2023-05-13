import { NgModule } from '@angular/core';
import { ProfileSummaryComponent } from './components/profile-summary/profile-summary.component';
import { StartPostComponent } from './components/start-post/start-post.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';
import { HomeComponent } from './home.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FiltersComponent } from './components/filters/filters.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { PopoverComponent } from '../header/popover/popover.component';
import { ModalComponent } from './components/start-post/modal/modal.component';
import { SearchbarComponent } from '../header/searchbar/searchbar.component';
import { AppRoutingModule } from '../app-routing.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    HeaderModule,
    SharedModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    AppRoutingModule,
  ],
  declarations: [
    HomeComponent,
    ProfileSummaryComponent,
    StartPostComponent,
    AdvertisingComponent,
    AllPostsComponent,
    FiltersComponent,
  ],
})
export class HomePageModule {}
