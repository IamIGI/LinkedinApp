import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormTemplateService } from '../../form-template.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  constructor(private formTemplateService: FormTemplateService) {}

  ngOnInit(): void {
    const formTitle = {
      title: 'Zaloguj się ',
      subtext: 'Bądź na bieżaco w świecie specjalistów',
      footerText: {
        text1: 'Jesteś nowym użykownikiem Linkedin?',
        text2: 'Dolącz teraz!',
      },
      loginPage: true,
    };
    this.formTemplateService.setFormTitleData(formTitle);
  }
}
