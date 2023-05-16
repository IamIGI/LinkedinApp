import { Component, OnInit } from '@angular/core';
import { FormTemplateService } from '../../form-template.service';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
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

  constructor(private formTemplateService: FormTemplateService) {}

  ngOnInit(): void {
    this.formTemplateService.setFormTitleData(this.formTitle);

    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (!this.loginForm.valid) return;

    const loginFormValues = this.loginForm.value;
    const body = { ...loginFormValues };
    console.log(body);

    this.resetForm(formDirective);
  }

  resetForm(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.loginForm.reset();
  }
}
