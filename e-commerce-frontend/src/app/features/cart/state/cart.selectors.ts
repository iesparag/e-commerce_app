import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';

// Select the entire cart state
export const selectCartState = createFeatureSelector<CartState>('cart');

// Select all cart items
export const selectAllCartItems = createSelector(
  selectCartState,
  (state) => state.items // Access the `items` array directly
);

// Select cart loading state
export const selectCartLoading = createSelector(
  selectCartState,
  (state) => state.isLoading
);

// Select cart error
export const selectCartError = createSelector(
  selectCartState,
  (state) => state.error
);

// Select a specific cart item by product ID
export const selectCartItemById = (productId: string) =>
  createSelector(selectAllCartItems, (items) =>
    items.find((item) => item.product.productId === productId)
  );

// Select the total quantity of items in the cart
export const selectCartTotalQuantity = createSelector(
  selectAllCartItems,
  (items) => items.length
);

// Select the total price of items in the cart
export const selectCartTotalPrice = createSelector(
  selectAllCartItems,
  (items) =>
    items.reduce((total, item) => total + item.quantity * item.product.price, 0)
);
