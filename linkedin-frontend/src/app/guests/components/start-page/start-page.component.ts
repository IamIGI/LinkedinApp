import { Component } from '@angular/core';

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
}
