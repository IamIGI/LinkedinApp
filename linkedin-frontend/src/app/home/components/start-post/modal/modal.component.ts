import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
})
export class ModalComponent {
  addPostForm!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}

  ngOnInit() {
    this.addPostForm = new FormGroup({
      text: new FormControl(null, [Validators.required]),
      role: new FormControl('anyone', [Validators.required]),
    });
  }

  onSubmit() {
    console.log(this.addPostForm.value);
    if (!this.addPostForm.valid) return;
    const postValues = this.addPostForm.value;
    const body = { ...postValues, createdAt: new Date() };
    console.log(body);
    this.addPostForm.reset();
  }
}
