import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { wishlistProduct } from './state/wishlist.state';
import { getUserWishlistStart, removeItemFromWishlistStart } from './state/wishlist.actions';
import { selectAllWishlistItems } from './state/wishlist.selectors';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { moveFromWishlistToCartStart } from '../cart/state/cart.actions';
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

@Component({
  selector: 'app-wishlist',
  standalone: true, // Ensures standalone usage
  imports: [CommonModule, MatButtonModule, MatTableModule, AsyncPipe, MatIconModule, EmptyStateComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'], // Fixed `styleUrls`
})
export class WishlistComponent implements OnInit {
  // Columns displayed in the table
  displayedColumns: string[] = ['images', 'name', 'description', 'price', 'actions'];
  // Store and observable for the wishlist data
  store = inject(Store);
  wishlistList$: Observable<wishlistProduct[]> = of([]);

  ngOnInit(): void {
    this.store.dispatch(getUserWishlistStart());
    this.wishlistList$ = this.store.select(selectAllWishlistItems);
  }


  moveToCart(product: wishlistProduct): void {
    this.store.dispatch(moveFromWishlistToCartStart({productId:product.productId}))
   
  }

  deleteFromWishlist(product: wishlistProduct): void {
    this.store.dispatch(removeItemFromWishlistStart({productId:product.productId}))
  }
}
