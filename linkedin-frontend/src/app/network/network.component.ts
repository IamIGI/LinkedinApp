import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectionProfileService } from '../home/services/connection-profile.service';
import { FriendRequest } from '../home/models/FriendRequest';
import { Subscription, take } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { User } from '../auth/models/user.model';
import { NotificationsService } from '../notifications/services/notifications.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.sass'],
})
export class NetworkComponent implements OnInit, OnDestroy {
  private friendRequestsSubscription!: Subscription;

  constructor(
    public connectionProfileService: ConnectionProfileService,
    private authService: AuthService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    //get the friend requests for authenticated user
    this.friendRequestsSubscription = this.connectionProfileService
      .getFriendRequests()
      .subscribe({
        next: (friendRequests: FriendRequest[]) => {
          this.connectionProfileService.friendRequests = friendRequests.filter(
            //@ts-ignore
            (friendRequest: FriendRequest) => {
              if (friendRequest.status === 'pending') {
                friendRequest.creator.profileFullImagePath =
                  this.authService.getUserFullImagePath(
                    friendRequest.creator.id,
                    friendRequest.creator.profileImagePath as string,
                    'profile'
                  );
                return friendRequest;
              }
            }
          );
        },
      });

    this.notificationService
      .checkNotificationsStatus('network')
      .pipe(take(1))
      .subscribe();
  }

  respondToFriendRequest(id: number, statusResponse: 'accepted' | 'declined') {
    this.connectionProfileService.removeFriendRequestFromList(id);

    return this.connectionProfileService
      .respondToFriendRequest(id, statusResponse)
      .pipe(take(1))
      .subscribe();
  }

  getAuthorName(user: User): string {
    const { isPrivateAccount, firstName, lastName } = user;
    if (isPrivateAccount) return `${firstName} ${lastName}`;
    return `${firstName}`;
  }

  ngOnDestroy(): void {
    this.friendRequestsSubscription.unsubscribe();
  }
}
