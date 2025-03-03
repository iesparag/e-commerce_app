import { createReducer, on } from '@ngrx/store';
import { initialState } from './order.state';
import * as orderActions from "./order.actions";

export const orderReducer = createReducer(
  initialState,
  on(orderActions.getUserOrdersStart, state => ({ ...state, loading: true, error: null })),
  on(orderActions.loadOrdersSuccess, (state, { orders }) => ({ ...state, loading: false, orders })),
  on(orderActions.loadOrdersFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
