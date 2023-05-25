import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Role } from 'src/app/guests/components/auth/models/user.model';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';

type BannerColors = {
  premium: string;
  user: string;
  admin: string;
};
@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.sass'],
})
export class ProfileSummaryComponent implements OnInit {
  bannerColors: BannerColors = {
    premium: '#feb236',
    user: '#0077b5',
    admin: '#d64161',
  };

  userRoleBackgroundColor = this.bannerColors.user;

  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.userRole
      .pipe(take(1))
      .subscribe((role: Role | undefined) => {
        if (role) {
          this.getBannerColors(role);
        }
      });
  }

  private getBannerColors(role: Role): void {
    switch (role) {
      case 'admin':
        this.userRoleBackgroundColor = this.bannerColors.admin;
        break;

      case 'premium':
        this.userRoleBackgroundColor = this.bannerColors.premium;
        break;

      default:
        this.userRoleBackgroundColor = this.bannerColors.user;
        break;
    }
  }
}
