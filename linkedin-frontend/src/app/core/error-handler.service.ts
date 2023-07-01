import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private toastr: ToastrService) {}

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.warn(`${operation} failed: ${error.message}`); //TODO: remove in production
      return of(result as T).pipe(
        tap(() => {
          this.toastr.error(error.message, 'Błąd');
        })
      );
    };
  }
}
