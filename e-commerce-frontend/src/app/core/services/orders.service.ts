import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../features/orders/state/order.state';
import { environment } from '../../../environments/environment';
import { Constants } from '../constants/constants-app';
import { ApiResponse } from '../types/response.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getOrdersService(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}/${Constants.buyer.ORDERS}`);
  }

  getOrderDetail(orderDetailId:string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.apiUrl}/${Constants.buyer.ORDERS}/${orderDetailId}`);
  }
}
