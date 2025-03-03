import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Product } from '../../../features/products/state/product.state';
import { CommonModule } from '@angular/common';
import SwiperCore from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Store } from '@ngrx/store';
import {
  addToCart,
  updateProductQuantity,
} from '../../../features/cart/state/cart.actions';
import { selectUser } from '../../../features/auth/state/auth.selectors';
import { Observable, of } from 'rxjs';
import { AuthState } from '../../../features/auth/state/auth.state';
import { MatIconModule } from '@angular/material/icon';
import {  addItemTotheWishlistStart, removeItemFromWishlistStart } from '../../../features/wishlist/state/wishlist.actions';
import { Router } from '@angular/router';

// Install Swiper modules
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-product-common-card',
  imports: [CommonModule,MatIconModule],
  templateUrl: './product-common-card.component.html',
  styleUrls: ['./product-common-card.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductCommonCardComponent {
  @Input() product!: Product;
  router = inject(Router)
  store = inject(Store);

  quantity: number = 1;

  galleryConfig = {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
  };



  // Toggle Favorite
  toggleFavorite() {
  if (this.product.isFavorite) {
    // If true, dispatch action to remove the item from wishlist
    this.store.dispatch(removeItemFromWishlistStart({ productId: this.product._id }));
  } else {
    // If false, dispatch action to add the item to wishlist
    this.store.dispatch(addItemTotheWishlistStart({ productId: this.product._id }));
  }
  }

  // Add to Cart
  addToCart() {
    this.store.dispatch(
      addToCart({ productId: this.product._id, quantity: this.quantity })
    );
  }


  goToProductDetail(){
    this.router.navigate(['/products', this.product._id]);
  }

}
