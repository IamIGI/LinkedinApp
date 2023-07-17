import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../service/account.service';
import {
  FormOfEmployment,
  MonthsNameDict,
  UserExperience,
} from '../../models/account.models';
import { Subject } from 'rxjs';
import { TextService } from 'src/app/services/text.service';
import { MatDialog } from '@angular/material/dialog';
import { AddExperienceComponent } from '../add-experience/add-experience.component';
import {
  formOfEmployment,
  monthsName,
} from './dictionaries/experience.dictionaries';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.sass'],
})
export class ExperienceComponent implements OnInit {
  userExperience$ = new Subject<UserExperience[]>();
  userExperience!: UserExperience[];
  readMore: Boolean[] = [];

  constructor(
    public textService: TextService,
    private accountService: AccountService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.accountService
      .getUserExperience()
      .subscribe((result: UserExperience[]) => {
        this.readMore = Array(result.length).fill(false);
        this.userExperience = result;
        this.userExperience$.next(result);
      });
  }

  toggleReadMore(index: number) {
    this.readMore[index] = !this.readMore[index];
  }

  getFormOfEmployment(type: FormOfEmployment): string {
    const result = formOfEmployment.find((employmentType) => {
      return employmentType.value === type;
    })?.viewText;
    if (!result) {
      throw new Error('Given FromOfEmployment do not exists');
    }
    return result;
  }

  addExperienceDialog() {
    const dialogRef = this.dialog.open(AddExperienceComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result.data) {
        this.userExperience.unshift(result.data);
        this.userExperience$.next(this.userExperience);
      }
    });
  }

  formatExperienceDate(date: string): string {
    const monthName = this.getMonthName(date);
    const year = date.split('-')[0];
    return `${monthName.shortName} ${year}`;
  }

  private getMonthName(date: string): MonthsNameDict {
    const monthNumber = date.split('-')[1];
    const result = monthsName.find((month) => {
      return month.number === monthNumber;
    });
    if (!result) {
      throw new Error('Given FromOfEmployment do not exists');
    }
    return result;
  }

  workingTimeDescription(experience: UserExperience): string {
    function getDateInNumbers(date: string): {
      year: number;
      month: number;
    } {
      return {
        year: Number(date.split('-')[0]),
        month: Number(date.split('-')[1]),
      };
    }

    const startDateString = experience.startDate;
    const endDateString =
      experience.endDate ?? new Date().toISOString().split('T')[0];
    const startDateNumbers = getDateInNumbers(startDateString as string);
    const endDateNumbers = getDateInNumbers(endDateString);
    const startDateInFormat = new Date(
      startDateNumbers.year,
      startDateNumbers.month,
      0
    );
    const endDateInFormat = new Date(
      endDateNumbers.year,
      endDateNumbers.month,
      0
    );
    const diff = endDateInFormat.getTime() - startDateInFormat.getTime();
    const diffInMonth = diff / (1000 * 60 * 60 * 24 * 30);
    const roundedNumberOfAllMonths = Math.ceil(diffInMonth);
    const numberOfYearsAtWork = Math.floor(roundedNumberOfAllMonths / 12);
    const numberOfMonthsAtWork = roundedNumberOfAllMonths % 12;
    const yearDescription =
      numberOfYearsAtWork === 1
        ? 'rok'
        : numberOfYearsAtWork >= 2 && numberOfYearsAtWork <= 4
        ? 'lata'
        : 'lat';

    if (numberOfYearsAtWork > 0) {
      return `${numberOfYearsAtWork} ${yearDescription} ${numberOfMonthsAtWork} mies.`;
    } else {
      if (numberOfMonthsAtWork === 0) {
        return '1 mies.';
      }
      return `${numberOfMonthsAtWork} mies.`;
    }
  }
}
