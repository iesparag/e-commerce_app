import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCategoryPageComponent } from './custom-category-page.component';

describe('CustomCategoryPageComponent', () => {
  let component: CustomCategoryPageComponent;
  let fixture: ComponentFixture<CustomCategoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCategoryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomCategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
