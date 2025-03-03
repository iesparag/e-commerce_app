import { createAction, props } from '@ngrx/store';
import { Product } from './product.state';

export const loadProducts = createAction(
  '[Product] Load Products',
  props<{ categoryId?: string | null; subcategoryId?: string | null }>() // Marked as optional
);
export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: string }>()
);





export const fetchOneProductByIdStart = createAction('[Product] Product fetch By Id start',props<{ productId: string | null }>());
export const fetchOneProductByIdStartSuccess = createAction(
  '[Product] Product fetch By Id Success',
  props<{ product: Product }>()
);
export const fetchOneProductByIdStartFailure = createAction(
  '[Product] Product fetch By Id Failure',
  props<{ error: string }>()
);
