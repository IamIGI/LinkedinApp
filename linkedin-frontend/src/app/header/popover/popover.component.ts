import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.sass'],
})
export class PopoverComponent implements OnInit {
  userStream!: User;

  fullName$ = new BehaviorSubject<string>(null!);
  fullName = '';

  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userImagePathSubscription =
      this.authService.userProfileFullImagePath.subscribe(
        (fullImagePath: string) => {
          this.userFullImagePath = fullImagePath;
        }
      );

    this.authService.userFullName
      .pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        this.fullName$.next(fullName);
      });

    this.authService.userStream.pipe(take(1)).subscribe((user: User) => {
      this.userStream = user;
    });
  }

  onSignOut() {
    this.authService.logout();
  }

  getUserJobData(): string | null {
    const position = this.userStream.position;
    const company = this.userStream.company;
    if (position === null || company === null) return null;
    return `${position} w ${company}`;
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
