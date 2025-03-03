import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProductState } from './product.state';

export const selectProductState = createFeatureSelector<ProductState>('productPage');

export const selectProducts = createSelector(
  selectProductState,
  (state) => {
   return state.products
  }
);

export const selectLoading = createSelector(
  selectProductState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectProductState,
  (state) => state.error
);

export const selectSelectedProduct = createSelector(
  selectProductState,
  (state) => state.selectedProduct
);