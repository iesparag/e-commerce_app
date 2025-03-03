import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Constants } from '../constants/constants-app';
import { ApiResponse } from '../types/response.interface';
import { PaymentState } from '../../features/cart/payment-state/payment.state';
import { loadStripe, Stripe } from '@stripe/stripe-js';  // Import loadStripe from @stripe/stripe-js

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private apiUrl = environment.apiBaseUrl;

  // Use loadStripe to load Stripe.js with your publishable key
  private stripePromise: Promise<Stripe | null>;

  constructor(private http: HttpClient, @Inject('STRIPE_PUBLISHABLE_KEY') private stripePublishableKey: string) {
    this.stripePromise = loadStripe(this.stripePublishableKey);  // Initialize stripePromise
  }

  createCheckoutSession(): Observable<ApiResponse<PaymentState>> {
    return this.http.post<ApiResponse<PaymentState>>(`${this.apiUrl}/${Constants.buyer.PAYMENT_CHECKOUT}`, {});
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    // Ensure the Stripe object is available
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error("Stripe.js failed to load.");
      return;
    }

    // Redirect to checkout
    const result = await stripe.redirectToCheckout({ sessionId });
    if (result.error) {
      alert(result.error.message);  // Handle error during redirection
    }
  }
}
