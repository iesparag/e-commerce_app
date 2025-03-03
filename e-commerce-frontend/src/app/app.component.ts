import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { loginSuccess, updateUserFromLocalStorageSuccess } from './features/auth/state/auth.actions';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
    title = 'e-commerce';
    showLayout = true;

    constructor(private router: Router, private store: Store) {

        this.router.events.subscribe((res) => {
            const noLayoutRoutes = ['/login', '/signup'];
            this.showLayout = !noLayoutRoutes.includes(this.router.url);
        });
        const accessToken = localStorage.getItem('accessToken');
        if(accessToken){
            this.store.dispatch(updateUserFromLocalStorageSuccess());
        }
    }

}
