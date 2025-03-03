import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { AddressPayload } from './auth.state';

@Injectable()
export class AuthEffects {
  // constructor(private actions$: Actions, private authService:AuthService) {}

  actions$ = inject(Actions);
  authService = inject(AuthService);
  router = inject(Router);
  toastService = inject(ToastService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map((response) => {
            if (response.success) {
              return AuthActions.loginSuccess({
                user: response.data.user,
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
              });
            } else {
              return AuthActions.loginFailure({ error: 'Invalid credentials' });
            }
          }),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error.message || 'An error occurred',
              })
            )
          )
        )
      )
    )
  );


addAddress$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.addAddressStart), // Listening for the correct action
    mergeMap(({ addresses }: { addresses: AddressPayload }) =>
      this.authService.saveUserAddressInService(addresses).pipe(
        map((response) => 
          AuthActions.addAddressSuccess({ addresses: response.data })
        ),
        catchError((error) =>
          of(AuthActions.addAddressFailure({ error: error.message }))
        )
      )
    )
  )
);

fetchUserAddress$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.fetchAddressesStart),
    mergeMap(() =>
      this.authService.fetchUserAllAddressInService().pipe(
        map((response) => 
          AuthActions.fetchAddressesSuccess({ addresses: response.data })
        ),
        catchError((error) =>
          of(AuthActions.fetchAddressesFailure({ error: error.message }))
        )
      )
    )
  )
);



  redirectAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess), // Jab loginSuccess action dispatch hoga
        tap(() => {
          this.router.navigate(['/home']); // User ko /products pe redirect karein
        })
      ),
    { dispatch: false } // Is effect ka koi naya action dispatch nahi hoga
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user, accessToken, refreshToken }) => {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          // this.toastService.showSuccess('Login successful!');
        })
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          this.toastService.showError(error || 'Invalid login credentials');
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map((item) => {
            return AuthActions.logoutSuccess()}),
          catchError((error) => of(AuthActions.logoutFailure({ error })))
        )
      )
    )
  );

  // Handle logout success and redirect to login page
  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this.toastService.showSuccess("User Logged Out Successfully");
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

}
