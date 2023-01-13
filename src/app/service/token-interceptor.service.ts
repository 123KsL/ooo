import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor() { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.headers.has('Content-Type')) {
      console.log('first')
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }
    request.headers.append('Access-Control-Allow-Headers', 'Content-Type');
    request.headers.append('Access-Control-Allow-Methods', 'POST');
    request.headers.append('Access-Control-Allow-Origin', '*');
    request = request.clone({ headers: request.headers.set('Accept', 'application/json') }).clone({
      setHeaders: {
        Authorization: `token`
      }
    });
    return next.handle(request);
  }
}

