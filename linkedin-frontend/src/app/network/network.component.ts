import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectionProfileService } from '../home/services/connection-profile.service';
import { FriendRequest } from '../home/models/FriendRequest';
import { Subscription, take } from 'rxjs';
import { User } from '../guests/components/auth/models/user.model';
import { environment } from 'src/environments/environment.development';
import { AuthService } from '../guests/components/auth/services/auth.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.sass'],
})
export class NetworkComponent implements OnInit, OnDestroy {
  private friendRequestsSubscription!: Subscription;

  constructor(
    public connectionProfileService: ConnectionProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('triggered');

    //get the friend requests for authenticated user
    this.friendRequestsSubscription = this.connectionProfileService
      .getFriendRequests()
      .subscribe({
        next: (friendRequests: FriendRequest[]) => {
          this.connectionProfileService.friendRequests = friendRequests.filter(
            //@ts-ignore
            (friendRequest: FriendRequest) => {
              if (friendRequest.status === 'pending') {
                friendRequest.creator.fullImagePath =
                  this.authService.getFullImagePath(
                    friendRequest.creator.id,
                    friendRequest.creator.imagePath as string
                  );
                return friendRequest;
              }
            }
          );
        },
      });
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
