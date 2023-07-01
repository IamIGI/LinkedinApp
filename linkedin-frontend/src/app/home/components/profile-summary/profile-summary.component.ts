import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fromBuffer, FileTypeResult } from 'file-type/core';
import { BehaviorSubject, Subscription, from, of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { roleColors } from 'src/dictionaries/user-dict';
import { Role, User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

export type validFileExtension = 'png' | 'jpg' | 'jpeg';
export type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.sass'],
})
export class ProfileSummaryComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  userProfileFullImagePath!: string;
  private userProfileImagePathSubscription!: Subscription;

  fullName$ = new BehaviorSubject<string>(null!);
  fullName = '';

  userStream: User = null!;

  userRoleBackgroundColor = roleColors.user;

  constructor(
    private authService: AuthService,
    private router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      file: new FormControl(null),
    });

    this.authService.userRole
      .pipe(take(1))
      .subscribe((role: Role | undefined) => {
        if (role) {
          this.getBannerColors(role);
        }
      });

    this.authService.userStream.pipe(take(1)).subscribe((user: User) => {
      this.userStream = user;
    });

    this.authService.userFullName
      .pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        this.fullName$.next(fullName);
      });

    this.userProfileImagePathSubscription =
      this.authService.userProfileFullImagePath.subscribe(
        (fullImagePath: string) => {
          this.userProfileFullImagePath = fullImagePath;
        }
      );
  }

  private getBannerColors(role: Role): void {
    switch (role) {
      case 'admin':
        this.userRoleBackgroundColor = roleColors.admin;
        break;

      case 'premium':
        this.userRoleBackgroundColor = roleColors.premium;
        break;

      default:
        this.userRoleBackgroundColor = roleColors.user;
        break;
    }
  }

  getUserJobData(): string | null {
    const position = this.userStream.position;
    const company = this.userStream.company;
    if (position === null || company === null) return null;
    return `${position} w ${company}`;
  }

  onFileSelect(event: Event): void {
    const file: File = (
      (event.target as HTMLInputElement).files as FileList
    )[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        switchMap((buffer: ArrayBuffer) => {
          return from(fromBuffer(buffer)).pipe(
            switchMap((fileTypeResult: FileTypeResult | undefined) => {
              if (!fileTypeResult) {
                throw new Error('Format pliku nie wspierany');
              }
              const { ext, mime } = fileTypeResult;
              const isFileTypeLegit = this.validFileExtensions.includes(
                ext as any
              );
              const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
              const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
              if (!isFileLegit) {
                throw new Error('Nie wspierane rozszerzenie pliku');
              }
              return this.authService.uploadUserProfileImage(formData);
            }),
            catchError(
              this.errorHandlerService.handleError<FileTypeResult>(
                'uploadImage',
                undefined
              )
            )
          );
        })
      )
      .subscribe();

    this.form.reset();
  }

  goToAccount() {
    this.router.navigate([`home/account/${this.userStream.id}`]);
  }

  ngOnDestroy(): void {
    this.userProfileImagePathSubscription.unsubscribe();
  }
}
