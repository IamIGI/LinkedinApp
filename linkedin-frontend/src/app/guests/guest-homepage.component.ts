import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-guest-homepage',
  templateUrl: './guest-homepage.component.html',
  styleUrls: ['./guest-homepage.component.sass'],
})
export class GuestHomepageComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  navigate(where: string) {
    switch (where) {
      case 'register':
        //change for correct url path?
        this.router.navigate(['signup'], { relativeTo: this.route });
        break;
      case 'login':
        this.router.navigate(['login'], { relativeTo: this.route });
        break;
      case 'home':
        this.router.navigate(['guest']);
        break;
      default:
        throw new Error('Given case not exists');
    }
  }
}
