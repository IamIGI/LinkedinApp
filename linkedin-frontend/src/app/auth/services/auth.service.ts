import { Injectable } from '@angular/core';

import { Role, User, UserNotifications } from '../models/user.model';
import { BehaviorSubject, Observable, of, take, map } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { UserResponse } from '../models/userResponse.model';
import jwt_decode from 'jwt-decode';
import localStorageKeys from 'src/dictionaries/localStorage-dict';
import { NewUser } from '../models/newUser.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(null!);

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    );
  }

  get userRole(): Observable<Role | undefined> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        if (user !== null) return of(user?.role);
        return of(undefined);
      })
    );
  }

  get userId(): Observable<number> {
    return this.user$.asObservable().pipe(map((user: User) => user!.id));
  }

  get userStream(): Observable<User> {
    return this.user$.asObservable().pipe(
      map((user: User) => {
        return {
          ...user,
          profileFullImagePath: this.getUserFullImagePath(
            user.id,
            user.profileImagePath!,
            'profile'
          ),
          backgroundFullImagePath: this.getUserFullImagePath(
            user.id,
            user.backgroundImagePath!,
            'background'
          ),
        };
      })
    );
  }

  get userFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        let fullName: string = user?.firstName;
        if (user?.isPrivateAccount) fullName = `${fullName} ${user?.lastName}`;
        return of(fullName);
      })
    );
  }

  get userProfileFullImagePath(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const doesAuthorHasImage = !!user?.profileImagePath;
        let fullImagePath = this.getDefaultUserFullImagePath('profile');
        if (doesAuthorHasImage) {
          fullImagePath = this.getUserFullImagePath(
            user.id,
            user.profileImagePath as string,
            'profile'
          );
        }
        return of(fullImagePath);
      })
    );
  }

  get userBackgroundFullImagePath(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const doesAuthorHasImage = !!user?.profileImagePath;
        let fullImagePath = this.getDefaultUserFullImagePath('background');
        if (doesAuthorHasImage) {
          fullImagePath = this.getUserFullImagePath(
            user.id,
            user.profileImagePath as string,
            'background'
          );
        }
        return of(fullImagePath);
      })
    );
  }

  constructor(private http: HttpClient, private router: Router) {}

  getDefaultUserFullImagePath(imageType: 'profile' | 'background'): string {
    return `${environment.baseApiUrl}/feed/user/image/${imageType}/null`;
  }

  getUserFullImagePath(
    userId: number,
    imageName: string,
    imageType: 'profile' | 'background'
  ): string {
    return `${environment.baseApiUrl}/feed/user/image/${imageType}/${imageName}?userId=${userId}`;
  }

  getUserProfileImageName(): Observable<{ imageName: string }> {
    return this.http
      .get<{ imageName: string }>(
        `${environment.baseApiUrl}/user/image/profile/image-name`
      )
      .pipe(take(1));
  }

  updateUserProfileImagePath(imagePath: string) {
    return this.user$.pipe(
      take(1),
      map((user: User) => {
        user.profileImagePath = imagePath;
        this.updateUserDataInLocalStorage(user);
        this.user$.next(user);
      })
    );
  }

  uploadUserProfileImage(
    formData: FormData
  ): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(
        `${environment.baseApiUrl}/user/upload/profile`,
        formData
      )
      .pipe(
        tap(({ modifiedFileName }) => {
          let user = this.user$.value;
          user.profileImagePath = modifiedFileName;
          this.updateUserDataInLocalStorage(user);
          this.user$.next(user);
        })
      );
  }

  uploadUserBackgroundImage(
    formData: FormData
  ): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(
        `${environment.baseApiUrl}/user/upload/background`,
        formData
      )
      .pipe(
        tap(({ modifiedFileName }) => {
          let user = this.user$.value;
          user.backgroundImagePath = modifiedFileName;

          this.updateUserDataInLocalStorage(user);
          this.user$.next(user);
        })
      );
  }

  register(newUser: NewUser): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${environment.baseApiUrl}/auth/register`,
        newUser,
        this.httpOptions
      )
      .pipe(
        take(1),
        tap((response: { token: string }) => {
          localStorage.setItem(localStorageKeys.jwtToken, response.token);
          const decodedToken: UserResponse = jwt_decode(response.token);
          this.updateUserDataInLocalStorage(decodedToken.user);
          this.user$.next(decodedToken.user);
        })
      );
  }

  login(user: {
    email: string;
    password: string;
  }): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${environment.baseApiUrl}/auth/login`,
        user,
        this.httpOptions
      )
      .pipe(
        take(1),
        tap((response: { token: string }) => {
          localStorage.setItem(localStorageKeys.jwtToken, response.token);
          const decodedToken: UserResponse = jwt_decode(response.token);

          this.updateUserDataInLocalStorage(decodedToken.user);
          this.user$.next(decodedToken.user);
        })
      );
  }

  isTokenInStorage(): boolean {
    const token = localStorage.getItem(localStorageKeys.jwtToken);
    if (!token) return false;
    const decodedToken: UserResponse = jwt_decode(token);
    const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000; //to ms
    const isExpired = new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

    if (isExpired) return false;
    const userData: User = JSON.parse(
      localStorage.getItem(localStorageKeys.userData)!
    );

    this.user$.next(userData);
    return true;
  }

  logout(): void {
    this.user$.next(null!);
    localStorage.removeItem(localStorageKeys.userData);
    localStorage.removeItem(localStorageKeys.jwtToken);
    this.router.navigateByUrl('/guest');
  }

  private updateUserDataInLocalStorage(userData: User) {
    const userDataToString = JSON.stringify(userData);
    localStorage.setItem(localStorageKeys.userData, userDataToString);
  }
}
