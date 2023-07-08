import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../service/account.service';
import { FormOfEmployment, UserExperience } from '../../models/account.models';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { TextService } from 'src/app/services/text.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.sass'],
})
export class ExperienceComponent implements OnInit {
  userExperience$!: Observable<UserExperience[]>;
  readMore: Boolean[] = [];

  constructor(
    public textService: TextService,
    private accountService: AccountService
  ) {}
  ngOnInit(): void {
    this.userExperience$ = this.accountService.getUserExperience().pipe(
      map((userExperience: UserExperience[]) => {
        return userExperience.map((experience: UserExperience) => {
          this.readMore.push(false);
          return {
            ...experience,
            skills: (experience.skills as unknown as string).split(','),
          };
        });
      })
    );
  }

  toggleReadMore(index: number) {
    this.readMore[index] = !this.readMore[index];
  }

  getFormOfEmployment(type: FormOfEmployment): string {
    switch (type) {
      case 'full':
        return 'Pełny etat';
      case 'internship':
        return 'Staż';
      case 'mandateContract':
        return 'Umowa zlecenie';
      case 'partly':
        return 'Niepełny etat';
      case 'practice':
        return 'Praktyka';
      case 'seasonWork':
        return 'Praca sezonowa';
      case 'selfEmployment':
        return 'Samo zatrudnienie';

      default:
        throw new Error('Given FromOfEmployment do not exists');
    }
  }

  formatExperienceDate(date: string): string {
    const monthName = this.getMonthName(date);
    const year = date.split('-')[0];
    return `${monthName.shortName} ${year}`;
  }

  private getMonthName(date: string): { fullName: string; shortName: string } {
    const month = date.split('-')[1];
    switch (month) {
      case '01':
        return { fullName: 'styczeń', shortName: 'sty.' };
      case '02':
        return { fullName: 'luty', shortName: 'lut.' };
      case '03':
        return { fullName: 'marzec', shortName: 'mar.' };
      case '04':
        return { fullName: 'kwiecień', shortName: 'kwi.' };
      case '05':
        return { fullName: 'maj', shortName: 'maj' };
      case '06':
        return { fullName: 'czerwiec', shortName: 'cze.' };
      case '07':
        return { fullName: 'lipiec', shortName: 'lip.' };
      case '08':
        return { fullName: 'sierpień', shortName: 'sie.' };
      case '09':
        return { fullName: 'wrzesień', shortName: 'wrz.' };
      case '10':
        return { fullName: 'październik', shortName: 'paz.' };
      case '11':
        return { fullName: 'listopad', shortName: 'lis.' };
      case '12':
        return { fullName: 'grudzień', shortName: 'gru.' };

      default:
        throw new Error('Bad date format: ' + date);
    }
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
    const startDateNumbers = getDateInNumbers(startDateString);
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
      return `${numberOfMonthsAtWork} mies.`;
    }
  }
}
