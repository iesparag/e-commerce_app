import { createAction, props } from '@ngrx/store';
import { Order } from './order.state';

export const getUserOrdersStart = createAction('[Order] Load Orders');
export const loadOrdersSuccess = createAction('[Order] Load Orders Success', props<{ orders: Order[] }>());
export const loadOrdersFailure = createAction('[Order] Load Orders Failure', props<{ error: string }>());
