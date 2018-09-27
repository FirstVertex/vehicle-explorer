import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { apiConfig } from './api.config';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // only if outbound request begins with api host
    if (request.url.startsWith(apiConfig.host)) {
      // preserve any existing params
      let params = new HttpParams({ fromString: request.params.toString() });
      // add key to outbound request
      params = params.append("key", apiConfig.api_key);
      // must use clone to mutate request
      request = request.clone({
        params: params
      });
    }
    return next.handle(request);
  }
}