import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { data } from './data';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/Post';
import {
  CreatePost,
  ModalComponent,
} from '../start-post/modal/modal.component';
import { BehaviorSubject, take } from 'rxjs';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { options } from '../start-post/data';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.sass'],
})
export class AllPostsComponent implements OnInit, OnChanges {
  @Input() postBody?: CreatePost;

  options = data;
  isLoading = false;
  queryParams!: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0; //initially
  readMore: Boolean[] = [];

  userId$ = new BehaviorSubject<number>(null!);

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getPosts();

    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId$.next(userId);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const postBody = changes['postBody'].currentValue.body;
    if (!postBody) return;
    this.postService.createPost(postBody.content).subscribe((post: Post) => {
      this.allLoadedPosts.unshift(post);
    });
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
    if (post.author.isPrivateAccount)
      return `${post.author.firstName} ${post.author.lastName}`;
    return `${post.author.firstName}`;
  }

  async presentUpdateModal(postId: number) {
    console.log('EditPost', postId);
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { options, postData: { id: postId } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result.body.content);
      this.postService.updatePost(postId, result.body.content).subscribe(() => {
        const postIndex = this.allLoadedPosts.findIndex(
          (post: Post) => post.id === postId
        );
        this.allLoadedPosts[postIndex].content = result.body.content;
      });
    });
  }

  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe(() => {
      this.allLoadedPosts = this.allLoadedPosts.filter(
        (post: Post) => post.id !== postId
      );
    });
  }

  toggleLoading = () => (this.isLoading = !this.isLoading);
}
