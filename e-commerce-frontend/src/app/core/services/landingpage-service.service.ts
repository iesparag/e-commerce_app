import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Constants } from '../constants/constants-app';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/response.interface';
import { Category, ISubCategory } from '../types/category.interface';

@Injectable({
  providedIn: 'root'
})
export class LandingpageServiceService {
 private apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient, private store: Store) { }

  getAllCategories({page=1,limit=100}):Observable<ApiResponse<Category[]>>{
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/${Constants.buyer.CATEGORIES}?page=${page}&limit=${limit}`)
  }

  searchAllSubCategoryForCategory(name:string):Observable<ApiResponse<ISubCategory[]>>{
    return this.http.get<ApiResponse<ISubCategory[]>>(`${this.apiUrl}/${Constants.buyer.SUBCATEGORIES}?name=${name}`)
  }

}
