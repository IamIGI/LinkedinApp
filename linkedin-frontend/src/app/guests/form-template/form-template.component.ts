import { Component, OnInit } from '@angular/core';
import { FormTemplateService } from './form-template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formTitleDataInterface } from './form-template.service';

@Component({
  selector: 'app-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.sass'],
})
export class FormTemplateComponent implements OnInit {
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
