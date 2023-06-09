import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.sass'],
})
export class SearchbarComponent {
  @Output() showMenu = new EventEmitter<boolean>();

  widthIsSmallerThan700px = false;
  showMobileSearchBarButton = true;
  searchForm!: FormGroup;

  @HostListener('window:resize', []) widthListener() {
    if (window.innerWidth >= 700) {
      this.widthIsSmallerThan700px = false;
    } else {
      this.widthIsSmallerThan700px = true;
    }
  }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null, [Validators.required]),
    });

    this.widthListener();
  }

  onSubmit() {
    if (this.widthIsSmallerThan700px) {
      this.changeMobileSearchBarVisibility();
    }
  }

  changeMobileSearchBarVisibility() {
    this.showMobileSearchBarButton = !this.showMobileSearchBarButton;
    this.showMenu.emit(this.showMobileSearchBarButton);
  }
}
