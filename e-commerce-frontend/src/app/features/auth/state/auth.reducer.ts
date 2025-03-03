// auth.reducer.ts

import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialState } from './auth.state';



export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.loginSuccess,
    (state, { user, accessToken, refreshToken }) => {
      return ({
      ...state,
      user: {
        ...user,
        addresses: user.addresses || [], // Ensure addresses are initialized
      },
      accessToken,
      refreshToken,
      success: true,
      error: null,
      isAuthenticated: true
    })}
  ),
  on(
  AuthActions.updateUserFromLocalStorageSuccess,
  (state) => ({
    ...state,
    user: JSON.parse(localStorage.getItem('user') || 'null'),  // Parse the stored string into an object
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    success: true,
    error: null,
    isAuthenticated: true
  })
),
  on(AuthActions.loginFailure, (state, { error }) => {
    console.log('error: ', error);
    return ({
    ...state,
    success: false,
    error,
    isAuthenticated:false,
  })}),
  on(AuthActions.logout, (state) => ({
    ...state,
    isAuthenticated: true,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    accessToken:null,
    refreshToken:null,
    
  })),
  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Add Address
 on(AuthActions.addAddressStart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.addAddressSuccess, (state, { addresses }) => ({
    ...state,
    user: state.user
      ? {
          ...state.user,
          addresses: [...state.user.addresses, addresses],
        }
      : null,
    loading: false,
    success: true,
  })),
  on(AuthActions.addAddressFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    success: false,
  })),

  // Fetch Addresses
  on(AuthActions.fetchAddressesStart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.fetchAddressesSuccess, (state, { addresses }) => ({
    ...state,
    user: state.user
      ? {
          ...state.user,
          addresses,
        }
      : null,
    loading: false,
    success: true,
  })),
  on(AuthActions.fetchAddressesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    success: false,
  }))
);
