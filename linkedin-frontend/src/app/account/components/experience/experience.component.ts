import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../service/account.service';
import { UserExperience } from '../../models/account.models';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.sass'],
})
export class ExperienceComponent implements OnInit {
  userExperience$!: Observable<UserExperience[]>;

  constructor(private accountService: AccountService) {}
  ngOnInit(): void {
    this.userExperience$ = this.accountService.getUserExperience().pipe(
      map((userExperience: UserExperience[]) => {
        return userExperience.map((experience: UserExperience) => {
          return {
            ...experience,
            skills: (experience.skills as unknown as string).split(','),
          };
        });
      })
    );
  }
}
