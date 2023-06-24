import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { ConnectionProfileService } from '../home/services/connection-profile.service';
import {
  Observable,
  map,
  switchMap,
  Subscription,
  tap,
  take,
  BehaviorSubject,
} from 'rxjs';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { User } from '../guests/components/auth/models/user.model';
import { FriendRequestStatus } from '../home/models/FriendRequest';
import { AuthService } from '../guests/components/auth/services/auth.service';
import { roleColors } from 'src/dictionaries/user-dict';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass'],
})
export class AccountComponent implements OnInit, OnDestroy, AfterViewInit {
  loggedUserId: number = null!;
  user!: User;
  accountLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  friendRequest!: FriendRequestStatus;
  friendRequestSubscription$!: Subscription;
  userSubscription$!: Subscription;
  userRoleString = '';

  @ViewChildren('accountType', { read: ElementRef })
  accountType!: QueryList<ElementRef>;

  constructor(
    private connectionProfileService: ConnectionProfileService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.accountLoaded.next(false);
    // for task: #L-68
    // this.getUser().subscribe({ next: (x) => console.log(x) });
    this.friendRequestSubscription$ = this.getFriendRequestStatus()
      .pipe(
        tap((friendRequestStatus: FriendRequestStatus) => {
          this.friendRequest = friendRequestStatus;
        })
      )
      .subscribe();

    this.userSubscription$ = this.getUser().subscribe({
      next: (user: User) => {
        this.user = user;
        this.accountLoaded.next(true);
      },
    });

    this.authService.userId.subscribe({
      next: (userId: number) => {
        this.loggedUserId = userId;
      },
    });
  }

  ngAfterViewInit(): void {
    this.accountType.changes.pipe(take(1)).subscribe({
      next: (element: QueryList<ElementRef>) => {
        this.getUser().subscribe({
          next: (user: User) => {
            switch (user.role) {
              case 'premium':
                element.first.nativeElement.style.color = roleColors.premium;
                this.userRoleString = 'Konto Premium';
                break;
              case 'user':
                element.first.nativeElement.style.color = roleColors.user;
                this.userRoleString = 'Konto Standardowe';
                break;
              case 'admin':
                element.first.nativeElement.style.color = roleColors.admin;
                this.userRoleString = 'Konto Administratora';
                break;

              default:
                throw new Error('User role is undefined');
            }
          },
        });
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
    this.userSubscription$.unsubscribe();
  }
}
