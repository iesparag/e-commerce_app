import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.interface';
import { wishlistProduct } from '../../features/wishlist/state/wishlist.state';
import { Constants } from '../constants/constants-app';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

 
    private apiUrl = environment.apiBaseUrl;
     constructor(private http: HttpClient) {}
 
   moveToWishlistFromCart(
     productId: string
   ): Observable<ApiResponse<wishlistProduct>> {
     return this.http.post<ApiResponse<wishlistProduct>>(
       `${this.apiUrl}/${Constants.buyer.CART}/${productId}`,{}
     );
   }

   removeItemFromWishlist(
     productId: string
   ): Observable<ApiResponse<wishlistProduct>> {
     return this.http.delete<ApiResponse<wishlistProduct>>(
       `${this.apiUrl}/${Constants.buyer.WISHLIST}/${productId}`,{}
     );
   }

   addItemToTheWishlist(
     productId: string
   ): Observable<ApiResponse<wishlistProduct>> {
     return this.http.post<ApiResponse<wishlistProduct>>(
       `${this.apiUrl}/${Constants.buyer.WISHLIST}`,{productId}
     );
   }


    getUserWishlistService(): Observable<ApiResponse<wishlistProduct[]>> {
       const data =  this.http.get<ApiResponse<wishlistProduct[]>>(
         `${this.apiUrl}/${Constants.buyer.WISHLIST}`
       );
       return data
     }
}
