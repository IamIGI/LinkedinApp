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
    return this.user$.asObservable().pipe(map((user: User) => user!));
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
        const doesAuthorHasImage = !!user?.imagePath;
        let fullImagePath = this.getDefaultFullImagePath();
        if (doesAuthorHasImage) {
          fullImagePath = this.getFullImagePath(
            user.id,
            user.imagePath as string
          );
        }
        return of(fullImagePath);
      })
    );
  }

  constructor(private http: HttpClient, private router: Router) {}

  getDefaultFullImagePath(): string {
    return `${environment.baseApiUrl}/feed/user/image/null`;
  }

  getFullImagePath(userId: number, imageName: string): string {
    return `${environment.baseApiUrl}/feed/user/image/${imageName}?userId=${userId}`;
  }

  getUserImageName(): Observable<{ imageName: string }> {
    return this.http
      .get<{ imageName: string }>(`${environment.baseApiUrl}/user/image-name`)
      .pipe(take(1));
  }

  updateUserImagePath(imagePath: string): Observable<User> {
    return this.user$.pipe(
      take(1),
      map((user: User) => {
        user.imagePath = imagePath;
        this.user$.next(user);
        return user;
      })
    );
  }

  uploadUserImage(
    formData: FormData
  ): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(
        `${environment.baseApiUrl}/user/upload`,
        formData
      )
      .pipe(
        tap(({ modifiedFileName }) => {
          let user = this.user$.value;
          user.imagePath = modifiedFileName;
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
