import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(
      control?.parent?.invalid && control?.parent?.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
})
export class SignupComponent implements OnInit {
  hidePassword = true;
  hideConfirmPassword = true;
  formTitle = {
    title: 'Zarejestruj się',
    subtext: 'Osiągnij sukces w życiu zawodowym',
    footerText: { text1: 'Masz już konto w Linkedin?', text2: 'Zaloguj się' },
    loginPage: false,
  };
  registerForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  errorServerMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup(
      {
        firstName: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
        ]),
        lastName: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{3,}$'
          ),
        ]),
        confirmPassword: new FormControl(null, [Validators.required]),
        isPrivateAccount: new FormControl(false, [Validators.required]),
      },
      {
        validators: this.checkPasswords,
      }
    );

    this.registerForm
      .get('isPrivateAccount')
      ?.valueChanges.subscribe((privateAccount) => {
        if (privateAccount) {
          this.registerForm.get('lastName')?.disable();
        } else {
          this.registerForm.get('lastName')?.enable();
        }
      });
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirmPassword')!.value;
    return pass === confirmPass ? null : { notSame: true };
  };

  onSubmit(formDirective: FormGroupDirective) {
    if (!this.registerForm.valid) return;

    const registerFormValues = this.registerForm.value;
    let newUser = Object.assign({
      ...registerFormValues,
      isPrivateAccount: !registerFormValues.isPrivateAccount,
    });
    delete newUser.confirmPassword;
    this.authService.register(newUser).subscribe({
      next: () => {
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.errorServerMessage = err.error.message;
        setTimeout(() => {
          this.errorServerMessage = '';
        }, 5000);
      },
      complete: () => {
        this.resetForm(formDirective);
      },
    });
  }

  resetForm(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.registerForm.reset();
  }
}
