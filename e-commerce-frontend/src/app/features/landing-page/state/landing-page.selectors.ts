import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from './landing-page.state'; // Adjust path based on your structure

// Create a feature selector for the 'categories' feature state
const selectCategoryState = createFeatureSelector<CategoryState>('landingPage');

// Selector to get the list of categories
export const selectCategories = createSelector(
  selectCategoryState,
  (state) => {
    return state.categories;
  }
);

// Selector to get any potential errors
export const selectCategoryError = createSelector(
  selectCategoryState,
  (state) => state.error
);
