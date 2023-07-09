import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import {
  formOfEmployment,
  skillsNames,
} from '../experience/dictionaries/experience.dictionaries';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/home/components/start-post/modal/modal.component';
import { AccountService } from '../../service/account.service';

@Component({
  selector: 'app-add-experience',
  templateUrl: './add-experience.component.html',
  styleUrls: ['./add-experience.component.sass'],
})
export class AddExperienceComponent implements OnInit {
  selectedSkills = skillsNames;

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
    if (!this.addExperienceForm.valid) return;
    let data = this.addExperienceForm.value;
    data = {
      ...data,
      endDate: this.currentJobFlag ? null : data.endDate,
    };
    this.accountService.addUserExperience(data).subscribe({
      next: (response) => {},
      error: (err) => {
        console.log(err);
        //TODO: error handler
        // this.errorServerMessage = err.error.error.message;
        // setTimeout(() => {
        //   this.errorServerMessage = '';
        // }, 5000);
        this.dialogRef.close();
      },
      complete: () => {
        this.resetForm(formDirective);
        this.dialogRef.close({ data });
      },
    });
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
