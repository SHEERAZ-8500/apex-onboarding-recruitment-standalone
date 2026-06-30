import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookingsAcceptance } from './admin-bookings-acceptance';

describe('AdminBookingsAcceptance', () => {
  let component: AdminBookingsAcceptance;
  let fixture: ComponentFixture<AdminBookingsAcceptance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookingsAcceptance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBookingsAcceptance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
