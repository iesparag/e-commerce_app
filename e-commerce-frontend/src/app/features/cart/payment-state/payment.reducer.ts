// payment.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as PaymentActions from './payment.actions';
import { initialPaymentState, PaymentState } from './payment.state';

export const paymentReducer = createReducer(
  initialPaymentState,
  on(PaymentActions.createPaymentIntent, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(PaymentActions.createPaymentIntentSuccess, (state, { sessionId }) => {
    return ({
    ...state,
    sessionId,
    isLoading: false,
  })}),
  on(PaymentActions.createPaymentIntentFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);
