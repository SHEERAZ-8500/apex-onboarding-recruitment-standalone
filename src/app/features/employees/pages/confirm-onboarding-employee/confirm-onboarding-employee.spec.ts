import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOnboardingEmployee } from './confirm-onboarding-employee';

describe('ConfirmOnboardingEmployee', () => {
  let component: ConfirmOnboardingEmployee;
  let fixture: ComponentFixture<ConfirmOnboardingEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOnboardingEmployee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmOnboardingEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
