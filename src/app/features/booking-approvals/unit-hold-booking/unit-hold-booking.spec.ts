import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitHoldBooking } from './unit-hold-booking';

describe('UnitHoldBooking', () => {
  let component: UnitHoldBooking;
  let fixture: ComponentFixture<UnitHoldBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitHoldBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitHoldBooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
