import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { searchProducts, searchProductsSuccess, searchProductsFailure } from './search.actions';
import { SearchService } from '../../../core/services/search.service';

@Injectable()
export class SearchEffects {
   
    actions$ = inject(Actions);
    searchService = inject(SearchService);
    store = inject(Store);

    // Effect to handle the searchProducts action
    searchProducts$ = createEffect(() =>
        this.actions$.pipe(
            ofType(searchProducts),  // Listen for the searchProducts action
            mergeMap((action) =>
                this.searchService.searchProducts(action.query).pipe(
                    map((results) => searchProductsSuccess({ results: results.data })),  // Dispatch success with results
                    catchError((error) => [searchProductsFailure({ error })])  // Dispatch failure if there's an error
                )
            )
        )
    );
}
