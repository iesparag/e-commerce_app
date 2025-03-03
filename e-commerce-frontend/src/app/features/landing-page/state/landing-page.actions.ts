import { createAction, props } from '@ngrx/store';
import { Category } from '../../../core/types/category.interface';
import { ApiResponse } from '../../../core/types/response.interface';

export const loadCategories = createAction('[Categories] Load Categories');

export const loadCategoriesSuccess = createAction(
  '[Categories] Load Categories Success',
  props<{ response: ApiResponse<Category[]> }>()
);

export const loadCategoriesFailure = createAction(
  '[Categories] Load Categories Failure',
  props<{ error: string }>()
);
