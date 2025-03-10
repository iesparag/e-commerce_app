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

export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<{ error: string }>()
);

export const ForgotEmailSendStart = createAction('[Auth] Forgot start',props<{email:string}>());

export const ForgotEmailSendSuccess = createAction(
  '[Auth] Forgot OTP Sent Successful',
  props<{ response: ApiResponse<null> }>() 
);
export const ForgotEmailSendFails = createAction('[Auth] Forgot otp sent failed',props<{error: any}>())



export const verifyTokenStart = createAction(
  '[Auth] Verify Password Reset Token Start',
  props<{ token: string }>()
);

export const verifyTokenSuccess = createAction(
  '[Auth] Verify Password Reset Token Success',
  props<{ message: string }>()
);

export const verifyTokenFailure = createAction(
  '[Auth] Verify Password Reset Token Failure',
  props<{ error: any }>()
);

export const resetPasswordStart = createAction(
  '[Auth] Reset Password Start',
  props<{ token: string; newPassword: string }>()
);

export const resetPasswordSuccess = createAction(
  '[Auth] Reset Password Success',
  props<{ message: string }>()
);

export const resetPasswordFailure = createAction(
  '[Auth] Reset Password Failure',
  props<{ error: any }>()
);




export const updateUserFromLocalStorageSuccess = createAction(
    '[Auth] Login update from local'
);
export const logout = createAction('[Auth] Logout'); // Logout initiation
export const logoutSuccess = createAction(
    '[Auth] Logout Success'
    // props:<{message:string}>()
); // On successful logout
export const logoutFailure = createAction(
    '[Auth] Logout Failure',
    props<{ error: any }>()
);

// Add Address
export const addAddressStart = createAction(
    '[Auth] Add Address Start',
    props<{ addresses: AddressPayload }>()
);
export const addAddressSuccess = createAction(
    '[Auth] Add Address Success',
    props<{ addresses: AddressResponse }>()
);
export const addAddressFailure = createAction(
    '[Auth] Add Address Failure',
    props<{ error: string }>()
);

// Fetch Addresses
export const fetchAddressesStart = createAction('[Auth] Fetch Addresses Start');
export const fetchAddressesSuccess = createAction(
    '[Auth] Fetch Addresses Success',
    props<{ addresses: AddressResponse[] }>()
);
export const fetchAddressesFailure = createAction(
    '[Auth] Fetch Addresses Failure',
    props<{ error: string }>()
);

// refresh token actions
export const refreshTokenSuccess = createAction(
    '[Auth] Refresh Token Success',
    props<{ accessToken: string; refreshToken: string }>()
);



