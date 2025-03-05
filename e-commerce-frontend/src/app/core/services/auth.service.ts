import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import {
    catchError,
    map,
    tap,
    switchMap,
    filter,
    finalize,
    take,
} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Constants } from '../constants/constants-app';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../../features/auth/state/auth.selectors';
import {
    AddressPayload,
    AddressResponse,
    AuthState,
} from '../../features/auth/state/auth.state';
import { ApiResponse } from '../types/response.interface';
import { Router } from '@angular/router';
import { refreshTokenSuccess } from '../../features/auth/state/auth.actions';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    router = inject(Router);
    private apiUrl = environment.apiBaseUrl; // API base URL
    private isRefreshing = false; // To prevent multiple refresh calls
    private refreshTokenSubject: BehaviorSubject<any | null> =
        new BehaviorSubject<any | null>(null);

    constructor(private http: HttpClient, private store: Store<AuthState>) {}

    // 🟢 **Login Method**
    login(credentials: { email: string; password: string }): Observable<any> {
        return this.http
            .post(`${this.apiUrl}/${Constants.users.USER_LOGIN}`, credentials)
            .pipe(
                tap((response: any) => {
                    this.saveTokens(
                        response.data.accessToken,
                        response.data.refreshToken
                    );
                    this.saveUser(response.data.user);
                })
            );
    }

    // 🟢 **Signup Method**
    signup(user: any): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/${Constants.users.USER_REGISTER}`,
            user
        );
    }

    // 🟢 **Logout Method**
    logout(): Observable<any> {
        return this.http
            .post(`${this.apiUrl}/${Constants.users.USER_LOGOUT}`, {})
            .pipe(
                tap(() => {
                    this.clearTokens();
                })
            );
    }

    // 🟢 **Check if user is authenticated**
    isAuthenticated(): Observable<boolean> {
        return this.store.select(selectAccessToken).pipe(
            map((accessToken: any) => !!accessToken) // Check if access token exists
        );
    }

    // 🟢 **Get access token**
    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    // 🟢 **Refresh Access Token**
    refreshAccessToken(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            console.error('❌ No refresh token found, logging out...');
            this.isRefreshing = false;
            this.clearTokens();
            this.navigateToLogin();
            return throwError(() => new Error('No refresh token available'));
        }

        console.log('📢 Making API call to refresh token...');

        return this.http
            .post(
                `${this.apiUrl}/${Constants.users.USER_GENERATE_ACCESS_BY_REFRESH}`,
                { refreshToken }
            )
            .pipe(
                tap((response: any) => {
                    console.log('✅ Raw Token Response:', response);

                    if (
                        !response?.data?.accessToken ||
                        !response?.data?.refreshToken
                    ) {
                        console.error(
                            '❌ Tokens are missing or response format is incorrect!',
                            response
                        );
                        this.isRefreshing = false;
                        return;
                    }

                    console.log('✅ Extracted New Tokens:', response.data);

                    this.saveTokens(
                        response.data.accessToken,
                        response.data.refreshToken
                    ); this.refreshTokenSubject.next(response);
                    this.store.dispatch(
                        refreshTokenSuccess({
                            accessToken: response.data.accessToken,
                            refreshToken: response.data.refreshToken,
                        })
                    );
                }),
                catchError((error) => {
                    console.error('❌ Token refresh failed:', error);
                    this.clearTokens();
                    this.navigateToLogin();
                    return throwError(() => error);
                }),
                finalize(() => {
                    console.log('🔄 Resetting isRefreshing flag');
                    this.isRefreshing = false;
                })
            );
    }

    // 🟢 **Helper methods for token management**
    public saveTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    public saveUser(user: any): void {
        localStorage.setItem('user', JSON.stringify(user));
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
        this.router.navigate(['/login']); // Redirect to login
    }

    // 🟢 **Save User Address**
    saveUserAddressInService(
        address: AddressPayload
    ): Observable<ApiResponse<AddressResponse>> {
        return this.http.post<ApiResponse<AddressResponse>>(
            `${this.apiUrl}/user-address/add`,
            address
        );
    }

    // 🟢 **Fetch All User Addresses**
    fetchUserAllAddressInService(): Observable<ApiResponse<AddressResponse[]>> {
        return this.http.get<ApiResponse<AddressResponse[]>>(
            `${this.apiUrl}/user-address`
        );
    }
}
