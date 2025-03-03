import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LandingpageServiceService } from '../../../core/services/landingpage-service.service';
import * as LandingPageActions from './landing-page.actions';

@Injectable()
export class LandingpageEffects {
  actions$ = inject(Actions);
  landingpageService = inject(LandingpageServiceService);

  loadCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LandingPageActions.loadCategories),
      switchMap(() =>
        this.landingpageService.getAllCategories({}).pipe(
          map((response) => {
            return LandingPageActions.loadCategoriesSuccess({
              response,
            });
          }),
          catchError((error) =>
            of(
              LandingPageActions.loadCategoriesFailure({ error: error.message })
            )
          )
        )
      )
    );
  });
}
