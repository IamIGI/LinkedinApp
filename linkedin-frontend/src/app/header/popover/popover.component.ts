import { Component } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.sass'],
})
export class PopoverComponent {
  onSignOut() {
    console.log('User SingOut');
  }
}
