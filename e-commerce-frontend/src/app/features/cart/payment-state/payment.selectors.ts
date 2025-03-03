// payment.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaymentState } from './payment.state';

export const selectPaymentState = createFeatureSelector<PaymentState>('payment');

export const selectClientSecret = createSelector(
  selectPaymentState,
  (state) => state.clientSecret
);

export const selectTotalAmount = createSelector(
  selectPaymentState,
  (state) => state.totalAmount
);

export const selectPaymentLoading = createSelector(
  selectPaymentState,
  (state) => state.isLoading
);

export const selectPaymentError = createSelector(
  selectPaymentState,
  (state) => state.error
);
