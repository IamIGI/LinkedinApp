import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.sass'],
})
export class StartPageComponent {
  internshipOption = [
    'Inżynieria',
    'Rozwój firmy',
    'Finanse',
    'Pomoc biurowa',
    'Pracownik handlowy',
    'Obsługa klienta',
    'Operacje biznesowe',
    'Technologie informatyczne',
    'Marketing',
    'HR',
  ];
  hidePassword = true;
  loginForm!: FormGroup;

  ngOnInit(): void {
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
