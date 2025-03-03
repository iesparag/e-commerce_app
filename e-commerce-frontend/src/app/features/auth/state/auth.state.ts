  export interface AuthState {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string;
      role: string;
      wishlist: any[];
      cart: any[];
      addresses: AddressResponse[];
    } | null;
    accessToken: string | null;
    refreshToken: string | null;
    success?: boolean;
    error?: string | null;
    isAuthenticated: boolean,
  }
  
  export const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    success: false,
    error: null,
    isAuthenticated: false,
  };



  export interface AddressResponse {
    _id: string;
    userId: string;
    mainAddress: string;
    floor: string;
    building: string;
    street: string;
    locality: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    isDefault?: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface AddressPayload {
    mainAddress: string;
    floor: string;
    building: string;
    street: string;
    locality: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    isDefault?: boolean;
}
