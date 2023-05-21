import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface formTitleDataInterface {
  title: string;
  subtext: string;
  footerText: { text1: string; text2: string };
  loginPage: boolean;
}

@Injectable()
export class FormTemplateService {
  formTitleDataChanged = new Subject<formTitleDataInterface>();

  private formTitleData: formTitleDataInterface = {
    title: '',
    subtext: '',
    footerText: { text1: '', text2: '' },
    loginPage: false,
  };

  setFormTitleData(data: formTitleDataInterface) {
    this.formTitleData = data;
    this.refreshFromTitleData();
  }

  getFormTitleData() {
    return this.formTitleData;
  }

  refreshFromTitleData() {
    this.formTitleDataChanged.next(this.formTitleData);
  }
}
