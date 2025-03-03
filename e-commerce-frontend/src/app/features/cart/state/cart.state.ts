
export interface cartProduct {
  productId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  videos: string[];
}

export interface CartItem {
  product: cartProduct;
  quantity: number;
}

export interface CartState {
  items: CartItem[]; // Array to hold cart items
  isLoading: boolean; // Loading state
  error: string | null; // Error message
}

export const initialCartState: CartState = {
  items: [], // Initially, the cart is empty
  isLoading: false,
  error: null,
};
