import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  AfterViewChecked,
} from '@angular/core';
import { data } from './data';
import { CreatePost, PostService } from '../../services/post.service';
import { Post } from '../../models/Post';
import { ModalComponent } from '../start-post/modal/modal.component';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Role, User } from 'src/app/guests/components/auth/models/user.model';
import { ProgressSpinnerDialogComponent } from 'src/app/progress-spinner-dialog/progress-spinner-dialog.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.sass'],
})
export class AllPostsComponent
  implements OnInit, OnChanges, AfterViewChecked, OnDestroy
{
  @Input() postBody: CreatePost = { content: '', role: '' };

  private userSubscription!: Subscription;

  options = data;
  isLoading = false;
  loadingNewPost = false;
  queryParams!: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0; //initially
  readMore: Boolean[] = [];

  userId$ = new BehaviorSubject<number>(null!);
  userId: number = null!;
  userRole: Role = 'user';

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.userStream.subscribe(
      (user: User) => {
        this.allLoadedPosts.forEach((post: Post, index: number) => {
          if (user?.imagePath && post.author.id === user.id) {
            this.allLoadedPosts[index].authorFullImagePath =
              this.authService.getFullImagePath(user.id, user.imagePath);
          }
        });
      }
    );

    this.getPosts();

    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId = userId;
      this.userId$.next(userId);
    });

    this.authService.userRole
      .pipe(take(1))
      .subscribe((role: Role | undefined) => {
        if (role) this.userRole = role;
      });
  }

  ngAfterViewChecked(): void {
    const blurDivs = document.querySelectorAll('.blur-load');
    blurDivs.forEach((div) => {
      const img = div.querySelector('img');

      function loaded() {
        div.classList.add('loaded');
      }

      if (img?.complete) {
        loaded();
      } else {
        img?.addEventListener('load', loaded);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const postHaveContent = Boolean(changes['postBody'].currentValue?.content);
    if (!postHaveContent) return;

    let loadingModalRef: MatDialogRef<ProgressSpinnerDialogComponent> =
      this.dialog.open(ProgressSpinnerDialogComponent, {
        panelClass: 'transparent',
        // hasBackdrop: false,
        disableClose: true,
        scrollStrategy: new NoopScrollStrategy(),
      });

    this.postService.createPost().subscribe({
      next: (post: Post) => {
        this.authService.userFullImagePath.pipe(take(1)).subscribe({
          next: (fullImagePath: string) => {
            post.authorFullImagePath = fullImagePath;
            if (post.imageName) {
              post = this.setPostImage(post);
            }
            this.allLoadedPosts.unshift(post);
          },
          complete: () => {},
          error: (err) => {
            console.log(err);
          },
        });
      },
      complete: () => {
        //time needed for image to render on page
        setTimeout(() => {
          loadingModalRef.close();
        }, 200);
      },
      error: (err) => {
        console.log(err);
        loadingModalRef.close();
      },
    });
  }

  getPosts() {
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;
    this.toggleLoading(),
      this.postService.getSelectedPost(this.queryParams).subscribe({
        next: (posts: Post[]) => {
          for (let i = 0; i < posts.length; i++) {
            let post = this.setAuthorImage(posts[i]);
            post = this.setPostImage(posts[i]);
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
        post.author.imagePath as string
      );
    }

    post.authorFullImagePath = fullImagePath;
    return post;
  }

  setPostImage(post: Post): Post {
    const doesPostHaveImage = !!post.imageName;
    if (!doesPostHaveImage) return post;
    post.fullImagePath = this.postService.getPostImageName(
      post.author.id,
      post.imageName as string
    );
    post.fullSmallImagePath = this.postService.getPostImageName(
      post.author.id,
      this.postService.smallImageName(post.imageName as string)
    );

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
    const postClone = structuredClone(
      this.allLoadedPosts.find((post) => post.id === postId)
    );
    const modalDialogRef = this.dialog.open(ModalComponent, {
      data: { postData: postClone, editMode: true },
      autoFocus: false,
    });

    modalDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: CreatePost) => {
        this.postService.updatePost(postId).subscribe(() => {
          const postShallowCopy = this.allLoadedPosts.find(
            (post) => post.id === postId
          ) as Post;
          const { content, fileName } = result;
          postShallowCopy.content = content;
          if (fileName) {
            postShallowCopy.imageName = fileName;
            postShallowCopy.fullImagePath = `http://localhost:3000/api/feed/post/image/${fileName}?userId=${postShallowCopy.author.id}`;
          } else {
            postShallowCopy.imageName = undefined;
            postShallowCopy.fullImagePath = undefined;
          }
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

  goToAccount(postUserId: number) {
    this.router.navigate([`home/account/${postUserId}`]);
  }

  toggleLoading = () => (this.isLoading = !this.isLoading);

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
