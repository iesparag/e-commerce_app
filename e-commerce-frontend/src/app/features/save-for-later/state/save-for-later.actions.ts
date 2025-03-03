// cart.actions.ts
import { createAction, props } from '@ngrx/store';
import {saveForLaterProduct } from './save-for-later.state';
import { ApiResponse } from '../../../core/types/response.interface';
import { CartItem } from '../../cart/state/cart.state';



export const getUserSaveForLaterStart = createAction('[saveForLater]] Get User saveForLater');

export const getUserSaveForLaterSuccess = createAction(
  '[saveForLater] Get user saveForLater Success',
  props<{ response: ApiResponse<saveForLaterProduct[]> }>()
);

export const getUserSaveForLaterFailure = createAction(
  '[saveForLater] Get User saveForLater Failure',
  props<{ error: string }>()
);



export const addItemToTheSaveForLaterStart = createAction('[saveForLater]] Add Item saveForLater');

export const addItemToTheSaveForLaterSuccess = createAction(
  '[saveForLater] Add Item saveForLater Success',
  props<{ saveForLaterItem: saveForLaterProduct }>()
);

export const addItemToTheSaveForLaterFailure = createAction(
  '[saveForLater] Add Item saveForLater Failure',
  props<{ error: string }>()
);


export const deleteItemFromSaveForLaterStart = createAction(
  '[saveForLater] delete item from Save For Later',
  props<{ productId: string}>()
);

export const deleteItemFromSaveForLaterSuccess = createAction(
  '[saveForLater] delete item from Save For Later Success',
  props<{ saveForLaterItem: saveForLaterProduct }>()
);

export const deleteItemFromSaveForLaterFailure = createAction(
  '[saveForLater] delete item from Save For Later Failure',
  props<{ error: string }>()
);

////////////////////////////////////////////////////////////////
export const moveToCartFromSaveForLaterStart = createAction(
  '[saveForLater] move from save for later to cart',
  props<{ productId: string}>()
);

export const moveToCartFromSaveForLaterSuccess = createAction(
  '[saveForLater] move from save for later to cart Success',
  props<{ saveForLaterItem: CartItem }>()
);

export const moveToCartFromSaveForLaterFailure = createAction(
  '[saveForLater] move from save for later to cart Failure',
  props<{ error: string }>()
);