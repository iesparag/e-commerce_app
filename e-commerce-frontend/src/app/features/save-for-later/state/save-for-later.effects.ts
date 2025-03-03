// cart.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as SaveForLaterActions from './save-for-later.actions';
import * as CartActions from '../../cart/state/cart.actions';
import { SaveForLaterService } from '../../../core/services/save-for-later.service';
import { Store } from '@ngrx/store';

@Injectable()
export class SaveForLaterEffects {
  actions$ = inject(Actions);
  store = inject(Store)
  saveForLaterService = inject(SaveForLaterService)



  GetUserSaveForLaterItems$ = createEffect(() =>{
    return this.actions$.pipe(
      ofType(SaveForLaterActions.getUserSaveForLaterStart),
      mergeMap(() =>{
      return  this.saveForLaterService.getUserSaveForLaterItems().pipe(
          map((response) =>
            SaveForLaterActions.getUserSaveForLaterSuccess({ response  })
          ),
          catchError((error) =>
            of(SaveForLaterActions.getUserSaveForLaterFailure({ error: error.message }))
          )
        )}
      )
    )}
  );


  DeleteItemFromSaveForLater$ = createEffect(() =>{
    return this.actions$.pipe(
      ofType(SaveForLaterActions.deleteItemFromSaveForLaterStart),
      mergeMap(({productId}) =>{
      return  this.saveForLaterService.deleteItemFromSaveForLater(productId).pipe(
          map((response) =>
            SaveForLaterActions.deleteItemFromSaveForLaterSuccess({ saveForLaterItem: response.data  })
          ),
          catchError((error) =>
            of(SaveForLaterActions.getUserSaveForLaterFailure({ error: error.message }))
          )
        )}
      )
    )}
  );


  MoveProductToCartFromSaveForLater$ = createEffect(() =>{
    return this.actions$.pipe(
      ofType(SaveForLaterActions.moveToCartFromSaveForLaterStart),
      mergeMap(({productId}) =>{
      return  this.saveForLaterService.moveProductToCartFromSaveforLater(productId).pipe(
          map((response) =>
            SaveForLaterActions.moveToCartFromSaveForLaterSuccess({ saveForLaterItem : response.data  })
          ),
          tap((action) => {
                      // Dispatch remove from wishlist action using store.dispatch
                    return  this.store.dispatch(CartActions.addToCartSuccess({ cartItem : action.saveForLaterItem }));
                    }),
          catchError((error) =>
            of(SaveForLaterActions.moveToCartFromSaveForLaterFailure({ error: error.message }))
          )
        )}
      )
    )}
  );

}
