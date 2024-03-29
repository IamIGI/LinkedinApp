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
import { BehaviorSubject, Subscription, catchError, map, take } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProgressSpinnerDialogComponent } from 'src/app/progress-spinner-dialog/progress-spinner-dialog.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { Role, User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TextService } from 'src/app/services/text.service';

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
    public textService: TextService,
    private postService: PostService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateUserImage();

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

    this.postService
      .createPost()
      .pipe(
        map((post: Post) => {
          this.authService.userProfileFullImagePath
            .pipe(
              take(1),
              map((fullImagePath: string) => {
                post.authorFullImagePath = fullImagePath;
                if (post.imageName) {
                  post = this.setPostImage(post);
                }
                this.allLoadedPosts.unshift(post);
              })
            )
            .subscribe();
        })
      )
      .subscribe({
        complete: () => {
          //time needed for image to render on page
          setTimeout(() => {
            loadingModalRef.close();
          }, 200);
        },
      });
  }

  updateUserImage() {
    this.userSubscription = this.authService.userStream.subscribe(
      (user: User) => {
        this.allLoadedPosts.forEach((post: Post, index: number) => {
          if (user?.profileImagePath && post.author.id === user.id) {
            this.allLoadedPosts[index].authorFullImagePath =
              this.authService.getUserFullImagePath(
                user.id,
                user.profileImagePath,
                'profile'
              );
          }
        });
      }
    );
  }

  getPosts() {
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;
    this.toggleLoading(),
      this.postService.getSelectedPosts(this.queryParams).subscribe({
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
    const doesAuthorHaveImage = !!post.author.profileImagePath;
    let fullImagePath = this.authService.getDefaultUserFullImagePath('profile');
    if (doesAuthorHaveImage) {
      fullImagePath = this.authService.getUserFullImagePath(
        post.author.id,
        post.author.profileImagePath as string,
        'profile'
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
