import { createReducer, on } from '@ngrx/store';
import { searchProductsSuccess, searchProductsFailure } from './search.actions';

export interface SearchState {
    results: any[];  // Replace with the actual type of your search results
    error: any;
}

export const initialState: SearchState = {
    results: [],
    error: null,
};

export const searchReducer = createReducer(
    initialState,
    on(searchProductsSuccess, (state, { results }) => ({
        ...state,
        results,
    })),
    on(searchProductsFailure, (state, { error }) => ({
        ...state,
        error,
    }))
);
