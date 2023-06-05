import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Role, User } from 'src/app/guests/components/auth/models/user.model';
import { AuthService } from 'src/app/guests/components/auth/services/auth.service';
import { FileTypeResult } from 'file-type';
import { fromBuffer } from 'file-type/core';
import { BehaviorSubject, Subscription, from, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

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
export class ProfileSummaryComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  fullName$ = new BehaviorSubject<string>(null!);
  fullName = '';

  bannerColors: BannerColors = {
    premium: '#feb236',
    user: '#0077b5',
    admin: '#d64161',
  };

  userStream: User = null!;

  userRoleBackgroundColor = this.bannerColors.user;

  constructor(private authService: AuthService) {}

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

    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
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
                // TODO: error handling
                console.log({ error: 'file format not supported!' });
                return of();
              }
              const { ext, mime } = fileTypeResult;
              const isFileTypeLegit = this.validFileExtensions.includes(
                ext as any
              );
              const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
              const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
              if (!isFileLegit) {
                // TODO: error handling
                console.log({
                  error: 'file format does not match file extension!',
                });
                return of();
              }
              console.log(formData);
              return this.authService.uploadUserImage(formData);
            })
          );
        })
      )
      .subscribe();

    this.form.reset();
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
