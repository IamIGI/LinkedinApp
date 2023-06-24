import { Injectable } from '@angular/core';
import { NewUser } from '../models/newUser.model';
import { Role, User } from '../models/user.model';
import { BehaviorSubject, Observable, of, take, map } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { UserResponse } from '../models/userResponse.model';
import jwt_decode from 'jwt-decode';
import localStorageKeys from 'src/dictionaries/localStorage-dict';

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
    return this.user$.asObservable().pipe(map((user: User) => user));
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

  get userFullImagePath(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const doesAuthorHasImage = !!user?.profileImagePath;
        let fullImagePath = this.getDefaultProfileFullImagePath();
        if (doesAuthorHasImage) {
          fullImagePath = this.getProfileFullImagePath(
            user.id,
            user.profileImagePath as string
          );
        }
        return of(fullImagePath);
      })
    );
  }

  constructor(private http: HttpClient, private router: Router) {
    this.getUserProfileImageName()
      .pipe(
        take(1),
        tap(({ imageName }) => {
          const defaultFullImagePath = 'null';
          this.updateUserProfileImagePath(
            imageName || defaultFullImagePath
          ).subscribe();
        })
      )
      .subscribe();
  }

  getDefaultProfileFullImagePath(): string {
    return `${environment.baseApiUrl}/feed/user/image/profile/null`;
  }

  getProfileFullImagePath(userId: number, imageName: string): string {
    return `${environment.baseApiUrl}/feed/user/image/profile/${imageName}?userId=${userId}`;
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

    this.user$.next(decodedToken.user);
    return true;
  }

  logout(): void {
    this.user$.next(null!);
    localStorage.removeItem(localStorageKeys.jwtToken);
    this.router.navigateByUrl('/guest');
  }
}
