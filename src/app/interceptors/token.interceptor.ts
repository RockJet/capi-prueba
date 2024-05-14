import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedRequest = request.clone({
      setHeaders: {
        'X-CSRF-TOKEN': 'pGTmsfohhF7JmYnV8Ar1nXMvxSlUVvjR7SUDl0tQ'
      }
    })
    return next.handle(modifiedRequest)
  }
}
