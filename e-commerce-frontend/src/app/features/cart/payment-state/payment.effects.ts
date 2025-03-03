// payment.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as PaymentActions from './payment.actions';
import { StripeService } from '../../../core/services/stripe.service';

@Injectable()
export class PaymentEffects {
    actions$ = inject(Actions);
    stripeService = inject(StripeService);


   createPaymentIntent$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentActions.createPaymentIntent),
      mergeMap(() => {
        return this.stripeService.createCheckoutSession().pipe(
          map((response) => {
            console.log('response: ', response);

            // Check if sessionId exists and redirect
            if (response.data && response.data.sessionId) {
              // Redirect to Stripe Checkout
              this.stripeService.redirectToCheckout(response.data.sessionId);

              // Dispatch success action with sessionId (for other state management or logging)
              return PaymentActions.createPaymentIntentSuccess({
                sessionId: response.data.sessionId, // Pass sessionId instead of clientSecret
              });
            } else {
              return PaymentActions.createPaymentIntentFailure({
                error: 'No session ID returned from Stripe.',
              });
            }
          }),
          catchError((error) =>
            of(PaymentActions.createPaymentIntentFailure({ error: error.message }))
          )
        );
      })
    );
  });
}
