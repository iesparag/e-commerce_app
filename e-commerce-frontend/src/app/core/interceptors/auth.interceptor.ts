import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  let authReq = req;

  // 🔹 Token hai toh Authorization header set karo
  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 🔹 Agar error 401 hai, refresh token try karo
      if (error.status === 401) {
        return authService.refreshAccessToken().pipe(
          switchMap((newTokens) => {
            console.log('🔹 New Tokens:', newTokens);
        
            if (!newTokens?.data?.accessToken || !newTokens?.data?.refreshToken) {
              console.error('❌ New tokens are invalid!', newTokens);
              authService.clearTokens();
              authService.navigateToLogin();
              return throwError(() => new Error('Invalid tokens received'));
            }
        
            authService.saveTokens(newTokens?.data?.accessToken, newTokens?.data?.refreshToken);
        
            const newRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newTokens?.data?.accessToken}`,
              },
            });
        
            return next(newRequest);
          }),
          catchError((err) => {
            console.error('❌ Refresh failed in interceptor:', err);
            // authService.clearTokens();
            // authService.navigateToLogin();
            return throwError(() => err);
          })
        );
        
      }

      return throwError(() => error);
    })
  );
};
