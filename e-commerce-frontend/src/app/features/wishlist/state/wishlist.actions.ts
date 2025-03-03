// wishlist.actions.ts
import { createAction, props } from '@ngrx/store';
import { wishlistProduct } from './wishlist.state';
import { ApiResponse } from '../../../core/types/response.interface';

// //////////////////////////////////////////////////////////////
export const getUserWishlistStart = createAction('[Wishlist]] Get User Wishlist');

export const getUserWishlistSuccess = createAction(
  '[Wishlist] Get user Wishlist Success',
  props<{ response: ApiResponse<wishlistProduct[]> }>()
);

export const getUserWishlistFailure = createAction(
  '[Wishlist] Get User Wishlist Failure',
  props<{ error: string }>()
);

///////////////////////////////////////////////////////////////
export const moveToWishlistItemStart = createAction(
  '[Wishlist] move to wishlist from cart',
  props<{ productId: string}>()
);

export const moveToWishlistItemSuccess = createAction(
  '[Wishlist] move to wishlist from cart Success',
  props<{ wishListItem: wishlistProduct }>()
);

export const moveToWishlistItemFailure = createAction(
  '[Wishlist] move to wishlist from cart Failure',
  props<{ error: string }>()
);


/////////////////////////////////////////////////////////////
export const removeItemFromWishlistStart = createAction(
  '[Wishlist] removeItemFrom Wishlist start',
  props<{ productId: string}>()
);

export const removeItemFromWishlistSuccess = createAction(
  '[Wishlist] removeItemFrom Wishlist Success',
  props<{ wishListItem: wishlistProduct }>()
);

export const removeItemFromWishlistFailure = createAction(
  '[Wishlist] removeItemFrom Wishlist Failure',
  props<{ error: string }>()
);


/////////////////////////////////////////////////////////////
export const addItemTotheWishlistStart = createAction(
  '[Wishlist] Add item to Wishlist start',
  props<{ productId: string}>()
);

export const addItemTotheWishlistSuccess = createAction(
  '[Wishlist] Add item to Wishlist Success',
  props<{ wishListItem: wishlistProduct }>()
);

export const addItemTotheWishlistFailure = createAction(
  '[Wishlist] Add item to Wishlist Failure',
  props<{ error: string }>()
);