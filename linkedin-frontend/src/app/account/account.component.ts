import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConnectionProfileService } from '../home/services/connection-profile.service';
import { Observable, map, switchMap, Subscription, tap, take } from 'rxjs';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { User } from '../guests/components/auth/models/user.model';
import {
  FriendRequest,
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
  friendRequest!: FriendRequestStatus;
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
          this.friendRequest = friendRequestStatus;
          this.userRequestSubscription$ = this.getUser().subscribe({
            next: (user: User) => {
              this.user = user;
              this.user.fullImagePath = this.authService.getFullImagePath(
                user.id,
                user.imagePath as string
              );
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
    this.friendRequest.status = 'pending';
    return this.getUserIdFromUrl()
      .pipe(
        switchMap((userId: number) => {
          return this.connectionProfileService.addConnectionUser(userId);
        })
      )
      .pipe(take(1))
      .subscribe();
  }

  respondToFriendRequest(value: boolean) {
    const response = value ? 'accepted' : 'declined';

    return this.connectionProfileService
      .respondToFriendRequest(this.friendRequest.id, response)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.friendRequestSubscription$ = this.getFriendRequestStatus()
            .pipe(
              tap((friendRequestStatus: FriendRequestStatus) => {
                this.friendRequest = friendRequestStatus;
              })
            )
            .subscribe(() => {
              this.connectionProfileService.removeFriendRequestFromList(
                this.friendRequest.id
              );
            });
        },
      });
  }

  getFriendRequestStatus(): Observable<FriendRequestStatus> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        console.log(userId);
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

  friendRequestButton(): string {
    switch (this.friendRequest.status) {
      case 'not-sent':
        return 'Nawiąż kontakt';
      case 'pending':
        return 'Wysłano zaproszenie';
      case 'waiting-for-current-user-response':
        return 'Zaakceptuj';
      default:
        return 'Already answered to requests';
    }
  }

  ngOnDestroy(): void {
    this.friendRequestSubscription$.unsubscribe();
    this.userRequestSubscription$.unsubscribe();
  }
}
