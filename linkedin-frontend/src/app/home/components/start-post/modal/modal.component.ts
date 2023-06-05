import {
  Component,
  Inject,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { Role } from 'src/app/guests/components/auth/models/user.model';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';

export interface CreatePost {
  content: string;
  role: string;
  file?: File;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
})
export class ModalComponent implements OnInit, OnDestroy {
  // Set the focus on the textarea as soon as it is available
  @ViewChild('PostTextArea') set bannerNoteRef(ref: ElementRef) {
    if (!!ref) {
      ref.nativeElement.focus();
    }
  }

  file: File = null!;

  fullName$ = new BehaviorSubject<string>(null!);
  fullName = '';
  userRole = '';

  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  addPostForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: any,
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
  }

  onSubmit() {
    if (!this.addPostForm.valid) return;
    const postValues = this.addPostForm.value;
    const body: CreatePost = {
      content: postValues.text,
      role: postValues.role,
      file: this.file,
    };
    this.dialogRef.close({ body });
    this.addPostForm.reset();
  }

  onFileSelect(event: Event): void {
    const newFile = ((event.target as HTMLInputElement).files as FileList)[0];
    if (!newFile) return;
    this.file = newFile;
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
