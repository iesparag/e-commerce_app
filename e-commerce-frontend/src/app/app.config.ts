import {
    ApplicationConfig,
    importProvidersFrom,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { appReducer } from './core/state/app.reducer';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AuthEffects } from './features/auth/state/auth.effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations'; // Add this line
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { LandingpageEffects } from './features/landing-page/state/landing-page.effects';
import { ProductEffects } from './features/products/state/product.effects';
import { CartEffects } from './features/cart/state/cart.effects';
import { SaveForLaterEffects } from './features/save-for-later/state/save-for-later.effects';
import { WishlistEffects } from './features/wishlist/state/wishlist.effects';
import { environment } from '../environments/environment';
import { PaymentEffects } from './features/cart/payment-state/payment.effects';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy  } from '@angular/common';
import { OrderEffects } from './features/orders/state/order.effects';
import { SearchEffects } from './features/search/state/search.effects';

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy  }, 
        {
            provide: 'STRIPE_PUBLISHABLE_KEY',
            useFactory: () => {
                if (!environment.stripePublishableKey) {
                    throw new Error('Stripe publishable key is not configured');
                }
                return environment.stripePublishableKey;
            }
        },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withInterceptors([AuthInterceptor])),
        provideStore(appReducer),
        provideEffects([
            AuthEffects,
            LandingpageEffects,
            ProductEffects,
            CartEffects,
            SaveForLaterEffects,
            WishlistEffects,
            PaymentEffects,
            OrderEffects,
            SearchEffects
        ]),
        provideStoreDevtools({ maxAge: 25 }),
        provideAnimations(), // Add this line for animations support
        importProvidersFrom(MatSnackBarModule),
       
    ],
};
