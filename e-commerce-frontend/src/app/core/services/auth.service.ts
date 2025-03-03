import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, switchMap, filter, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Constants } from '../constants/constants-app';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../../features/auth/state/auth.selectors';
import { AddressPayload, AddressResponse, AuthState } from '../../features/auth/state/auth.state';
import { ApiResponse } from '../types/response.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router)
  private apiUrl = environment.apiBaseUrl; // Replace with your API URL
  private isRefreshing = false; // To avoid multiple refresh calls
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private store: Store<AuthState>) {}

  // Login method
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${Constants.users.USER_LOGIN}`, credentials).pipe(
      tap((response: any) => {
        this.saveTokens(response.data.accessToken, response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      })
    );
  }

  // Signup method
  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${Constants.users.USER_REGISTER}`, user);
  }

  // Logout method
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/${Constants.users.USER_LOGOUT}`, {}).pipe(
      tap(() => {
        this.clearTokens();
      })
    );
  }

  // Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.store.select(selectAccessToken).pipe(
      map((accessToken: any) => !!accessToken) // Check if access token exists
    );
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Refresh token logic
  refreshAccessToken(): Observable<any> {
  if (this.isRefreshing) {
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null), 
      switchMap(() => this.refreshTokenSubject.asObservable())
    );
  } else {
    this.isRefreshing = true;
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.isRefreshing = false;
      this.clearTokens();
      this.navigateToLogin();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post(`${this.apiUrl}/${Constants.users.USER_GENERATE_ACCESS_BY_REFRESH}`, {
      refreshToken,
    }).pipe(
      tap((response: any) => {
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;
        this.saveTokens(newAccessToken, newRefreshToken);
        this.refreshTokenSubject.next(newAccessToken); // Emit new access token
      }),
      catchError((error) => {
        this.clearTokens(); // Clear invalid tokens
        this.navigateToLogin(); // Redirect user to login page on error
        return throwError(() => error);
      }),
      finalize(() => {
        this.isRefreshing = false; // Reset the flag after refreshing is complete
      })
    );
  }
}


  // Helper methods for token management
  public saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  public clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  navigateToLogin(): void {
    // Replace with your router logic to navigate to the login page
    this.router.navigate(['/login']); // Example: Redirect to login
  }

    // Login method
  saveUserAddressInService(
    address: AddressPayload
  ): Observable<ApiResponse<AddressResponse>> {
    return this.http.post<ApiResponse<AddressResponse>>(
      `${this.apiUrl}/user-address/add`,
      address
    );
  }


  fetchUserAllAddressInService(): Observable<ApiResponse<AddressResponse[]>> {
    return this.http.get<ApiResponse<AddressResponse[]>>(
      `${this.apiUrl}/user-address`,
    );
  }
}
