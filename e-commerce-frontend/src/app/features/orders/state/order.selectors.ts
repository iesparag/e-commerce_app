import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './order.state';

// Feature selector for the Order state
export const selectOrderState = createFeatureSelector<OrderState>('orders');

// Selector to get all orders
export const selectAllOrders = createSelector(
  selectOrderState,
  (state) => state.orders
);

// Selector to get loading status
export const selectOrderLoading = createSelector(
  selectOrderState,
  (state) => state.loading
);

// Selector to get error messages
export const selectOrderError = createSelector(
  selectOrderState,
  (state) => state.error
);

// Selector to get selected order details
export const selectSelectedOrder = createSelector(
  selectOrderState,
  (state) => state.selectedOrder
);
