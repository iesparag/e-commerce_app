import { Component, inject, OnInit } from '@angular/core';
import { CarouselComponent } from "../../shared/components/carousel/carousel.component";
import { CategoryCommonCardComponent } from "../../shared/components/category-common-card/category-common-card.component";
import { Store } from '@ngrx/store';
import { loadCategories } from './state/landing-page.actions';
import { Category } from '../../core/types/category.interface';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { selectCategories, selectCategoryError } from './state/landing-page.selectors';

@Component({
  selector: 'app-landing-page',
  imports: [CarouselComponent, CategoryCommonCardComponent,AsyncPipe],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  categories$: Observable<Category[]> = of([]); // Default empty observable
  error$: Observable<string | null> = of(null);  // Default to null
  store = inject(Store);
  images: string[] = [
    "https://m.media-amazon.com/images/I/51pM-W6VhZL.jpg",
    "https://m.media-amazon.com/images/I/61fFZboVzsL.jpg",
    "https://m.media-amazon.com/images/I/610i0JvOhHL.jpg",
    "https://m.media-amazon.com/images/I/61dav-O2zPL.jpg",
    "https://m.media-amazon.com/images/I/51a38gE2jrL.jpg",
    "https://m.media-amazon.com/images/I/61gEAVVloJL.jpg",
    "https://m.media-amazon.com/images/I/61BY9H1ltgL.jpg",
  ];
  
  ngOnInit(): void {
    this.onLoadCategories();
    this.categories$ = this.store.select(selectCategories);
    this.error$ = this.store.select(selectCategoryError);
  }

  onLoadCategories() {
    this.store.dispatch(loadCategories());
  }
}
