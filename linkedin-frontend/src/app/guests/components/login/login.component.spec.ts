import { Router } from '@angular/router';

import { NewUser } from 'src/app/auth/models/newUser.model';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoginComponent } from './login.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FiltersComponent } from 'src/app/home/components/filters/filters.component';
import { RouterTestingModule } from '@angular/router/testing';

let routerSpy: Partial<Router>;
let authService: AuthService;

const registerSuccessResponse = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMCwiZmlyc3ROYW1lIjoidGVzdENvbXBhbnkiLCJsYXN0TmFtZSI6bnVsbCwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsInByb2ZpbGVJbWFnZVBhdGgiOm51bGwsImJhY2tncm91bmRJbWFnZVBhdGgiOm51bGwsInJvbGUiOiJwcmVtaXVtIiwiY29tcGFueSI6bnVsbCwicG9zaXRpb24iOm51bGwsImVkdWNhdGlvbiI6bnVsbCwic3Vic2NyaWJlcnMiOjAsImlzUHJpdmF0ZUFjY291bnQiOmZhbHNlfSwiaWF0IjoxNjg4NjMxNzAyLCJleHAiOjE2ODg2MzUzMDJ9.XgMvY-rTJD7eTs0hlMP_uT1HOJfeAxJMnrk1_CJm53Q',
};

const mockNewUser: NewUser = {
  firstName: 'testCompany',
  email: 'test@gmail.com',
  password: 'Test123!',
  isPrivateAccount: false,
};

const mockUser: User = {
  id: 10,
  firstName: mockNewUser.firstName,
  lastName: null,
  email: mockNewUser.email,
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
};

const mockAuthService: Partial<AuthService> = {
  register: () => of(registerSuccessResponse),
  login: () => of({ token: 'jwt' }),
};

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [
        // { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const loginFormValue = component.loginForm.controls;
    loginFormValue['email'].setValue(mockNewUser.email);
    loginFormValue['password'].setValue(mockNewUser.password);
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create with form values', waitForAsync(() => {
    fixture.whenStable().then(() => {
      expect(component.loginForm.controls['email'].value).toEqual(
        mockNewUser.email
      );
      expect(component.loginForm.controls['password'].value).toEqual(
        mockNewUser.password
      );
    });
  }));

  it('when email is correct, do not show any error ', () => {
    let email = component.loginForm.controls['email'];
    expect(email.valid).toBeTruthy();
    expect(email.hasError('required')).toBeFalsy();
  });

  it('when email field empty, show required', () => {
    let email = component.loginForm.controls['email'];
    email.setValue('');
    expect(email.valid).toBeFalsy();
    expect(email.hasError('required')).toBeTruthy();
    expect(email.value).toEqual('');
  });

  it('when password is correct, do not show any errors', () => {
    let password = component.loginForm.controls['password'];
    expect(password.hasError('required')).toBeFalsy();
  });

  it('when password is missing, show required, ', () => {
    let password = component.loginForm.controls['password'];
    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();
    expect(password.value).toEqual('');
  });
});
