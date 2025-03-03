import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCommonCardComponent } from './cart-common-card.component';

describe('CartCommonCardComponent', () => {
  let component: CartCommonCardComponent;
  let fixture: ComponentFixture<CartCommonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartCommonCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartCommonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
