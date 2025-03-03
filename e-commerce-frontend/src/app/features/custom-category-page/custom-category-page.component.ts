import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap, of, catchError } from 'rxjs';
import { LandingpageServiceService } from '../../core/services/landingpage-service.service';
import { ISubCategory } from '../../core/types/category.interface';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-custom-category-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './custom-category-page.component.html',
    styleUrls: ['./custom-category-page.component.scss'],
})
export class CustomCategoryPageComponent implements OnInit, OnDestroy {
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    landingPageService = inject(LandingpageServiceService);

    categoryName: string | null = null;
    subCategoryData: ISubCategory[] = [];
    isLoading: boolean = false;
    error: string | null = null;

    private sub!: Subscription;

    ngOnInit(): void {
        this.sub = this.activatedRoute.paramMap
            .pipe(
                switchMap((params) => {
                    this.isLoading = true;
                    this.error = null;
                    this.categoryName = params.get('category');
                    console.log('Category changed:', this.categoryName);

                    if (!this.categoryName) {
                        return of({ data: [] });
                    }

                    return this.landingPageService
                        .searchAllSubCategoryForCategory(this.categoryName)
                        .pipe(
                            catchError((error) => {
                                this.error = 'Failed to fetch subcategories. Please try again.';
                                console.error('Error fetching subcategories:', error);
                                return of({ data: [] });
                            })
                        );
                })
            )
            .subscribe({
                next: (response) => {
                    this.subCategoryData = response.data || [];
                    console.log('Subcategories fetched:', this.subCategoryData);
                    this.isLoading = false;
                },
                error: (error) => {
                    this.error = 'An unexpected error occurred.';
                    this.isLoading = false;
                    console.error('Subscription error:', error);
                }
            });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    NavigateToProducts(SubcategoryObj: ISubCategory) {
    this.router.navigate(['/products'], { 
        queryParams: { 
            categoryId: SubcategoryObj.categoryId, 
            subcategoryId: SubcategoryObj._id 
        } 
    });
}
}