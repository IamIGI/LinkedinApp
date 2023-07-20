import { Component, Inject, OnInit } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/home/components/start-post/modal/modal.component';
import { AccountService } from '../../service/account.service';
import { ExperienceDialog, UserExperience } from '../../models/account.models';
import { AuthService } from 'src/app/auth/services/auth.service';
import { map } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';

@Component({
  selector: 'app-add-experience',
  templateUrl: './add-experience.component.html',
  styleUrls: ['./add-experience.component.sass'],
})
export class AddExperienceComponent implements OnInit {
  selectedSkills = skillsNames;
  user!: User;
  addExperienceForm!: FormGroup;
  formOfEmploymentDict = formOfEmployment;
  currentJobFlag: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public passedData: ExperienceDialog,
    private dialogRef: MatDialogRef<ModalComponent>,
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.currentJobFlagInit();

    this.authService.userStream
      .pipe(
        map((user: User) => {
          this.user = user;
        })
      )
      .subscribe();

    this.addExperienceForm = new FormGroup({
      position: new FormControl<string | null>(
        this.passedData.experience?.position ?? null,
        [Validators.required]
      ),
      formOfEmployment: new FormControl<string | null>(
        this.passedData.experience?.formOfEmployment ?? null,
        [Validators.required]
      ),
      companyName: new FormControl<string | null>(
        this.passedData.experience?.companyName ?? null,
        [Validators.required]
      ),
      localization: new FormControl<string | null>(
        this.passedData.experience?.localization ?? null,
        [Validators.required]
      ),
      startDate: new FormControl<Date | null>(
        new Date(this.passedData.experience?.startDate as string),
        [Validators.required]
      ),
      endDate: new FormControl<Date | null>(
        this.passedData.experience?.endDate
          ? new Date(this.passedData.experience?.endDate)
          : null
      ),
      description: new FormControl<string | null>(
        this.passedData.experience?.description ?? null
      ),
      skills: new FormControl(this.passedData.experience?.skills ?? null),
    });
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (!this.addExperienceForm.valid) return;
    let data = this.addExperienceForm.value as UserExperience;
    if (this.passedData.editMode.isTrue) {
      data = { ...data, id: this.passedData.experience?.id, user: this.user };
      this.accountService
        .updateUserExperience(data, this.currentJobFlag)
        .subscribe((response) => {
          this.dialogRef.close({
            experience: response,
            editMode: {
              isTrue: true,
              experienceId: this.passedData.experience!.id,
            },
          } as ExperienceDialog);
        });
      return;
    }
    this.accountService
      .addUserExperience(data, this.currentJobFlag)
      .subscribe((response) => {
        this.resetForm(formDirective);
        this.dialogRef.close({
          experience: response,
          editMode: { isTrue: false, experienceId: null },
        } as ExperienceDialog);
      });
  }

  onDelete(experienceId: number) {
    this.accountService
      .deleteUserExperience(experienceId)
      .subscribe((response) => {
        if (response.affected >= 1) {
          let data: ExperienceDialog = {
            experience: undefined,
            editMode: { isTrue: false },
            deleteMode: { isTrue: true, experienceId },
          };
          this.dialogRef.close(data);
        } else {
          this.cancelPost();
        }
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
    let data = null;
    this.dialogRef.close({ data });
  }

  currentJobFlagInit() {
    if (!this.passedData.experience?.endDate) this.toggleCurrentJobFlag();
  }
}
