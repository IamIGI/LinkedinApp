import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { data } from './data';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/Post';
import {
  CreatePost,
  ModalComponent,
} from '../start-post/modal/modal.component';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { options } from '../start-post/data';
import { Role, User } from 'src/app/guests/components/auth/models/user.model';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.sass'],
})
export class AllPostsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() postBody: CreatePost = { content: '', role: '' };

  private userSubscription!: Subscription;

  options = data;
  isLoading = false;
  queryParams!: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0; //initially
  readMore: Boolean[] = [];

  userId$ = new BehaviorSubject<number>(null!);
  userRole: Role = 'user';

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.userStream.subscribe(
      (user: User) => {
        this.allLoadedPosts.forEach((post: Post, index: number) => {
          if (user?.imagePath && post.author.id === user.id) {
            this.allLoadedPosts[index].fullImagePath =
              this.authService.getFullImagePath(user.id, user.imagePath);
          }
        });
      }
    );

    this.getPosts();

    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId$.next(userId);
    });

    this.authService.userRole
      .pipe(take(1))
      .subscribe((role: Role | undefined) => {
        if (role) this.userRole = role;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    const postBody = changes['postBody'].currentValue?.body;
    if (!postBody) return;

    this.postService.createPost(postBody.content).subscribe((post: Post) => {
      this.authService.userFullImagePath
        .pipe(take(1))
        .subscribe((fullImagePath: string) => {
          post.fullImagePath = fullImagePath;
          this.allLoadedPosts.unshift(post);
        });
    });
  }

  getPosts() {
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;
    this.toggleLoading(),
      this.postService.getSelectedPost(this.queryParams).subscribe({
        next: (posts: Post[]) => {
          for (let i = 0; i < posts.length; i++) {
            const post = this.setAuthorImage(posts[i]);
            this.allLoadedPosts.push(post);
            this.readMore.push(false);
          }
          this.skipPosts = this.skipPosts + this.numberOfPosts;
        },
        error: (err) => console.log(err),
        complete: () => this.toggleLoading(),
      });
  }

  setAuthorImage(post: Post): Post {
    const doesAuthorHaveImage = !!post.author.imagePath;
    let fullImagePath = this.authService.getDefaultFullImagePath();
    if (doesAuthorHaveImage) {
      fullImagePath = this.authService.getFullImagePath(
        post.author.id,
        post.author.imagePath!
      );
    }

    post.fullImagePath = fullImagePath;
    return post;
  }

  readMoreSplit(text: string) {
    const splitAfterNumberOfChars = 200;

    let opinionSplit = [];
    let trimmedString = text.substr(0, splitAfterNumberOfChars);

    //if there is just one word, return it
    if (trimmedString.lastIndexOf(' ') == -1) {
      opinionSplit.push(trimmedString);
      return opinionSplit;
    }
    //if the sentence have more than 200 chars trim after word
    if (text.length >= splitAfterNumberOfChars) {
      trimmedString = text.substr(0, trimmedString.lastIndexOf(' '));
    }
    opinionSplit.push(trimmedString);
    const additionalText = text.substr(trimmedString.length, 2000);
    if (additionalText !== '') opinionSplit.push(additionalText);

    return opinionSplit;
  }

  toggleReadMore(index: number) {
    this.readMore[index] = !this.readMore[index];
  }

  getAuthorName(post: Post): string {
    const { isPrivateAccount, firstName, lastName } = post.author;
    if (isPrivateAccount) return `${firstName} ${lastName}`;
    return `${firstName}`;
  }

  async presentUpdateModal(postId: number) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { options, postData: { id: postId } },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
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

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
