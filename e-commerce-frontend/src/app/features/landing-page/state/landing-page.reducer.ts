// src/app/features/categories/state/category.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { loadCategoriesFailure, loadCategoriesSuccess } from './landing-page.actions';
import { CategoryState } from './landing-page.state';



export const initialState: CategoryState = {
  categories: [],
  error: null,
};

export const landingPageReducer = createReducer(
  initialState,
  on(loadCategoriesSuccess, (state, { response }) => ({
    ...state,
    categories: response.data,
  })),
  on(loadCategoriesFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
