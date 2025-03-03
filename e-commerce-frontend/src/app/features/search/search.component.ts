import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { searchProducts } from './state/search.actions';
import { selectSearchResults } from './state/search.selectors';
import { ProductCommonCardComponent } from "../../shared/components/product-common-card/product-common-card.component";

@Component({
    selector: 'app-search',
    imports: [CommonModule, ProductCommonCardComponent,AsyncPipe],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    store = inject(Store);
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);
    searchQuery: string = '';
    searchResults$: Observable<any[]> = this.store.select(selectSearchResults);

    private searchQuerySubject = new Subject<string>(); 

    ngOnInit(): void {
      this.searchResults$.subscribe((res) => console.log(res,"PARAG JAIN"));
        this.searchQuerySubject.pipe(
            debounceTime(1000), 
            distinctUntilChanged(),  
            switchMap(query => {
                this.store.dispatch(searchProducts({ query }));
                return of(null); 
            })
        ).subscribe();
        this.activatedRoute.queryParams.subscribe(params => {
            this.searchQuery = params['query'] || '';
            if (this.searchQuery) {
                this.searchQuerySubject.next(this.searchQuery);  
            }
        });
    }

    onSearchChange(): void {
        this.searchQuerySubject.next(this.searchQuery);
    }
}
