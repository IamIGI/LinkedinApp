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
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';

export interface CreatePost {
  content: string;
  role: string;
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

  fullName$ = new BehaviorSubject<string>(null!);
  fullName = '';

  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  addPostForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    private dialogRef: MatDialogRef<ModalComponent>,
    private authService: AuthService
  ) {}

  ngOnInit() {
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
    };
    this.dialogRef.close({ body });
    this.addPostForm.reset();
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
