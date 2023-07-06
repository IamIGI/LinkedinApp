// import { Router } from '@angular/router';
// import { NewUser } from '../models/NewUser';
// import { AuthService } from './auth.service';
// import { User } from '../models/user.model';
// import { of } from 'rxjs';
// import { UserResponse } from '../models/userResponse.model';
// import jwt_decode from 'jwt-decode';

// let httpClientSpy: { post: jasmine.Spy };
// let routerSpy: Partial<Router>;

// let authService: AuthService;

// const mockNewUser: NewUser = {
//   email: 'user@gmail.com',
//   firstName: 'UserAccount',
//   lastName: null,
//   isPrivateAccount: true,
//   password: 'User123!',
// };

// beforeEach(() => {
//   httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
//   routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

//   //making 'constructor'
//   authService = new AuthService(httpClientSpy as any, routerSpy as any);
// });

// fdescribe('AuthService', () => {
//   describe('register', () => {
//     it('should return the user', (done: DoneFn) => {
//       const expectedUser: UserResponse = {
//         user: {
//           id: 9,
//           firstName: 'user124Company',
//           lastName: null,
//           email: 'user124@gmail.com',
//           profileImagePath: null,
//           backgroundImagePath: null,
//           role: 'premium',
//           company: null,
//           position: null,
//           education: null,
//           subscribers: 0,
//           isPrivateAccount: false,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//         iat: 1688469071,
//         exp: 1688472671,
//       };

//       const token =
//         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo5LCJmaXJzdE5hbWUiOiJ1c2VyMTI0Q29tcGFueSIsImxhc3ROYW1lIjpudWxsLCJlbWFpbCI6InVzZXIxMjRAZ21haWwuY29tIiwicHJvZmlsZUltYWdlUGF0aCI6bnVsbCwiYmFja2dyb3VuZEltYWdlUGF0aCI6bnVsbCwicm9sZSI6InByZW1pdW0iLCJjb21wYW55IjpudWxsLCJwb3NpdGlvbiI6bnVsbCwiZWR1Y2F0aW9uIjpudWxsLCJzdWJzY3JpYmVycyI6MCwiaXNQcml2YXRlQWNjb3VudCI6ZmFsc2V9LCJpYXQiOjE2ODg0NjkwNzEsImV4cCI6MTY4ODQ3MjY3MX0._dCtZzjeL0ibykA8KqHxs0o_k7xQ_ZooOil4z0iJSzU';

//       httpClientSpy.post.and.returnValue(of(token));
//       authService
//         .register(mockNewUser)
//         .subscribe((response: { token: string }) => {
//           const decodedToken: UserResponse = jwt_decode(response.token);
//           expect(typeof decodedToken.user.id).toEqual('number');
//           expect(decodedToken.user.firstName).toEqual(
//             expectedUser.user.firstName
//           );
//           expect(decodedToken.user.lastName).toEqual(
//             expectedUser.user.lastName
//           );
//           expect((decodedToken as any).user.password).toBeUndefined();
//           expect(decodedToken.user.role).toEqual('premium');
//           expect(decodedToken.user.posts).toBeUndefined();

//           done();
//         });

//       expect(httpClientSpy.post.calls.count()).toBe(1);
//     });
//   });
// });
