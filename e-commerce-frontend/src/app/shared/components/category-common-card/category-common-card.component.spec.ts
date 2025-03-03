import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCommonCardComponent } from './category-common-card.component';

describe('CategoryCommonCardComponent', () => {
  let component: CategoryCommonCardComponent;
  let fixture: ComponentFixture<CategoryCommonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCommonCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryCommonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
