import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants/constants-app';
import { saveForLaterProduct } from '../../features/save-for-later/state/save-for-later.state';
import { CartItem } from '../../features/cart/state/cart.state';

@Injectable({
    providedIn: 'root',
})
export class SaveForLaterService {
    private apiUrl = environment.apiBaseUrl;
    constructor(private http: HttpClient) {}

    getUserSaveForLaterItems(): Observable<ApiResponse<saveForLaterProduct[]>> {
        return this.http.get<ApiResponse<saveForLaterProduct[]>>(
            `${this.apiUrl}/${Constants.buyer.CART}/${Constants.buyer.GETSAVEFORLATER}`,
            {}
        );
    }

    deleteItemFromSaveForLater(productId:string): Observable<ApiResponse<saveForLaterProduct>> {
        return this.http.delete<ApiResponse<saveForLaterProduct>>(
            `${this.apiUrl}/${Constants.buyer.CART}/${Constants.buyer.GETSAVEFORLATER}/${productId}`,
            {}
        );
    }


    moveProductToCartFromSaveforLater(productId:string): Observable<ApiResponse<CartItem>> {
        return this.http.patch<ApiResponse<CartItem>>(
            `${this.apiUrl}/${Constants.buyer.CART}/${Constants.buyer.moveItemFromSaveForLaterToCart}/${productId}`,
            {}
        );
    }
}
