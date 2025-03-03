import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistState } from './wishlist.state';

// Select the entire cart state
export const selectWishlistState = createFeatureSelector<WishlistState>('wishlist');

// Select all cart items
export const selectAllWishlistItems = createSelector(
  selectWishlistState,
  (state) => state.WishlistItems
);

// Select cart loading state
export const selectWishlistLoading = createSelector(
  selectWishlistState,
  (state) => state.isLoading
);

// Select cart loading state
export const selectWishlistTotalQuantity = createSelector(
  selectWishlistState,
  (state) => state.WishlistItems.length
);

// Select cart error
export const selectWishlistError = createSelector(
  selectWishlistState,
  (state) => state.error
);



