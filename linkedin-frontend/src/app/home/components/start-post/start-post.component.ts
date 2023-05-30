import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { options } from './data';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.sass'],
})
export class StartPostComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();
  options = options;

  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  constructor(private dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {
    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });
  }

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

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
