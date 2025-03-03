// cart.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as CartActions from './cart.actions';
import * as WishlistActions from '../../wishlist/state/wishlist.actions';
import * as SaveForLaterActions from '../../save-for-later/state/save-for-later.actions';
import { CartService } from '../../../core/services/cart.service';
import { Store } from '@ngrx/store';

@Injectable()
export class CartEffects {
  actions$ = inject(Actions);
  store = inject(Store)
  cartService = inject(CartService)
  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToCart),
      mergeMap(({ productId, quantity }) =>
        this.cartService.addItemToCart(productId, quantity).pipe(
          map((response) =>
            CartActions.addToCartSuccess({ cartItem: response.data })
          ),
          catchError((error) =>
            of(CartActions.addToCartFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateProductQuantity$ = createEffect(() =>{
    return this.actions$.pipe(
      ofType(CartActions.updateProductQuantity),
      mergeMap(({ productId, quantity }) =>{
      return  this.cartService.updateProductQuantity(productId, quantity).pipe(
          map((response) =>
            CartActions.updateProductQuantitySuccess({ cartItem: response.data })
          ),
          catchError((error) =>
            of(CartActions.updateProductQuantityFailure({ error: error.message }))
          )
        )}
      )
    )}
  );


  DeleteItemFromUserCart$ = createEffect(() =>{
    return this.actions$.pipe(
      ofType(CartActions.deleteItemFromCartStart),
      mergeMap(({ productId }) =>{
      return  this.cartService.deleteItemFromCart(productId).pipe(
          map((response) =>
            CartActions.deleteItemFromCartSuccess({ cartItem: response.data })
          ),
          catchError((error) =>
            of(CartActions.deleteItemFromCartFailure({ error: error.message }))
          )
        )}
      )
    )}
  );




  moveFromWishlistToCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CartActions.moveFromWishlistToCartStart),
      mergeMap(({ productId }) => {
        return this.cartService.moveFromWishlistToCartService(productId).pipe(
          // Handle the success response
          map((response) => {
            // Return the action to move the item to the cart
            return CartActions.moveFromWishlistToCartSuccess({ cartItem: response.data });
          }),
          // Dispatch remove item from wishlist action after success
          tap((action) => {
            // Dispatch remove from wishlist action using store.dispatch
            this.store.dispatch(WishlistActions.removeItemFromWishlistSuccess({ wishListItem: action.cartItem.product }));
          }),
          catchError((error) =>
            of(CartActions.moveFromWishlistToCartFailure({ error: error.message }))
          )
        );
      })
    );
  });


  moveToWishlistFromCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CartActions.moveToWishlistFromCartStart),
      mergeMap(({ productId }) => {
        return this.cartService.moveToWishlistFromCart(productId).pipe(
          // Handle the success response
          map((response) => {
            // Return the action to move the item to the cart
            return CartActions.moveToWishlistFromCartSuccess({ cartItem: response.data });
          }),
          // Dispatch remove item from wishlist action after success
          tap((action) => {
            // Dispatch remove from wishlist action using store.dispatch
            this.store.dispatch(WishlistActions.addItemTotheWishlistSuccess({ wishListItem: action.cartItem.product }));
          }),
          catchError((error) =>
            of(CartActions.moveToWishlistFromCartFailure({ error: error.message }))
          )
        );
      })
    );
  });

  MoveToSaveForLaterFromCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CartActions.moveToSaveForLaterItemFromCartStart),
      mergeMap(({ productId }) => {
        return this.cartService.moveToSaveForLaterFromCart(productId).pipe(
          // Handle the success response
          map((response) => {
            // Return the action to move the item to the cart
            return CartActions.moveToSaveForLaterItemFromCartSuccess({ cartItem: response.data });
          }),
          // Dispatch remove item from wishlist action after success
          tap((action) => {
            // Dispatch remove from wishlist action using store.dispatch
          return  this.store.dispatch(SaveForLaterActions.addItemToTheSaveForLaterSuccess({ saveForLaterItem : action.cartItem.product }));
          }),
          catchError((error) =>
            of(CartActions.moveToWishlistFromCartFailure({ error: error.message }))
          )
        );
      })
    );
  });
  

  getUserCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.getUserCart),
      mergeMap(() =>
        this.cartService.getUserCartService().pipe(
          map((response) =>{
          return  CartActions.getUserCartSuccess({ response: response})
          }
          ),
          catchError((error) =>
            of(CartActions.updateProductQuantityFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
