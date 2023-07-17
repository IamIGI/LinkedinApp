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
  from,
  of,
  forkJoin,
  catchError,
  EMPTY,
} from 'rxjs';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { FriendRequestStatus } from '../home/models/FriendRequest';
import { roleColors } from 'src/dictionaries/user-dict';
import { fromBuffer, FileTypeResult } from 'file-type/core';
import {
  validFileExtension,
  validMimeType,
} from '../home/components/profile-summary/profile-summary.component';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../auth/models/user.model';
import { NotificationsService } from '../notifications/services/notifications.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass'],
})
export class AccountComponent implements OnInit, OnDestroy, AfterViewInit {
  loggedUserId: number = null!;
  isLoggedUser!: boolean;
  accountRoleLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  userAccountLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  friendRequest!: FriendRequestStatus;
  friendRequestSubscription$!: Subscription;
  private userSubscription$!: Subscription;
  userRoleString = '';

  user!: User;

  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  @ViewChildren('accountType', { read: ElementRef })
  accountType!: QueryList<ElementRef>;

  constructor(
    private connectionProfileService: ConnectionProfileService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.accountRoleLoaded$.next(false);
    this.userAccountLoaded$.next(false);

    this.friendRequestSubscription$ = this.getFriendRequestStatus().subscribe(
      (friendRequestStatus: FriendRequestStatus) => {
        this.friendRequest = friendRequestStatus;
        this.accountRoleLoaded$.next(true);
      }
    );

    this.userSubscription$ = this.authService.userId
      .pipe(
        tap((authUserId: number) => {
          this.loggedUserId = authUserId;
          this.getUserIdFromUrl()
            .pipe(
              map((urlUserId: number) => {
                if (authUserId == urlUserId) {
                  this.isLoggedUser = true;
                  this.authService.userStream.subscribe((user: User) => {
                    this.userRoleString =
                      user.role == 'premium'
                        ? 'Konto Premium'
                        : user.role == 'admin'
                        ? 'Konto Admina'
                        : 'Konto Standardowe';
                    this.user = user;
                    this.userAccountLoaded$.next(true);
                  });
                } else {
                  this.isLoggedUser = false;
                  this.connectionProfileService
                    .getConnectionUser(urlUserId)
                    .subscribe((user: User) => {
                      this.user = user;
                      this.userAccountLoaded$.next(true);
                    });
                }
              })
            )
            .subscribe();
        })
      )
      .subscribe();

    this.notificationService
      .checkNotificationsStatus('accountPage')
      .pipe(take(1))
      .subscribe();
  }

  ngAfterViewInit(): void {
    console.log('here2');
    const accountType$ = this.accountType.changes as Observable<
      QueryList<ElementRef>
    >;
    forkJoin([accountType$, this.getUser()]).subscribe(([element, user]) => {
      console.log(user.role);
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

  onImageChange(event: Event, imageType: 'background' | 'profile'): void {
    let form!: FormGroup;

    form = new FormGroup({
      file: new FormControl(null),
    });

    const file: File = (
      (event.target as HTMLInputElement).files as FileList
    )[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        switchMap((buffer: ArrayBuffer) => {
          return from(fromBuffer(buffer)).pipe(
            switchMap((fileTypeResult: FileTypeResult | undefined) => {
              if (!fileTypeResult) {
                // TODO: error handling
                console.log({ error: 'file format not supported!' });
                return of();
              }
              const { ext, mime } = fileTypeResult;
              const isFileTypeLegit = this.validFileExtensions.includes(
                ext as any
              );
              const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
              const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
              if (!isFileLegit) {
                // TODO: error handling
                console.log({
                  error: 'file format does not match file extension!',
                });
                return of();
              }
              switch (imageType) {
                case 'background':
                  return this.authService.uploadUserBackgroundImage(formData);
                case 'profile':
                  return this.authService.uploadUserProfileImage(formData);
                default:
                  throw new Error('Give image type do not exists');
              }
            })
          );
        })
      )
      .subscribe();

    form.reset();
  }

  respondToFriendRequest(value: boolean) {
    const response = value ? 'accepted' : 'declined';

    return this.connectionProfileService
      .respondToFriendRequest(this.friendRequest.id, response)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.friendRequestSubscription$ =
            this.getFriendRequestStatus().subscribe(
              (friendRequestStatus: FriendRequestStatus) => {
                this.friendRequest = friendRequestStatus;
                this.connectionProfileService.removeFriendRequestFromList(
                  this.friendRequest.id
                );
              }
            );
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
