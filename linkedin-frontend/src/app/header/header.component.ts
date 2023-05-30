import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../guests/components/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });
  }
  showMenu = true;

  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  showMenuFromChild(data: boolean) {
    this.showMenu = data;
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
