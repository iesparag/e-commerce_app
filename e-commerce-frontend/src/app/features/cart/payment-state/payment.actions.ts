// payment.actions.ts
import { createAction, props } from '@ngrx/store';

export const createPaymentIntent = createAction(
  '[Payment] Create Payment Intent',
);

export const createPaymentIntentSuccess = createAction(
  '[Payment] Create Payment Intent Success',
  props<{ sessionId: string }>()  // Now passing sessionId instead of clientSecret
);

export const createPaymentIntentFailure = createAction(
  '[Payment] Create Payment Intent Failure',
  props<{ error: string }>()
);
