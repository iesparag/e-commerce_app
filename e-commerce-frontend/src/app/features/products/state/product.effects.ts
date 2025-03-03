import { inject, Injectable } from '@angular/core';
import {  ofType, createEffect, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import * as productActions from "./product.actions";
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { loadProducts, loadProductsSuccess, loadProductsFailure } from './product.actions';
import { ProductService } from '../../../core/services/product.service';

@Injectable()
export class ProductEffects {
  actions$ = inject(Actions)
  productService = inject(ProductService)

 loadProducts$ = createEffect(() => {
  return this.actions$.pipe(
    ofType(loadProducts),
    switchMap(({ categoryId, subcategoryId }) => {
      const params: any = {};

      if (categoryId) {
        params.categoryId = categoryId; 
      }

      if (subcategoryId) {
        params.subcategoryId = subcategoryId; 
      }
      return this.productService.getProducts(params).pipe(
        map((products) => ({
          type: '[Product] Load Products Success',
          products: products.data,
        })),
        catchError((error) =>
          of({
            type: '[Product] Load Products Failure',
            error,
          })
        )
      );
    })
  );
});




  LoadOneProduct$ = createEffect(() =>{
    return this.actions$.pipe(
      ofType(productActions.fetchOneProductByIdStart),
      mergeMap(({productId}) =>{
      return  this.productService.getOneProduct(productId).pipe(
          map((response) =>
            productActions.fetchOneProductByIdStartSuccess({ product : response.data  })
          ),
          catchError((error) =>
            of(productActions.fetchOneProductByIdStartFailure({ error: error.message }))
          )
        )}
      )
    )}
  )

}
