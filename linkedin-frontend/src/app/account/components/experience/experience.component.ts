import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../service/account.service';
import { UserExperience } from '../../models/account.models';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.sass'],
})
export class ExperienceComponent implements OnInit {
  constructor(private accountService: AccountService) {}
  ngOnInit(): void {
    this.accountService
      .getUserExperience()
      .subscribe((data: UserExperience[]) => {
        console.log(data);
      });
  }
}
