import { Component } from '@angular/core';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.sass'],
})
export class PopoverComponent {
  constructor(private authService: AuthService) {}

  onSignOut() {
    this.authService.logout();
  }
}
