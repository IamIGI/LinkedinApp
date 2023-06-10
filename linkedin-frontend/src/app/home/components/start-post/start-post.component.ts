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
import { Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';
import { PostService } from '../../services/post.service';
import { MatTooltip } from '@angular/material/tooltip';

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

  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });

    this.postService.isPostImageAdded().subscribe((result: boolean) => {
      this.postImageAdded = result;
      if (result && this.addImageButtonActivated) this.addedImageTooltip();
    });

    this.authService.userStream.pipe(take(1));
  }

  async openModal() {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        postData: { imageName: undefined, fullImagePath: undefined },
        editMode: false,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.create.emit(result);
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
    this.postService.setPostImage(newFile);
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
