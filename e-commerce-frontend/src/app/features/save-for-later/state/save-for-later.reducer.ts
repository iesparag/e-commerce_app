import { createReducer, on } from '@ngrx/store';
import { initialSaveForLaterState } from './save-for-later.state';
import * as SaveForLaterActions from './save-for-later.actions';

export const saveForLaterReducer = createReducer(
    initialSaveForLaterState,
    on(SaveForLaterActions.getUserSaveForLaterStart, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),

    // Get user cart: success
    on(
        SaveForLaterActions.getUserSaveForLaterSuccess,
        (state, { response }) => {
            console.log('response: ', response);
            return {
                ...state,
                isLoading: false,
                saveForLaterItems: response.success
                    ? response.data
                    : state.saveForLaterItems,
                error: response.success ? null : response.message,
            };
        }
    ),
    on(SaveForLaterActions.getUserSaveForLaterFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
    })),

    on(SaveForLaterActions.addItemToTheSaveForLaterStart, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),

    // Get user cart: success
    on(
        SaveForLaterActions.addItemToTheSaveForLaterSuccess,
        (state, { saveForLaterItem }) => {
            const itemExists = state.saveForLaterItems.some(
                (item) => item.productId === saveForLaterItem.productId
            );
            const updatedItems = itemExists
                ? state.saveForLaterItems
                : [...state.saveForLaterItems, saveForLaterItem];

            return {
                ...state,
                isLoading: false,
                saveForLaterItems: updatedItems,
            };
        }
    ),
    on(
        SaveForLaterActions.addItemToTheSaveForLaterFailure,
        (state, { error }) => ({
            ...state,
            isLoading: false,
            error,
        })
    ),

    on(SaveForLaterActions.deleteItemFromSaveForLaterStart, (state) => ({
        ...state,
        isLoading: true,
        error: null,
    })),
    on(
        SaveForLaterActions.deleteItemFromSaveForLaterSuccess,
        (state, { saveForLaterItem }) => {
            const updatedItems = state.saveForLaterItems.filter(
                (item) => item.productId !== saveForLaterItem.productId
            );
            return {
                ...state,
                isLoading: false,
                saveForLaterItems: updatedItems,
            };
        }
    ),
    on(
        SaveForLaterActions.deleteItemFromSaveForLaterFailure,
        (state, { error }) => ({
            ...state,
            isLoading: false,
            error,
        })
    ),


    on(SaveForLaterActions.moveToCartFromSaveForLaterStart, (state) => ({
        ...state,
        isLoading: true,
        error: null,
      })),
    
      on(SaveForLaterActions.moveToCartFromSaveForLaterSuccess, (state, { saveForLaterItem }) => {
        const updatedItems = state.saveForLaterItems.filter(
          (item) => item.productId !== saveForLaterItem.product.productId
        );
        return {
          ...state,
          isLoading: false,
          saveForLaterItems: updatedItems,
        };
      }),
    
      on(SaveForLaterActions.moveToCartFromSaveForLaterFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
      })),
);
