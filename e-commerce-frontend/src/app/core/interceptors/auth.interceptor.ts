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
  const authService = inject(AuthService); // Inject AuthService

  // Get the access token from the auth service
  const accessToken = authService.getAccessToken();

  let authReq = req;

  // Add access token to the request header if available
  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If error is 401 (Unauthorized), handle token refresh
      if (error.status === 401) {
        // Call the refresh token API to get a new access token
        return authService.refreshAccessToken().pipe(
          tap((res) => {
            // Optionally, you can log or perform additional actions after the token refresh
          }),
          switchMap(
            (newTokens: { accessToken: string; refreshToken: string }) => {
              // Save the new tokens and retry the original request with the new access token
              authService.saveTokens(newTokens.accessToken, newTokens.refreshToken);

              // Clone the original request with the new access token
              const newRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newTokens.accessToken}`,
                },
              });

              // Retry the failed request
              return next(newRequest);
            }
          ),
          catchError((err) => {
            // Clear tokens and redirect to login in case of a refresh error
            authService.clearTokens();
            authService.navigateToLogin();
            return throwError(() => err);
          })
        );
      }

      // If error is not 401, propagate the error as is
      return throwError(() => error);
    })
  );
};
