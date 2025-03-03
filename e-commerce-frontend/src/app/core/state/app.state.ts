// app.state.ts

import { AuthState } from "../../features/auth/state/auth.state";
import { PaymentState } from "../../features/cart/payment-state/payment.state";
import { CartState } from "../../features/cart/state/cart.state";
import { OrderState } from "../../features/orders/state/order.state";
import { ProductState } from "../../features/products/state/product.state";
import { SaveForLaterState } from "../../features/save-for-later/state/save-for-later.state";
import { SearchState } from "../../features/search/state/search.reducer";
import { WishlistState } from "../../features/wishlist/state/wishlist.state";



export interface AppState {
  auth: AuthState;
  landingPage:any;
  productPage:ProductState;
  cart: CartState,
  saveForLater: SaveForLaterState,
  wishlist:WishlistState,
  payment: PaymentState,
  orders:OrderState,
  search: SearchState
  // cart: CartState;  // Uncomment and add cart state if needed
}
