import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
    selectIsAuthenticated,
    selectUser,
} from '../../../features/auth/state/auth.selectors';
import { logout } from '../../../features/auth/state/auth.actions';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthState } from '../../../features/auth/state/auth.state';
import { selectCartTotalQuantity } from '../../../features/cart/state/cart.selectors';
import { getUserCart } from '../../../features/cart/state/cart.actions';
import { getUserWishlistStart } from '../../../features/wishlist/state/wishlist.actions';
import { selectWishlistTotalQuantity } from '../../../features/wishlist/state/wishlist.selectors';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../features/search/state/search.state';
import { searchProducts } from '../../../features/search/state/search.actions';
import { selectSearchResults } from '../../../features/search/state/search.selectors';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        MatIconModule,
        RouterLink,
        FormsModule,
        CommonModule,
        MatMenuModule,
        MatButtonModule,
    ],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    isMobileMenuOpen: boolean = false;
    store = inject(Store);
    router = inject(Router);
    user$: Observable<AuthState['user']>;
    isAuthenticated$: Observable<boolean>;
    searchResults$: Observable<Product[]> = this.store.select(selectSearchResults);
    defaultAvatar =
        'https://avatars.githubusercontent.com/u/103980322?v=4&size=64';
    searchQuery: string = '';
    cartItemCount: number = 0;
    wishlistItemCount: number = 0;

    constructor() {
        // Subscribe to isAuthenticated selector
        this.user$ = this.store.select(selectUser);
        this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
        console.log(this.searchResults$,"searchResults$")
    }

     toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    closeMobileMenu(){
        this.isMobileMenuOpen = false
    }

    ngOnInit(): void {
        this.store.dispatch(getUserCart());
        this.store.dispatch(getUserWishlistStart());
        this.store
            .select(selectCartTotalQuantity)
            .subscribe((res) => (this.cartItemCount = res));
        this.store
            .select(selectWishlistTotalQuantity)
            .subscribe((res) => (this.wishlistItemCount = res));

            
    }

    onLogout(): void {
        this.store.dispatch(logout());
    }
    onOrder() {
        this.router.navigate(['/orders']);
    }

    onSearchChange(): void {
        if (this.searchQuery.length > 0) {
            this.store.dispatch(searchProducts({ query: this.searchQuery }));
        } else {
            this.searchResults$ = of([]);
        }
    }

    goToSearchResult(id: string): void {
       this.router.navigate([`/products/${id}`])
    }

    clearSearch() {
        this.searchQuery = '';
        this.searchResults$ = of([]);
    }
}
