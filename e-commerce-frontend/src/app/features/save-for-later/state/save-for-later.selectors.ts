import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SaveForLaterState } from './save-for-later.state';

// Select the entire cart state
export const selectSaveForLaterState = createFeatureSelector<SaveForLaterState>('saveForLater');

// Select all cart items
export const selectAllSaveForLaterItems = createSelector(
  selectSaveForLaterState,
  (state) => state.saveForLaterItems
);

// Select cart loading state
export const selectSaveForLaterLoading = createSelector(
  selectSaveForLaterState,
  (state) => state.isLoading
);

// Select cart error
export const selectSaveForLaterError = createSelector(
  selectSaveForLaterState,
  (state) => state.error
);



