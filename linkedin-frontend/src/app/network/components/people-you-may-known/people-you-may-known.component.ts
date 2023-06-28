import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/models/user.model';
import { ConnectionProfileService } from 'src/app/home/services/connection-profile.service';

@Component({
  selector: 'app-people-you-may-known',
  templateUrl: './people-you-may-known.component.html',
  styleUrls: ['./people-you-may-known.component.sass'],
})
export class PeopleYouMayKnownComponent implements OnInit {
  usersToBeRecommended: User[] = [];
  recommendedUsers: User[] = [];

  constructor(private connectionProfileService: ConnectionProfileService) {}

  ngOnInit(): void {
    this.connectionProfileService
      .getNoConnectionUsers(0)
      .subscribe((users: User[]) => {
        console.log(users);
        this.usersToBeRecommended = users.slice(8);
        this.recommendedUsers = users.slice(0, 8);
      });
  }

  addUser(userId: number) {
    this.removeUserFromRecommendedUsers(userId);
    this.addUserToBeRecommended();
    return this.connectionProfileService.addConnectionUser(userId).subscribe();
  }

  hideUser(userId: number) {
    this.removeUserFromRecommendedUsers(userId);
    this.addUserToBeRecommended();
  }

  getAuthorName(user: User): string {
    const { isPrivateAccount, firstName, lastName } = user;
    if (isPrivateAccount) return `${firstName} ${lastName}`;
    return `${firstName}`;
  }

  private removeUserFromRecommendedUsers(userId: number) {
    this.recommendedUsers = this.recommendedUsers.filter(
      (user) => user.id !== userId
    );
  }

  private addUserToBeRecommended() {
    if (this.usersToBeRecommended.length > 0) {
      this.recommendedUsers.push(this.usersToBeRecommended.shift() as User);
    }
  }
}
