import { Component, OnInit, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  @Input()
  showContainer?: boolean = true;

  hidePassword = true;
  formTitle = {
    title: 'Zaloguj się ',
    subtext: 'Bądź na bieżaco w świecie specjalistów',
    footerText: {
      text1: 'Jesteś nowym użykownikiem Linkedin?',
      text2: 'Dolącz teraz!',
    },
    loginPage: true,
  };
  loginForm!: FormGroup;
  errorServerMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (!this.loginForm.valid) return;

    const loginFormValues = this.loginForm.value;
    this.authService.login(loginFormValues).subscribe({
      next: () => {
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.errorServerMessage = err.error.error.message;
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
    this.loginForm.reset();
  }
}
