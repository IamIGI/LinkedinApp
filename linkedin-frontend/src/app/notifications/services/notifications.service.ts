import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { UserNotifications } from 'src/app/auth/models/user.model';
import { environment } from 'src/environments/environment.development';
import {
  PageNewUserNotifications,
  newUserNotifications,
} from '../dictionaries/newUser.dict';

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

  checkNotificationsStatus(page: PageNewUserNotifications) {
    return this.userNotificationsStatus.pipe(
      map((userNotifications: UserNotifications) => {
        console.log(userNotifications);
        if (
          !userNotifications[
            newUserNotifications[page].pageType as keyof UserNotifications
          ]
        ) {
          this.toastr.info(
            newUserNotifications[page].message,
            newUserNotifications[page].title,
            newUserNotifications[page].params
          );
          this.updateUserNotificationStatus({
            ...userNotifications,
            [newUserNotifications[page].pageType as keyof UserNotifications]:
              true,
          }).subscribe();
        }
      })
    );
  }
}
