import { createReducer, on } from '@ngrx/store';
import { loadProducts, loadProductsSuccess, loadProductsFailure } from './product.actions';
import { initialState, ProductState } from './product.state';
import * as productActions from "./product.actions";

export const productReducer = createReducer(
  initialState,
  on(loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadProductsSuccess, (state, { products }) => {
    return ({
    ...state,
    loading: false,
    products
  })}),
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),


  on(productActions.fetchOneProductByIdStart, (state) => ({
    ...state,
    loading: true,
    error: null,
    selectedProduct: null,
  })),
  on(productActions.fetchOneProductByIdStartSuccess, (state, { product }) => {
    return ({
    ...state,
    loading: false,
    selectedProduct: product
  })}),
  on(productActions.fetchOneProductByIdStartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    selectedProduct: null
  }))
);
