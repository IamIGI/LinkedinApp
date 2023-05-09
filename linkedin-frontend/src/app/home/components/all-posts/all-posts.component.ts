import { Component } from '@angular/core';
import { data } from './data';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.sass'],
})
export class AllPostsComponent {
  options = data;
}
