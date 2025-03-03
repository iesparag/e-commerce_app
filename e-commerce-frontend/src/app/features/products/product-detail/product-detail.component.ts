import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { fetchOneProductByIdStart } from '../state/product.actions';
import { selectSelectedProduct } from '../state/product.selectors';
import { Product } from '../state/product.state';
import { addToCart } from '../../cart/state/cart.actions';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  activatedRouter = inject(ActivatedRoute);
  store = inject(Store);
  location = inject(Location)

  productId: string | null = '';
  sizes = ['1.5 kg', '1 kg', '500 gr', '250 gr'];
  selectedSize = this.sizes[0];
  quantity = 1;

  projectObj: Product | null = null;
  selectedImage: string | null = null;

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.productId = params['id'];
      this.onLoadProduct();
    });

    this.store.select(selectSelectedProduct).subscribe((product) => {
      this.projectObj = product;
      this.selectedImage = product?.images?.[0] || null; // Set the default main image
    });
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }


  onLoadProduct() {
    if (this.productId) {
      this.store.dispatch(fetchOneProductByIdStart({ productId: this.productId }));
    }
  }

  changeImage(image: string) {
    this.selectedImage = image;
  }


  backToPreviousRoute(){
     this.location.back()
  }

  addToCart() {
      if (this.projectObj) {
        this.store.dispatch(
          addToCart({ productId: this.projectObj._id, quantity: this.quantity })
        );
      }
    }
}
