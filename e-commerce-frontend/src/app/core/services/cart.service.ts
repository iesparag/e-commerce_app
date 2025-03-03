import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.interface';
import { CartItem } from '../../features/cart/state/cart.state';
import { Constants } from '../constants/constants-app';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  // Add item to cart
  addItemToCart(
    productId: string,
    quantity: number
  ): Observable<ApiResponse<CartItem>> {
    return this.http.post<ApiResponse<CartItem>>(
      `${this.apiUrl}/${Constants.buyer.CART}`,
      { productId, quantity }
    );
  }

  updateProductQuantity(
    productId: string,
    quantity: number
  ): Observable<ApiResponse<CartItem>> {
    return this.http.patch<ApiResponse<CartItem>>(
      `${this.apiUrl}/${Constants.buyer.CART}`,
      { productId, quantity }
    );
  }

  deleteItemFromCart(
    productId: string
  ): Observable<ApiResponse<CartItem>> {
    return this.http.delete<ApiResponse<CartItem>>(
      `${this.apiUrl}/${Constants.buyer.CART}/${productId}`
    );
  }


  moveToSaveForLaterFromCart(
    productId: string
  ): Observable<ApiResponse<CartItem>> {
    return this.http.patch<ApiResponse<CartItem>>(
      `${this.apiUrl}/${Constants.buyer.CART}/${Constants.buyer.moveItemFromCartToSaveForLater}/${productId}`,{}
    );
  }

  
  moveToWishlistFromCart(
    productId: string
  ): Observable<ApiResponse<CartItem>> {
    console.log('productId: ', productId);
    const data =  this.http.post<ApiResponse<CartItem>>(
      `${this.apiUrl}/${Constants.buyer.CART}/${productId}`,{}
    );
    console.log('data: ', data);
    return data;
  }

  moveFromWishlistToCartService(
    productId: string
  ): Observable<ApiResponse<CartItem>> {
    return this.http.post<ApiResponse<CartItem>>(
      `${this.apiUrl}/${Constants.buyer.WISHLIST}/${Constants.buyer.CART_TO_CART}`,{productId}
    );
  }

  getUserCartService(): Observable<ApiResponse<CartItem[]>> {
    return this.http.get<ApiResponse<CartItem[]>>(
      `${this.apiUrl}/${Constants.buyer.CART}`
    );
  }
}
