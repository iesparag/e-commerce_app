
export interface wishlistProduct {
  productId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  videos: string[];
}

export interface WishlistState {
  WishlistItems: wishlistProduct[];
  isLoading: boolean; 
  error: string | null; 
}

export const initialWishlistState: WishlistState = {
  WishlistItems: [], 
  isLoading: false,
  error: null,
};
