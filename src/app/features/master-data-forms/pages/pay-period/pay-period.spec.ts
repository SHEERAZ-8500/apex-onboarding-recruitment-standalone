import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPeriod } from './pay-period';

describe('PayPeriod', () => {
  let component: PayPeriod;
  let fixture: ComponentFixture<PayPeriod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayPeriod]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayPeriod);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
