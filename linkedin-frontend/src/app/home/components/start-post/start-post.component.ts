import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { options } from './data';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

interface PostImage {
  imageName: string | undefined;
  fullImagePath: string | undefined;
}

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.sass'],
})
export class StartPostComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  @ViewChild('matTooltip') matTooltip!: MatTooltip;
  options = options;
  postImageAdded = false;
  addImageButtonActivated = false;
  postImage: PostImage = { imageName: undefined, fullImagePath: undefined };
  userId!: number;
  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userImagePathSubscription =
      this.authService.userProfileFullImagePath.subscribe(
        (fullImagePath: string) => {
          this.userFullImagePath = fullImagePath;
        }
      );

    this.postService.isPostImageAdded().subscribe((result: boolean) => {
      this.postImageAdded = result;
      if (result && this.addImageButtonActivated) this.addedImageTooltip();
    });

    this.authService.userId.subscribe({
      next: (id: number) => {
        this.userId = id;
      },
    });
  }

  //deleted async prefix
  openModal() {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        postData: this.postImage,
        editMode: false,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.create.emit(result);
      this.postImage = { imageName: undefined, fullImagePath: undefined };
    });
  }

  addedImageTooltip() {
    setTimeout(() => {
      this.matTooltip.show();
    }, 500);

    setTimeout(() => {
      this.matTooltip.hide();
      this.addImageButtonActivated = false;
    }, 3000);
  }

  onFileSelect(event: Event): void {
    this.addImageButtonActivated = true;
    const newFile = ((event.target as HTMLInputElement).files as FileList)[0];
    if (!newFile) return;
    this.postService.savePostImageTemporary(newFile).subscribe({
      next: (postImage) => {
        if (!postImage.error && postImage.newFilename) {
          this.postImage.imageName = postImage.newFilename;
          this.postImage.fullImagePath = `http://localhost:3000/api/feed/temporary/image/${postImage.newFilename}/?userId=${this.userId}`;
        }
        console.log(postImage.error);
      },
      complete: () => {
        this.postService.onImageChange(true);
      },
    });
  }

  goToAccount() {
    this.router.navigate([`home/account/${this.userId}`]);
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
