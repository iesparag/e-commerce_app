import { createAction, props } from '@ngrx/store';
import { Product } from './search.state';

export const searchProducts = createAction(
    '[Search] Search Products',
    props<{ query: string }>()
);

export const searchProductsSuccess = createAction(
    '[Search] Search Products Success',
    props<{ results: Product[] }>()  // Replace with actual result type
);

export const searchProductsFailure = createAction(
    '[Search] Search Products Failure',
    props<{ error: any }>()
);
