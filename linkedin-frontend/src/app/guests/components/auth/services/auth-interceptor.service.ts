import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import localStorageKeys from 'src/dictionaries/localStorage-dict';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem(localStorageKeys.jwtToken);
    if (jwtToken) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + jwtToken),
      });
      return next.handle(clonedRequest);
    }
    return next.handle(req);
  }

  constructor() {}
}
