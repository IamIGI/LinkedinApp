import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { formOfEmployment } from '../experience/dictionaries/experience.dictionaries';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/home/components/start-post/modal/modal.component';
import { AccountService } from '../../service/account.service';
import { UserExperience } from '../../models/account.models';
@Component({
  selector: 'app-add-experience',
  templateUrl: './add-experience.component.html',
  styleUrls: ['./add-experience.component.sass'],
})
export class AddExperienceComponent implements OnInit {
  addExperienceForm!: FormGroup;
  formOfEmploymentDict = formOfEmployment;
  currentJobFlag: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ModalComponent>,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.addExperienceForm = new FormGroup({
      position: new FormControl<string | null>(null, [Validators.required]),
      formOfEmployment: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      companyName: new FormControl<string | null>(null, [Validators.required]),
      localization: new FormControl<string | null>(null, [Validators.required]),
      startDate: new FormControl<Date | null>(null, [Validators.required]),
      endDate: new FormControl<Date | null>(null),
      description: new FormControl<string | null>(null),
      skills: new FormControl(null),
    });
  }

  onSubmit(formDirective: FormGroupDirective) {
    console.log('here');
    if (!this.addExperienceForm.valid) return;
    let data = this.addExperienceForm.value;
    data = {
      ...data,
      skills: ['Angular', 'NestJS', 'SQL'],
      endDate: this.currentJobFlag ? null : data.endDate,
    };
    console.log(data);
    this.accountService.addUserExperience(data).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
        // this.errorServerMessage = err.error.error.message;
        // setTimeout(() => {
        //   this.errorServerMessage = '';
        // }, 5000);
      },
      complete: () => {
        // this.resetForm(formDirective);
      },
    });

    // this.dialogRef.close();
  }

  resetForm(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.addExperienceForm.reset();
  }

  toggleCurrentJobFlag() {
    this.currentJobFlag = !this.currentJobFlag;
  }

  cancelPost() {
    this.dialogRef.close();
  }
}
