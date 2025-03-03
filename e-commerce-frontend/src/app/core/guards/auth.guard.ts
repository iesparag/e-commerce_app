import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store'; // Import Store from NgRx
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, first } from 'rxjs/operators';
import { selectAccessToken } from '../../features/auth/state/auth.selectors';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const store = inject(Store); // Inject Store
  const router = inject(Router); // Inject Router

  return store.select(selectAccessToken).pipe(
    map((accessToken) => {
      if (accessToken) {
        
        return true;
      } else {
        router.navigate(['/login']);
        return false; 
      }
    })
  );
};
