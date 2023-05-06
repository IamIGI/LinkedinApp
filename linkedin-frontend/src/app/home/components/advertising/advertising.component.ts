import { Component } from '@angular/core';
import { data } from './mock-data';

@Component({
  selector: 'app-advertising',
  templateUrl: './advertising.component.html',
  styleUrls: ['./advertising.component.sass'],
})
export class AdvertisingComponent {
  advertData = data;
}
