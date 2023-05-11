import { Component, OnInit } from '@angular/core';
import { data } from './data';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/Post';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.sass'],
})
export class AllPostsComponent implements OnInit {
  options = data;
  isLoading = false;
  queryParams!: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0; //initially

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;
    this.toggleLoading(),
      this.postService.getSelectedPost(this.queryParams).subscribe({
        next: (posts: Post[]) => {
          for (let i = 0; i < posts.length; i++) {
            this.allLoadedPosts.push(posts[i]);
            console.log(posts[i].privateAccount);
          }
          this.skipPosts = this.skipPosts + this.numberOfPosts;
        },
        error: (err) => console.log(err),
        complete: () => this.toggleLoading(),
      });
  }

  toggleLoading = () => (this.isLoading = !this.isLoading);
}
