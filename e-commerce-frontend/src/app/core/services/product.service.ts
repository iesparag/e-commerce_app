import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { Constants } from '../constants/constants-app';
import { Observable } from 'rxjs';
import { Product } from '../../features/products/state/product.state';
import { ApiResponse } from '../types/response.interface';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private apiUrl = environment.apiBaseUrl;
    constructor(private http: HttpClient, private store: Store) {}

    getProducts(params: {
        categoryId?: string | null;
        subcategoryId?: string | null;
    }): Observable<ApiResponse<Product[]>> {
        let httpParams = new HttpParams();
        if (params.categoryId) {
            httpParams = httpParams.set('categoryId', params.categoryId);
        }
        if (params.subcategoryId) {
            httpParams = httpParams.set('subcategoryId', params.subcategoryId);
        }
        return this.http.get<ApiResponse<Product[]>>(
            `${this.apiUrl}/${Constants.buyer.PRODUCTS}`,
            { params: httpParams }
        );
    }

    getOneProduct(productId: string | null): Observable<ApiResponse<Product>> {
        return this.http.get<ApiResponse<Product>>(
            `${this.apiUrl}/${Constants.buyer.PRODUCTS}/${productId}`
        );
    }
}
