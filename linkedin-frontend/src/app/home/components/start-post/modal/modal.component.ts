import {
  Component,
  Inject,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { Role } from 'src/app/guests/components/auth/models/user.model';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';
import { PostService } from 'src/app/home/services/post.service';

export interface CreatePost {
  content: string;
  role: string;
  file?: File;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent implements OnInit, OnDestroy {
  // Set the focus on the textarea as soon as it is available
  @ViewChild('PostTextArea') set bannerNoteRef(ref: ElementRef) {
    if (!!ref) {
      ref.nativeElement.focus();
    }
  }
  @ViewChild('matTooltip') matTooltip!: MatTooltip;

  file: File = null!;

  fullName$ = new BehaviorSubject<string>(null!);
  fullName = '';
  userRole = '';
  postImageAdded = false;
  postImageTooltipMessage = 'Zdjęcie';

  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  addPostForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    private postService: PostService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.userRole
      .pipe(take(1))
      .subscribe((role: Role | undefined) => {
        if (role) {
          this.userRole = role;
        }
      });

    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        console.log(fullImagePath);
        this.userFullImagePath = fullImagePath;
      });

    this.authService.userFullName
      .pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        this.fullName$.next(fullName);
      });

    this.addPostForm = new FormGroup({
      text: new FormControl(this.passedData.postData?.content ?? null, [
        Validators.required,
      ]),
      role: new FormControl('anyone', [Validators.required]),
    });

    this.postService.isPostImageAdded().subscribe((result: boolean) => {
      this.postImageAdded = result;
      if (result) this.addedImageTooltip();
    });

    console.log(this.passedData);
  }

  onSubmit() {
    if (!this.addPostForm.valid) return;
    const postValues = this.addPostForm.value;
    const body: CreatePost = {
      content: postValues.text,
      role: postValues.role,
      file: this.file,
    };
    console.log(body);
    this.postService.setPostBody(body);
    this.dialogRef.close({ body });
    this.addPostForm.reset();
  }

  onFileSelect(event: Event): void {
    const newFile = ((event.target as HTMLInputElement).files as FileList)[0];
    if (!newFile) return;
    this.file = newFile;
    if (this.passedData.editMode) {
      this.postService
        .updatePostImage(this.passedData.postData.id, newFile)
        .subscribe({
          next: (result: { newFilename?: string; error?: string }) => {
            this.passedData.postData.imageName = result.newFilename;
            this.passedData.postData.fullImagePath = `http://localhost:3000/api/feed/post/image/${result.newFilename}/?userId=${this.passedData.postData.author.id}`;

            console.log(result);
            console.log(this.passedData.postData);
          },
          error: (err: { newFilename?: string; error?: string }) => {
            console.log(console.log(err));
          },
          complete: () => {
            console.log('complete');
          },
        });
      // this.passedData.postData.imageName
    }
    this.postService.setPostImage(newFile);
  }

  addedImageTooltip() {
    this.postImageTooltipMessage = 'Zdjęcie dodano';
    setTimeout(() => {
      this.matTooltip.show();
    }, 500);

    setTimeout(() => {
      this.matTooltip.hide();
    }, 3000);
    setTimeout(() => {
      this.postImageTooltipMessage = 'Zdjęcie';
    }, 3500);
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
