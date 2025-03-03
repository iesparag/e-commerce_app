import { createAction, emptyProps, props } from '@ngrx/store';
import { AddressPayload, AddressResponse } from './auth.state';
import { ApiResponse } from '../../../core/types/response.interface';

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      wishlist: any[];
      cart: any[];
      addresses: AddressResponse[];
    };
    accessToken: string;
    refreshToken: string;
  }>()
);

export const updateUserFromLocalStorageSuccess = createAction(
  '[Auth] Login update from local'
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout'); // Logout initiation
export const logoutSuccess = createAction(
  '[Auth] Logout Success',
  // props:<{message:string}>()
); // On successful logout
export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: any }>()
);

// Add Address
export const addAddressStart = createAction('[Auth] Add Address Start', props<{ addresses: AddressPayload }>());
export const addAddressSuccess = createAction('[Auth] Add Address Success', props<{ addresses: AddressResponse }>());
export const addAddressFailure = createAction('[Auth] Add Address Failure', props<{ error: string }>());

// Fetch Addresses
export const fetchAddressesStart = createAction('[Auth] Fetch Addresses Start');
export const fetchAddressesSuccess = createAction('[Auth] Fetch Addresses Success', props<{ addresses: AddressResponse[] }>());
export const fetchAddressesFailure = createAction('[Auth] Fetch Addresses Failure', props<{ error: string }>());

