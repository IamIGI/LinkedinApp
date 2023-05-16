import { Component, OnInit } from '@angular/core';
import { FormTemplateService } from '../../form-template.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
})
export class SignupComponent implements OnInit {
  constructor(private formTemplateService: FormTemplateService) {}

  ngOnInit(): void {
    const formTitle = {
      title: 'Zarejestruj się',
      subtext: 'Osiągnij sukces w życiu zawodowym',
      footerText: { text1: 'Masz już konto w Linkedin?', text2: 'Zaloguj się' },
      loginPage: false,
    };
    this.formTemplateService.setFormTitleData(formTitle);
  }
}
