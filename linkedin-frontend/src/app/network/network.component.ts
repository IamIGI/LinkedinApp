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
        // complete: () => {
        //   console.log(this.connectionProfileService.friendRequests);
        // },
        // complete: () => {
        //   console.log(this.connectionProfileService.friendRequests);
        //   this.connectionProfileService.friendRequests.map(
        //     (friendRequest: FriendRequest) => {
        //       friendRequest.creator.fullImagePath =
        //         this.authService.getFullImagePath(
        //           friendRequest.creator.id,
        //           friendRequest.creator.imagePath as string
        //         );
        //       console.log(friendRequest);
        //       // const creatorId = (friendRequest as any)?.creator?.id;
        //       // if (friendRequest && creatorId) {
        //       //   this.connectionProfileService
        //       //     .getConnectionUser(creatorId)
        //       //     .pipe(
        //       //       take(1),
        //       //       tap((user: User) => {
        //       //         friendRequest.fullImagePath = `${
        //       //           environment.baseApiUrl
        //       //         }/feed/image${user?.imagePath || 'blank-profile-picture.jpg'}`;
        //       //       })
        //       //     )
        //       //     .subscribe();
        //       // }
        //     }
        //   );
        // },
      });
  }

  respondToFriendRequest(id: number, statusResponse: 'accepted' | 'declined') {
    const handledFriendRequest: FriendRequest | undefined =
      this.connectionProfileService.friendRequests.find(
        (friendRequest: FriendRequest) => {
          return friendRequest.id === id;
        }
      );

    const unhandledFriendRequest: FriendRequest[] =
      this.connectionProfileService.friendRequests.filter(
        (friendRequest: FriendRequest) => {
          return friendRequest.id !== handledFriendRequest!.id;
        }
      );

    this.connectionProfileService.friendRequests = unhandledFriendRequest;

    // if(this.connectionProfileService.friendRequests) {
    //   await
    // }

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
