import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Constants } from '../constants/constants-app';
import { ApiResponse } from '../types/response.interface';
import { Product } from '../../features/products/state/product.state';

@Injectable({
    providedIn: 'root',
})
export class SearchService {
    private apiUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) {}

    searchProducts(query: string): Observable<ApiResponse<Product[]>> { // Replace `any[]` with the actual result type
        return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/${Constants.buyer.PRODUCTSEARCH}?query=${query}`);
    }
}
