import { Component, inject, Input } from '@angular/core';
import { CartItem } from '../../../features/cart/state/cart.state';
import { Store } from '@ngrx/store';
import { deleteItemFromCartStart, moveToSaveForLaterItemFromCartStart, moveToWishlistFromCartStart, updateProductQuantity } from '../../../features/cart/state/cart.actions';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart-common-card',
  imports: [CommonModule,MatIconModule],
  templateUrl: './cart-common-card.component.html',
  styleUrl: './cart-common-card.component.scss'
})
export class CartCommonCardComponent {
  store = inject(Store)
  @Input() cartItem!: CartItem;

  increaseQuantity() {
    console.log(this.cartItem)
    const updatedCartItem = {
      ...this.cartItem, 
      quantity: this.cartItem.quantity + 1, // Update the quantity
    };
  
    this.store.dispatch(
      updateProductQuantity({
        productId: this.cartItem.product.productId, // Ensure this matches your state
        quantity: updatedCartItem.quantity,
      })
    );
  }
  
  decreaseQuantity() {
    if (this.cartItem.quantity > 1) {
      const updatedCartItem = {
        ...this.cartItem, // Clone the cartItem
        quantity: this.cartItem.quantity - 1, // Decrease the quantity
      };
  
      this.store.dispatch(
        updateProductQuantity({
          productId: this.cartItem.product.productId,
          quantity: updatedCartItem.quantity,
        })
      );
    }
  }

  deleteItemFromCart(){
    this.store.dispatch(deleteItemFromCartStart({productId:this.cartItem.product.productId}))

  }

  moveToFavFromCart(){
    this.store.dispatch(moveToWishlistFromCartStart({productId:this.cartItem.product.productId}))
  }



  moveToSaveForLater(){
    this.store.dispatch(moveToSaveForLaterItemFromCartStart({productId:this.cartItem.product.productId}))
  }
  
}
