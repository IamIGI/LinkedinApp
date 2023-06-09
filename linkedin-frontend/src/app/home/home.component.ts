import { Component } from '@angular/core';
import { CreatePost } from './services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent {
  body: CreatePost = null!;

  constructor() {}

  onCreatePost(body: CreatePost) {
    this.body = body;
  }
}
