
export interface saveForLaterProduct {
  productId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  videos: string[];
}

export interface SaveForLaterState {
  saveForLaterItems: saveForLaterProduct[];
  isLoading: boolean; 
  error: string | null; 
}

export const initialSaveForLaterState: SaveForLaterState = {
  saveForLaterItems: [], 
  isLoading: false,
  error: null,
};
