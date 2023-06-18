import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../guests/components/auth/services/auth.service';
import { FriendRequest } from '../home/models/FriendRequest';
import { ConnectionProfileService } from '../home/services/connection-profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // friendRequests!: FriendRequest[];
  private friendRequestsSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    public connectionProfileService: ConnectionProfileService
  ) {}

  ngOnInit(): void {
    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });

    //get the friend requests for authenticated user
    this.friendRequestsSubscription = this.connectionProfileService
      .getFriendRequests()
      .subscribe({
        next: (friendRequests: FriendRequest[]) => {
          this.connectionProfileService.friendRequests = friendRequests.filter(
            (friendRequest: FriendRequest) => {
              return friendRequest.status === 'pending';
            }
          );
        },
      });
  }
  showMenu = true;

  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  showMenuFromChild(data: boolean) {
    this.showMenu = data;
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
    this.friendRequestsSubscription.unsubscribe();
  }
}
