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
  readMore: Boolean[] = [];

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
            this.readMore.push(false);
          }
          this.skipPosts = this.skipPosts + this.numberOfPosts;
        },
        error: (err) => console.log(err),
        complete: () => this.toggleLoading(),
      });
  }

  readMoreSplit(text: string) {
    const splitAfterNumberOfChars = 200;
    let opinionSplit = [];
    opinionSplit.push(text.substr(0, splitAfterNumberOfChars));
    text.substr(splitAfterNumberOfChars, 2000) !== '' &&
      opinionSplit.push(text.substr(splitAfterNumberOfChars, 2000));
    return opinionSplit;
  }

  toggleReadMore(index: number) {
    this.readMore[index] = !this.readMore[index];
  }

  getAuthorName(post: Post): string {
    if (post.privateAccount)
      return `${post.author.firstName} ${post.author.lastName}`;
    return `${post.author.firstName}`;
  }

  toggleLoading = () => (this.isLoading = !this.isLoading);
}
