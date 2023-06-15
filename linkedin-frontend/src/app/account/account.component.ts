import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConnectionProfileService } from '../home/services/connection-profile.service';
import { Observable, map, switchMap, Subscription, tap, take } from 'rxjs';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { User } from '../guests/components/auth/models/user.model';
import {
  FriendRequestStatus,
  FriendRequest_Status,
} from '../home/models/FriendRequest';
import { AuthService } from '../guests/components/auth/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass'],
})
export class AccountComponent implements OnInit, OnDestroy {
  loggedUserId: number = null!;
  user: User = null!;
  friendRequestStatus: FriendRequest_Status = null!;
  friendRequestSubscription$!: Subscription;
  userRequestSubscription$!: Subscription;

  constructor(
    private connectionProfileService: ConnectionProfileService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // for task: #L-68
    // this.getUser().subscribe({ next: (x) => console.log(x) });
    this.friendRequestSubscription$ = this.getFriendRequestStatus()
      .pipe(
        tap((friendRequestStatus: FriendRequestStatus) => {
          this.friendRequestStatus = friendRequestStatus.status;
          this.userRequestSubscription$ = this.getUser().subscribe({
            next: (user: User) => {
              this.user = user;
              const imgPath = user.imagePath ?? 'blank-profile-picture.png';
              this.user[
                'fullImagePath'
              ] = `http://localhost:3000/api/feed/user/image/${imgPath}?userId=${user.id}`;
            },
          });
        })
      )
      .subscribe();

    this.authService.userId.subscribe({
      next: (userId: number) => {
        this.loggedUserId = userId;
      },
    });
  }

  getUser(): Observable<User> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getConnectionUser(userId);
      })
    );
  }

  addUser(): Subscription {
    this.friendRequestStatus = 'pending';
    return this.getUserIdFromUrl()
      .pipe(
        switchMap((userId: number) => {
          return this.connectionProfileService.addConnectionUser(userId);
        })
      )
      .pipe(take(1))
      .subscribe();
  }

  getFriendRequestStatus(): Observable<FriendRequestStatus> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getFriendRequestStatus(userId);
      })
    );
  }

  private getUserIdFromUrl(): Observable<number> {
    return this.route.url.pipe(
      map((urlSegment: UrlSegment[]) => {
        return parseInt(urlSegment[1].path);
      })
    );
  }

  getAuthorName(): string {
    const { isPrivateAccount, firstName, lastName } = this.user;
    if (isPrivateAccount) return `${firstName} ${lastName}`;
    return `${firstName}`;
  }

  ngOnDestroy(): void {
    this.friendRequestSubscription$.unsubscribe();
    this.userRequestSubscription$.unsubscribe();
  }
}
