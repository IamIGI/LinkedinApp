import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, pipe } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { User, UserNotifications } from 'src/app/auth/models/user.model';
import { environment } from 'src/environments/environment.development';
import { NotificationData, newUser } from '../dictionaries/newUser.dict';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  get userNotificationsStatus(): Observable<UserNotifications> {
    return this.http
      .get<UserNotifications>(`${environment.baseApiUrl}/user/notifications`)
      .pipe(take(1));
  }

  constructor(
    private readonly http: HttpClient,
    private toastr: ToastrService
  ) {}

  updateUserNotificationStatus(userNotificationStatus: UserNotifications) {
    return this.http.patch(
      `${environment.baseApiUrl}/user/notifications`,
      userNotificationStatus
    );
  }

  checkNotificationsStatus(
    page: 'homePage' | 'account' | 'network' | 'statistics'
  ) {
    let notificationData: NotificationData;

    switch (page) {
      case 'homePage':
        notificationData = newUser.homePage;
        break;
      case 'account':
        notificationData = newUser.accountPage;
        break;
      case 'network':
        notificationData = newUser.networkPage;
        break;
      case 'statistics':
        notificationData = newUser.statisticsPage;
        break;

      default:
        throw new Error('Unknown page name was given');
    }

    return this.userNotificationsStatus.pipe(
      map((userNotifications: UserNotifications) => {
        if (
          !userNotifications[
            notificationData.pageType as keyof UserNotifications
          ]
        ) {
          this.toastr.info(
            notificationData.message,
            notificationData.title,
            notificationData.params
          );
          this.updateUserNotificationStatus({
            ...userNotifications,
            [notificationData.pageType as keyof UserNotifications]: true,
          }).subscribe();
        }
      })
    );
  }
}
