import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { of, throwError } from 'rxjs';
import { UserResponse } from '../models/userResponse.model';
import jwt_decode from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';
import { NewUser } from '../models/newUser.model';

interface CustomErrorResponse {
  statusCode: number;
  error: {
    message: string;
  };
  path: string;
  method: string;
  timeStamp: string;
}

let httpClientSpy: { post: jasmine.Spy };
let routerSpy: Partial<Router>;

let authService: AuthService;

const mockNewUser: NewUser = {
  firstName: 'testCompany',
  email: 'test@gmail.com',
  password: 'Test123!',
  isPrivateAccount: false,
};

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
  routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  //making 'constructor'
  authService = new AuthService(httpClientSpy as any, routerSpy as any);
});

describe('AuthService', () => {
  describe('register', () => {
    it('should return the user', (done: DoneFn) => {
      const expectedUser: UserResponse = {
        user: {
          id: 10,
          firstName: 'testCompany',
          lastName: null,
          email: 'test@gmail.com',
          profileImagePath: null,
          backgroundImagePath: null,
          role: 'premium',
          company: null,
          position: null,
          education: null,
          subscribers: 0,
          isPrivateAccount: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        iat: 1688469071,
        exp: 1688472671,
      };

      const registerSuccessResponse = {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMCwiZmlyc3ROYW1lIjoidGVzdENvbXBhbnkiLCJsYXN0TmFtZSI6bnVsbCwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsInByb2ZpbGVJbWFnZVBhdGgiOm51bGwsImJhY2tncm91bmRJbWFnZVBhdGgiOm51bGwsInJvbGUiOiJwcmVtaXVtIiwiY29tcGFueSI6bnVsbCwicG9zaXRpb24iOm51bGwsImVkdWNhdGlvbiI6bnVsbCwic3Vic2NyaWJlcnMiOjAsImlzUHJpdmF0ZUFjY291bnQiOmZhbHNlfSwiaWF0IjoxNjg4NjMxNzAyLCJleHAiOjE2ODg2MzUzMDJ9.XgMvY-rTJD7eTs0hlMP_uT1HOJfeAxJMnrk1_CJm53Q',
      };

      httpClientSpy.post.and.returnValue(of(registerSuccessResponse));

      authService
        .register(mockNewUser)
        .subscribe((response: { token: string }) => {
          const decodedToken: UserResponse = jwt_decode(response.token);
          expect(typeof decodedToken.user.id).toEqual('number');
          expect(decodedToken.user.firstName).toEqual(
            expectedUser.user.firstName
          );
          expect(decodedToken.user.lastName).toEqual(
            expectedUser.user.lastName
          );
          expect((decodedToken as any).user.password).toBeUndefined();
          expect(decodedToken.user.role).toEqual('premium');
          expect(decodedToken.user.posts).toBeUndefined();

          done();
        });

      expect(httpClientSpy.post.calls.count()).toBe(1);
    });

    it('should return an error if email already exists', (done: DoneFn) => {
      const errorResponse: CustomErrorResponse = {
        statusCode: 404,
        error: {
          message: 'Istnieje już konto z danym adresem email',
        },
        path: '/api/auth/register',
        method: 'POST',
        timeStamp: '2023-07-06T08:58:59.646Z',
      };

      httpClientSpy.post.and.returnValue(throwError(() => errorResponse));
      authService.register(mockNewUser).subscribe({
        next: () => {
          done.fail('expected a bad request error');
        },
        error: (HttpErrorResponse: CustomErrorResponse) => {
          expect(HttpErrorResponse.error.message).toContain(
            'Istnieje już konto z'
          );
          expect(HttpErrorResponse.path).toEqual('/api/auth/register');
          expect(HttpErrorResponse.statusCode).toEqual(404);
          done();
        },
      });
    });
  });
});
