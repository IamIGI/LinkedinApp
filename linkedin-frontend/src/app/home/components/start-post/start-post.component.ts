import { Component, Output, EventEmitter } from '@angular/core';
import { options } from './data';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.sass'],
})
export class StartPostComponent {
  @Output() create: EventEmitter<any> = new EventEmitter();
  options = options;

  constructor(private dialog: MatDialog) {}

  async openModal() {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'modalClass',
      data: { options },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.create.emit(result);
    });
  }
}
