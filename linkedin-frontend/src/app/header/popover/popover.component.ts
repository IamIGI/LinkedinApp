import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { User } from 'src/app/guests/components/auth/models/user.model';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.sass'],
})
export class PopoverComponent implements OnInit {
  userData: User = null!;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userData.pipe(take(1)).subscribe((user: User) => {
      this.userData = user;
    });
  }

  onSignOut() {
    this.authService.logout();
  }

  getUserJobData(): string | null {
    const position = this.userData.position;
    const company = this.userData.company;
    if (position === null || company === null) return null;
    return `${position} w ${company}`;
  }
}
