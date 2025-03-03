import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from '../../features/auth/state/auth.reducer';
import { landingPageReducer } from '../../features/landing-page/state/landing-page.reducer';
import { productReducer } from '../../features/products/state/product.reducer';
import { cartReducer } from '../../features/cart/state/cart.reducer';
import { saveForLaterReducer } from '../../features/save-for-later/state/save-for-later.reducer';
import { wishlistReducer } from '../../features/wishlist/state/wishlist.reducer';
import { paymentReducer } from '../../features/cart/payment-state/payment.reducer';
import { orderReducer } from '../../features/orders/state/order.reducer';
import { searchReducer } from '../../features/search/state/search.reducer';
// import { cartReducer } from '../features/cart/state/cart.reducer';

export const appReducer: ActionReducerMap<AppState> = {
  auth: authReducer,
  landingPage: landingPageReducer,
  productPage:productReducer,
  cart: cartReducer,
  saveForLater: saveForLaterReducer,
  wishlist: wishlistReducer,
  payment: paymentReducer,
  orders:orderReducer,
  search:searchReducer
};