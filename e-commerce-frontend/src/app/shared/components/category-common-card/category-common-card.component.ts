import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Category } from '../../../core/types/category.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-common-card',
  imports: [CommonModule],
  templateUrl: './category-common-card.component.html',
  styleUrl: './category-common-card.component.scss'
})
export class CategoryCommonCardComponent {
  @Input() categories: Category[] = []; // Accept the categories array
  @Input() columns: number = 4;


  constructor(private router: Router){
    console.log('this.categories: ', this.categories);
  }

  onCategoryClick(category: Category) {
    this.router.navigate(['/products'], { queryParams: { categoryId: category._id } });
  }
}
