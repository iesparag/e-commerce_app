import { createReducer, on } from '@ngrx/store';
import { initialWishlistState } from './wishlist.state';
import * as WishListActions from './wishlist.actions';

export const wishlistReducer = createReducer(
  initialWishlistState,
  on(WishListActions.moveToWishlistItemStart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(WishListActions.moveToWishlistItemSuccess, (state, { wishListItem }) => {
    const updatedItems = state.WishlistItems.filter(
      (item) => item.productId !== wishListItem.productId
    );
    return {
      ...state,
      isLoading: false,
      WishlistItems: updatedItems,
    };
  }),

  on(WishListActions.moveToWishlistItemFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  
  on(WishListActions.addItemTotheWishlistStart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(WishListActions.addItemTotheWishlistSuccess, (state, { wishListItem }) => {
    console.log('wishListItem: ', wishListItem);
    
    const itemExists = state.WishlistItems.some(
      (item) => item.productId === wishListItem.productId
    );
  
    const updatedItems = itemExists 
      ? state.WishlistItems  
      : [...state.WishlistItems, wishListItem]; 
  
    return {
      ...state,
      isLoading: false,
      WishlistItems: updatedItems,
    };
  }),

  on(WishListActions.addItemTotheWishlistFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(WishListActions.getUserWishlistStart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  // Get user cart: success
  on(WishListActions.getUserWishlistSuccess, (state, { response }) => {
    return {
      ...state,
      isLoading: false,
      WishlistItems: response.success ? response.data : state.WishlistItems,
      error: response.success ? null : response.message,
    };
  }),
  on(WishListActions.getUserWishlistFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(WishListActions.removeItemFromWishlistStart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(WishListActions.removeItemFromWishlistSuccess, (state, { wishListItem }) => {
    const updatedItems = state.WishlistItems.filter(
      (item) => item.productId !== wishListItem.productId
    );
    return {
      ...state,
      isLoading: false,
      WishlistItems: updatedItems,
    };
  }),
  on(WishListActions.removeItemFromWishlistFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
