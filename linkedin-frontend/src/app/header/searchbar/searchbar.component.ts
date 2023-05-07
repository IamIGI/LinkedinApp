import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.sass'],
})
export class SearchbarComponent {
  searchForm!: FormGroup;

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null, [Validators.required]),
    });

    this.searchForm.valueChanges.subscribe((value) => console.log(value));
  }

  onSubmit() {
    console.log(this.searchForm.value);
  }
}
