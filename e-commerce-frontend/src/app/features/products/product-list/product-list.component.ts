import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadProducts } from '../state/product.actions';
import { selectProducts } from '../state/product.selectors';
import { Product } from '../state/product.state';
import { combineLatest, map, Observable, of } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProductCommonCardComponent } from '../../../shared/components/product-common-card/product-common-card.component';
import { getUserCart } from '../../cart/state/cart.actions';
import { CartItem } from '../../cart/state/cart.state';
import { wishlistProduct } from '../../wishlist/state/wishlist.state';
import { selectAllWishlistItems } from '../../wishlist/state/wishlist.selectors';
import { getUserWishlistStart } from '../../wishlist/state/wishlist.actions';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, AsyncPipe, ProductCommonCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductListComponent implements OnInit {
  activatedRouter = inject(ActivatedRoute);
  store = inject(Store);
  categoryId: string | null = null;
  subcategoryId: string | null = null;
  productList$: Observable<Product[]> = of([]);
  wishlist$: Observable<wishlistProduct[]> = of([]);
  productWithWishlist$: Observable<(Product & { isFavorite: boolean })[]> = of(
    []
  );

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe(
      (elem: any) => {
        
          this.categoryId = elem?.categoryId
          console.log('this.categoryId: ', this.categoryId);
          this.subcategoryId = elem?.subcategoryId
          console.log('this.subcategoryId: ', this.subcategoryId);
        }
    );
    this.onGetUserWishlist();
    this.onGetAllProducts();
    this.wishlist$ = this.store.select(selectAllWishlistItems);
    console.log('this.wishlist$: ', this.wishlist$.subscribe((EL)=> console.log(EL)));

    this.productList$ = this.store.select(selectProducts);
    console.log('this.productList$: ', this.productList$.subscribe((EL)=> console.log(EL)));

    this.productWithWishlist$ = combineLatest([
      this.productList$,
      this.wishlist$,
    ]).pipe(
      map(([products, wishlist]) => {
        // Map wishlist to extract product IDs
        const wishlistProductIds = wishlist.map((item: any) => item.productId); 
        return products.map((product: any) => ({
          ...product,
          isFavorite: wishlistProductIds.includes(product._id), // Compare product ID with wishlist
        }));
      })
    );

  }

  onGetUserWishlist() {
    this.store.dispatch(getUserWishlistStart());
  }

 onGetAllProducts() {
    if (this.categoryId && this.subcategoryId) {
        this.store.dispatch(loadProducts({ categoryId: this.categoryId, subcategoryId: this.subcategoryId }));
    } else if (this.categoryId) {
        this.store.dispatch(loadProducts({ categoryId: this.categoryId }));
    } else if (this.subcategoryId) {
        this.store.dispatch(loadProducts({ subcategoryId: this.subcategoryId }));
    }
}
}
