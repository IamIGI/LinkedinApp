import { Component } from '@angular/core';
import { options } from './data';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.sass'],
})
export class StartPostComponent {
  options = options;
}
