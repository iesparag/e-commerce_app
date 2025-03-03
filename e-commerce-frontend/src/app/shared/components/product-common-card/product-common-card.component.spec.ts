import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCommonCardComponent } from './product-common-card.component';

describe('ProductCommonCardComponent', () => {
  let component: ProductCommonCardComponent;
  let fixture: ComponentFixture<ProductCommonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCommonCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCommonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
