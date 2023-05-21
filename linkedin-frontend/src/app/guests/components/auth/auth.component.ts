import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormTemplateService,
  formTitleDataInterface,
} from './form-template.service';

@Component({
  selector: 'app-form-template',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass'],
})
export class AuthComponent implements OnInit {
  formWelcomeData: formTitleDataInterface = {
    title: '',
    subtext: '',
    footerText: { text1: '', text2: '' },
    loginPage: false,
  };

  constructor(
    private formTemplateService: FormTemplateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formTemplateService.formTitleDataChanged.subscribe(
      (data: formTitleDataInterface) => {
        this.formWelcomeData = data;
      }
    );
  }

  switchForms() {
    if (this.formWelcomeData.loginPage) {
      this.router.navigate(['signup'], { relativeTo: this.route });
    } else {
      this.router.navigate(['login'], { relativeTo: this.route });
    }
  }
}
