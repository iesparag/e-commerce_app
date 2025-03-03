import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { getUserOrdersStart, loadOrdersSuccess, loadOrdersFailure } from './order.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrdersService } from '../../../core/services/orders.service';

@Injectable()
export class OrderEffects {
  actions$ = inject(Actions);
  ordersService = inject(OrdersService);

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserOrdersStart),
      mergeMap(() =>
        this.ordersService.getOrdersService().pipe(
          map((orders) => loadOrdersSuccess({ orders: orders.data })),
          catchError(error => of(loadOrdersFailure({ error: error.message })))
        )
      )
    )
  );
}
