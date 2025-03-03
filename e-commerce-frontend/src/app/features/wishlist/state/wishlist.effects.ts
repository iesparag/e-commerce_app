// cart.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as WishListActions from './wishlist.actions';
import { WishlistService } from '../../../core/services/wishlist.service';

@Injectable()
export class WishlistEffects {
  actions$ = inject(Actions);
  wishlistService = inject(WishlistService);

  MoveToWishlistFromCart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WishListActions.moveToWishlistItemStart),
      mergeMap(({ productId }) => {
        return this.wishlistService.moveToWishlistFromCart(productId).pipe(
          map((response) =>
            WishListActions.moveToWishlistItemSuccess({
              wishListItem: response.data,
            })
          ),
          catchError((error) =>
            of(
              WishListActions.moveToWishlistItemFailure({
                error: error.message,
              })
            )
          )
        );
      })
    );
  });

  RemoveItemFromWishlist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WishListActions.removeItemFromWishlistStart),
      mergeMap(({ productId }) => {
        return this.wishlistService.removeItemFromWishlist(productId).pipe(
          map((response) =>
            WishListActions.removeItemFromWishlistSuccess({
              wishListItem: response.data,
            })
          ),
          catchError((error) =>
            of(
              WishListActions.removeItemFromWishlistFailure({
                error: error.message,
              })
            )
          )
        );
      })
    );
  });

  AddItemToWishlist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WishListActions.addItemTotheWishlistStart),
      mergeMap(({ productId }) => {
        return this.wishlistService.addItemToTheWishlist(productId).pipe(
          map((response) =>{
            console.log('response: AddItemToWishlist', response);
          return WishListActions.addItemTotheWishlistSuccess({
              wishListItem: response.data,
            })}
          ),
          catchError((error) =>
            of(
              WishListActions.addItemTotheWishlistFailure({
                error: error.message,
              })
            )
          )
        );
      })
    );
  });

  getUserWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishListActions.getUserWishlistStart),
      mergeMap(() =>
        this.wishlistService.getUserWishlistService().pipe(
          map((response) => {
            return WishListActions.getUserWishlistSuccess({
              response: response,
            });
          }),
          catchError((error) =>
            of(WishListActions.getUserWishlistFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
