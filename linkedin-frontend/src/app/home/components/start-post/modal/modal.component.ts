import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CreatePost {
  content: string;
  role: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
})
export class ModalComponent {
  // Set the focus on the textarea as soon as it is available
  @ViewChild('PostTextArea') set bannerNoteRef(ref: ElementRef) {
    if (!!ref) {
      ref.nativeElement.focus();
    }
  }

  addPostForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    private dialogRef: MatDialogRef<ModalComponent>
  ) {}

  ngOnInit() {
    this.addPostForm = new FormGroup({
      text: new FormControl(null, [Validators.required]),
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
}
